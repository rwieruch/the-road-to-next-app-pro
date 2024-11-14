import { Prisma } from "@prisma/client";

export type TicketWithMetadata = Prisma.TicketGetPayload<{
  include: {
    user: {
      select: { username: true };
    };
  };
}> & { isOwner: boolean };
