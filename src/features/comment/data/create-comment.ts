import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateCommentArgs<T> = {
  userId: string;
  ticketId: string;
  content: string;
  include: Prisma.Subset<T, Prisma.CommentInclude>;
};

export const createComment = async <T extends Prisma.CommentInclude>({
  userId,
  ticketId,
  content,
  include,
}: CreateCommentArgs<T>) => {
  return await prisma.comment.create({
    data: {
      userId,
      ticketId,
      content,
    },
    include,
  });
};
