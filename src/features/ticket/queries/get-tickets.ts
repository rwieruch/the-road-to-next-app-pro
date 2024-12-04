import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getActiveMembership } from "@/features/membership/queries/get-active-membership";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { prisma } from "@/lib/prisma";
import { ParsedSearchParams } from "../search-params";

export const getTickets = async (
  userId: string | undefined,
  byOrganization: boolean,
  searchParams: ParsedSearchParams
) => {
  const { user } = await getAuth();
  const activeOrganization = await getActiveOrganization();

  const where = {
    userId,
    title: {
      contains: searchParams.search,
      mode: "insensitive" as const,
    },
    ...(byOrganization && activeOrganization
      ? {
          organizationId: activeOrganization.id,
        }
      : {}),
  };

  const skip = searchParams.size * searchParams.page;
  const take = searchParams.size;

  const [tickets, count] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      skip,
      take,
      orderBy: {
        [searchParams.sortKey]: searchParams.sortValue,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    }),
    prisma.ticket.count({
      where,
    }),
  ]);

  const activeMembership = await getActiveMembership();

  return {
    list: tickets.map((ticket) => ({
      ...ticket,
      isOwner: isOwner(user, ticket),
      permissions: {
        canDeleteTicket:
          isOwner(user, ticket) && !!activeMembership?.canDeleteTicket,
      },
    })),
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
};
