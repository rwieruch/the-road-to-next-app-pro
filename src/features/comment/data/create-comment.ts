import { prisma } from "@/lib/prisma";

type CreateCommentArgs = {
  userId: string;
  ticketId: string;
  content: string;
};

export const createComment = async ({
  userId,
  ticketId,
  content,
}: CreateCommentArgs) => {
  return await prisma.comment.create({
    data: {
      userId,
      ticketId,
      content,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      ticket: true,
    },
  });
};
