import { AttachmentEntity, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getAttachmentSubject = async (
  entityId: string,
  entity: AttachmentEntity,
  user: User
) => {
  switch (entity) {
    case "TICKET": {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: entityId,
        },
      });

      if (!ticket) {
        return null;
      }

      return {
        entityId,
        entity,
        organizationId: ticket.organizationId,
        userId: user.id,
        ticketId: ticket.id,
        commentId: null,
      };
    }
    case "COMMENT": {
      const comment = await prisma.comment.findUnique({
        where: {
          id: entityId,
        },
        include: {
          ticket: true,
        },
      });

      if (!comment) {
        return null;
      }

      return {
        entityId,
        entity,
        organizationId: comment.ticket.organizationId,
        userId: user.id,
        ticketId: comment.ticket.id,
        commentId: comment.id,
      };
    }
    default:
      return null;
  }
};
