import { getTicket } from "@/features/ticket/queries/get-ticket";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  return Response.json(ticket);
}

export async function DELETE(
  { headers }: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  await prisma.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return Response.json({ ticketId });
}
