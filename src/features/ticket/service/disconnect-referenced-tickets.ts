import { Comment } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { findIdsFromText } from "@/utils/find-ids-from-text";

export const disconnectReferencedTicketsViaComment = async (
  comment: Comment
) => {
  const ticketId = comment.ticketId;
  const ticketIds = findIdsFromText("tickets", comment.content);

  if (!ticketIds.length) return;

  const comments = await prisma.comment.findMany({
    where: {
      ticketId: comment.ticketId,
      id: {
        not: comment.id,
      },
    },
  });

  const allOtherContent = comments.map((comment) => comment.content).join(" ");

  const allOtherTicketIds = findIdsFromText("tickets", allOtherContent);

  const ticketIdsToRemove = ticketIds.filter(
    (ticketId) => !allOtherTicketIds.includes(ticketId)
  );

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        disconnect: ticketIdsToRemove.map((id) => ({
          id,
        })),
      },
    },
  });
};
