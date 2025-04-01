import { prisma } from "@/lib/prisma";

export const getReferencedTickets = async (ticketId: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      referencedTickets: true,
    },
  });

  return ticket?.referencedTickets ?? [];
};
