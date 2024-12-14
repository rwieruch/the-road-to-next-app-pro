import { prisma } from "@/lib/prisma";

export const getReferencedTickets = async (ticketId: string) => {
  return await prisma.ticket.findMany({
    where: {
      referencedTicketId: ticketId,
    },
  });
};
