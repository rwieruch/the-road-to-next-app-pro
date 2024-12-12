import { AttachmentEntity } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateAttachmentArgs = {
  name: string;
  entity: AttachmentEntity;
  entityId: string;
};

export const createAttachment = async ({
  name,
  entity,
  entityId,
}: CreateAttachmentArgs) => {
  return await prisma.attachment.create({
    data: {
      name,
      ...(entity === "TICKET" ? { ticketId: entityId } : {}),
      ...(entity === "COMMENT" ? { commentId: entityId } : {}),
      entity,
    },
  });
};
