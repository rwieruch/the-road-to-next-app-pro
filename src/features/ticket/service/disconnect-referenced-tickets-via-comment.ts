import { Comment } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";
import * as ticketData from "../data";

export const disconnectReferencedTicketsViaComment = async (
  comment: Comment
) => {
  const ticketIds = findTicketIdsFromText("tickets", comment.content);

  if (!ticketIds.length) return;

  const comments = await prisma.comment.findMany({
    where: {
      ticketId: comment.ticketId,
      id: {
        not: comment.id,
      },
    },
  });

  const allOtherTicketIds = findTicketIdsFromText(
    "tickets",
    comments.map((comment) => comment.content).join(" ")
  );

  const ticketIdsToRemove = ticketIds.filter(
    (ticketId) => !allOtherTicketIds.includes(ticketId)
  );

  await ticketData.disconnectReferencedTickets(
    comment.ticketId,
    ticketIdsToRemove
  );
};
