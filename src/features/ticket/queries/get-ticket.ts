import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";

export const getTicket = async (id: string) => {
  const { user } = await getAuth();

  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!ticket) {
    return null;
  }

  return { ...ticket, isOwner: isOwner(user, ticket) };
};
