import { prisma } from "@/lib/prisma";

export const disconnectReferencedTickets = async (
  ticketId: string,
  ticketIds: string[]
) => {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        disconnect: ticketIds.map((id) => ({
          id,
        })),
      },
    },
  });
};
