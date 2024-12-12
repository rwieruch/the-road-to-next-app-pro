import { AttachmentEntity } from "@prisma/client";
import { AttachmentSubject, isComment, isTicket } from "../types";

export class AttachmentSubjectDTO {
  entity: AttachmentEntity;
  entityId: string;
  organizationId: string;
  userId: string;
  ticketId: string;
  commentId: string | null;

  constructor(
    entity: AttachmentEntity,
    entityId: string,
    organizationId: string,
    userId: string,
    ticketId: string,
    commentId: string | null
  ) {
    this.entity = entity;
    this.entityId = entityId;
    this.organizationId = organizationId;
    this.userId = userId;
    this.ticketId = ticketId;
    this.commentId = commentId;
  }

  static fromTicket(ticket: AttachmentSubject | null, userId: string) {
    if (!ticket) {
      return null;
    }

    if (isTicket(ticket)) {
      return new AttachmentSubjectDTO(
        "TICKET",
        ticket.id,
        ticket.organizationId,
        userId,
        ticket.id,
        null
      );
    }

    return null;
  }

  static fromComment(comment: AttachmentSubject | null, userId: string) {
    if (!comment) {
      return null;
    }

    if (isComment(comment)) {
      return new AttachmentSubjectDTO(
        "COMMENT",
        comment.id,
        comment.ticket.organizationId,
        userId,
        comment.ticket.id,
        comment.id
      );
    }

    return null;
  }
}
