import { prisma } from "@/lib/prisma";

export const getOrganizationsByUser = async (userId: string | undefined) => {
  if (!userId) {
    return [];
  }

  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: {
          userId,
        },
      },
    },
    include: {
      memberships: true,
    },
  });

  return organizations;
};
