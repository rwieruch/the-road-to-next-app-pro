import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";

export const getOrganizationsByUser = async () => {
  const { user } = await getAuth();

  if (!user) {
    return [];
  }

  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      memberships: {
        where: {
          userId: user.id,
        },
      },
      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });

  return organizations.map(({ memberships, ...organization }) => ({
    ...organization,
    membershipByUser: memberships[0],
  }));
};
