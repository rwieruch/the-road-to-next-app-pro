import { AttachmentEntity } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getAttachmentSubject = async (
  entityId: string,
  entity: AttachmentEntity
) => {
  switch (entity) {
    case "TICKET": {
      return await prisma.ticket.findUnique({
        where: {
          id: entityId,
        },
      });
    }
    case "COMMENT": {
      return await prisma.comment.findUnique({
        where: {
          id: entityId,
        },
        include: {
          ticket: true,
        },
      });
    }
    default:
      return null;
  }
};
