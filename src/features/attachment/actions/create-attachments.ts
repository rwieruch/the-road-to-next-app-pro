"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AttachmentEntity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { s3 } from "@/lib/aws";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";
import { ACCEPTED, MAX_SIZE } from "../constants";
import * as attachmentService from "../service";
import { isComment, isTicket } from "../types";
import { generateS3Key } from "../utils/generate-s3-key";
import { getOrganizationIdByAttachment } from "../utils/helpers";
import { sizeInMB } from "../utils/size";

const createAttachmentsSchema = z.object({
  files: z
    .custom<FileList>()
    .transform((files) => Array.from(files))
    .transform((files) => files.filter((file) => file.size > 0))
    .refine(
      (files) => files.every((file) => sizeInMB(file.size) <= MAX_SIZE),
      `The maximum file size is ${MAX_SIZE}MB`
    )
    .refine(
      (files) => files.every((file) => ACCEPTED.includes(file.type)),
      "File type is not supported"
    )
    .refine((files) => files.length !== 0, "File is required"),
});

type CreateAttachmentsArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

export const createAttachments = async (
  { entityId, entity }: CreateAttachmentsArgs,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  const subject = await attachmentService.getAttachmentSubject(
    entityId,
    entity
  );

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not the owner of this subject");
  }

  let attachment;

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    for (const file of files) {
      const buffer = await Buffer.from(await file.arrayBuffer());

      attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          ...(entity === "TICKET" ? { ticketId: entityId } : {}),
          ...(entity === "COMMENT" ? { commentId: entityId } : {}),
          entity,
        },
      });

      const organizationId = getOrganizationIdByAttachment(entity, subject);

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId,
            entityId,
            entity,
            fileName: file.name,
            attachmentId: attachment.id,
          }),
          Body: buffer,
          ContentType: file.type,
        })
      );
    }
  } catch (error) {
    // fallback if S3 upload fails, but attachment was created
    if (attachment) {
      await prisma.attachment.delete({
        where: {
          id: attachment.id,
        },
      });
    }

    return fromErrorToActionState(error);
  }

  switch (entity) {
    case "TICKET":
      if (isTicket(subject)) {
        revalidatePath(ticketPath(subject.id));
      }
      break;
    case "COMMENT": {
      if (isComment(subject)) {
        revalidatePath(ticketPath(subject.ticket.id));
      }
      break;
    }
  }

  return toActionState("SUCCESS", "Attachment(s) uploaded");
};
