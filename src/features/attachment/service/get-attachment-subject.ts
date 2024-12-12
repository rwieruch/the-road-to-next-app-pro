import { AttachmentEntity, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import * as attachmentSubjectDTO from "../dto/attachment-subject-dto";

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

      return attachmentSubjectDTO.fromTicket(ticket, user.id);
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

      return attachmentSubjectDTO.fromComment(comment, user.id);
    }
    default:
      return null;
  }
};
