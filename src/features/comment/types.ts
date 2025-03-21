import { Prisma } from "@prisma/client";

export type CommentWithMetadata = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: { username: true };
    };
    attachments: true;
  };
}> & { isOwner: boolean };
