import { revalidatePath } from "next/cache";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { hashToken } from "@/utils/crypto";

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

  const bearerToken = new Headers(headers).get("Authorization");
  const authToken = (bearerToken || "").split("Bearer ").at(1);

  if (!authToken) {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  const hashedToken = hashToken(authToken);

  const credential = await prisma.credential.findUnique({
    where: {
      secretHash: hashedToken,
      organizationId: ticket.organizationId,
    },
  });

  if (!credential) {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }

  await prisma.$transaction([
    prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    }),
    prisma.credential.update({
      where: {
        id: credential.id,
      },
      data: {
        lastUsed: new Date(),
      },
    }),
  ]);

  revalidatePath(ticketsPath());

  return Response.json({ ticketId });
}
