import { AttachmentEntity } from "@prisma/client";
import { AttachmentSubject, isComment, isTicket } from "../types";

export type Type = {
  entityId: string;
  entity: AttachmentEntity;
  organizationId: string;
  userId: string | null;
  ticketId: string;
  commentId: string | null;
};

export const fromTicket = (ticket: AttachmentSubject | null) => {
  if (!ticket || !isTicket(ticket)) {
    return null;
  }

  return {
    entity: "TICKET" as AttachmentEntity,
    entityId: ticket.id,
    organizationId: ticket.organizationId,
    userId: ticket.userId,
    ticketId: ticket.id,
    commentId: null,
  };
};

export const fromComment = (comment: AttachmentSubject | null) => {
  if (!comment || !isComment(comment)) {
    return null;
  }

  return {
    entity: "COMMENT" as AttachmentEntity,
    entityId: comment.id,
    organizationId: comment.ticket.organizationId,
    userId: comment.userId,
    ticketId: comment.ticket.id,
    commentId: comment.id,
  };
};
