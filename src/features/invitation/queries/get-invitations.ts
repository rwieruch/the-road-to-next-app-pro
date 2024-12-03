import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";

export const getInvitations = async (organizationId: string) => {
  await getAdminOrRedirect(organizationId);

  return await prisma.invitation.findMany({
    where: {
      organizationId,
    },
    select: {
      email: true,
      createdAt: true,
      invitedByUser: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });
};
