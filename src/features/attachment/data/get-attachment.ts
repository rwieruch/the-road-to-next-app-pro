import { prisma } from "@/lib/prisma";

export const getAttachment = async (id: string) => {
  return await prisma.attachment.findUnique({
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
};
