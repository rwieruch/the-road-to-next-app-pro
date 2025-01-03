"use server";

import { revalidatePath } from "next/cache";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";
import * as attachmentService from "../service";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  const { attachment, subject } =
    await attachmentService.getAttachmentWithSubject(id, user.id);

  if (!subject || !attachment) {
    return toActionState("ERROR", "Not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    await prisma.attachment.delete({
      where: {
        id,
      },
    });

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        organizationId: subject.organizationId,
        entityId: subject.entityId,
        entity: subject.entity,
        fileName: attachment.name,
        attachmentId: attachment.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  switch (subject.entity) {
    case "TICKET":
      revalidatePath(ticketPath(subject.ticketId));
      break;
    case "COMMENT": {
      revalidatePath(ticketPath(subject.ticketId));
      break;
    }
  }

  return toActionState("SUCCESS", "Attachment deleted");
};
