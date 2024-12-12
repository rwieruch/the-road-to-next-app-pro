import { AttachmentEntity } from "@prisma/client";
import { AttachmentSubject, isComment, isTicket } from "../types";

export const fromTicket = (
  ticket: AttachmentSubject | null,
  userId: string
) => {
  if (!ticket) {
    return null;
  }

  if (isTicket(ticket)) {
    return {
      entity: "TICKET" as AttachmentEntity,
      entityId: ticket.id,
      organizationId: ticket.organizationId,
      userId,
      ticketId: ticket.id,
      commentId: null,
    };
  }

  return null;
};

export const fromComment = (
  comment: AttachmentSubject | null,
  userId: string
) => {
  if (!comment) {
    return null;
  }

  if (isComment(comment)) {
    return {
      entity: "COMMENT" as AttachmentEntity,
      entityId: comment.id,
      organizationId: comment.ticket.organizationId,
      userId,
      ticketId: comment.ticket.id,
      commentId: comment.id,
    };
  }

  return null;
};
