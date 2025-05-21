import { PAGE_SIZES } from "@/components/pagination/constants";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organizations-by-user";
import { prisma } from "@/lib/prisma";
import { getTicketPermissions } from "../permissions/get-ticket-permissions";
import { ParsedSearchParams } from "../search-params";

export const getTickets = async (
  userId: string | undefined,
  byOrganization: boolean,
  searchParams: ParsedSearchParams
) => {
  const { user } = await getAuth();
  const activeOrganization = await getActiveOrganization();

  if (!PAGE_SIZES.includes(searchParams.size)) {
    throw new Error("Invalid page size");
  }

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

  const organizationsByUser = await getOrganizationsByUser();

  return {
    list: tickets.map((ticket) => {
      const organization = organizationsByUser.find(
        (organization) => organization.id === ticket.organizationId
      );

      return {
        ...ticket,
        isOwner: isOwner(user, ticket),
        permissions: {
          canDeleteTicket:
            isOwner(user, ticket) &&
            !!organization?.membershipByUser.canDeleteTicket,
        },
      };
    }),
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
};
