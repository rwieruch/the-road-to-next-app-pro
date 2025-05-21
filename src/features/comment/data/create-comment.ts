import { Comment, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type UserInclude = { user: { select: { username: true } } };
type TicketInclude = { ticket: true };
type UserAndTicketInclude = UserInclude & TicketInclude;

type CreateCommentArgs = {
  userId: string;
  ticketId: string;
  content: string;
};

type IncludeOptions = {
  includeUser?: boolean;
  includeTicket?: boolean;
};

type CommentPayload<T extends IncludeOptions> = T extends {
  includeUser: true;
  includeTicket: true;
}
  ? Prisma.CommentGetPayload<{ include: UserAndTicketInclude }>
  : T extends { includeUser: true }
  ? Prisma.CommentGetPayload<{ include: UserInclude }>
  : T extends { includeTicket: true }
  ? Prisma.CommentGetPayload<{ include: TicketInclude }>
  : Comment;

export async function createComment<T extends IncludeOptions>({
  userId,
  ticketId,
  content,
  options,
}: CreateCommentArgs & { options?: T }): Promise<CommentPayload<T>> {
  const includeUser = options?.includeUser && {
    user: {
      select: {
        username: true,
      },
    },
  };

  const includeTicket = options?.includeTicket && {
    ticket: true,
  };

  const comment = await prisma.comment.create({
    data: {
      userId,
      ticketId,
      content,
    },
    include: {
      ...includeUser,
      ...includeTicket,
    },
  });

  return comment as CommentPayload<T>;
}
