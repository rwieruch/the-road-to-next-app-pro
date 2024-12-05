import { prisma } from "@/lib/prisma";

export const getAttachments = async (ticketId: string) => {
  return await prisma.attachment.findMany({
    where: {
      ticketId,
    },
  });
};
