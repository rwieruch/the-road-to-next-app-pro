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
import { isComment, isTicket } from "../types";
import { getOrganizationIdByAttachment } from "../utils/helpers";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      ticket: true,
      comment: {
        include: {
          ticket: true,
        },
      },
    },
  });

  const subject = attachment.ticket ?? attachment.comment;

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
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

    const organizationId = getOrganizationIdByAttachment(
      attachment.entity,
      subject
    );

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        organizationId,
        entityId: subject.id,
        entity: attachment.entity,
        fileName: attachment.name,
        attachmentId: attachment.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  switch (attachment.entity) {
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

  return toActionState("SUCCESS", "Attachment deleted");
};
