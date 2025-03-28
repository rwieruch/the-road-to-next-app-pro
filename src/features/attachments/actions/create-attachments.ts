"use server";

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
import { ticketPath } from "@/paths";
import { filesSchema } from "../schema/files";
import * as attachmentService from "../service";

const createAttachmentsSchema = z.object({
  files: filesSchema.refine((files) => files.length !== 0, "File is required"),
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

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    await attachmentService.createAttachments({
      subject,
      entity,
      entityId,
      files,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(subject.ticketId));

  return toActionState("SUCCESS", "Attachment(s) uploaded");
};
