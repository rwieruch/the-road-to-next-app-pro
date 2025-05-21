"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";

type DeleteInvitation = {
  email: string;
  organizationId: string;
};

export const deleteInvitation = async ({
  email,
  organizationId,
}: DeleteInvitation) => {
  await getAdminOrRedirect(organizationId);

  const invitation = await prisma.invitation.findUnique({
    where: {
      invitationId: {
        email,
        organizationId,
      },
    },
  });

  if (!invitation) {
    return toActionState("ERROR", "Invitation not found");
  }

  await prisma.invitation.delete({
    where: {
      invitationId: {
        email,
        organizationId,
      },
    },
  });

  return toActionState("SUCCESS", "Invitation deleted");
};
