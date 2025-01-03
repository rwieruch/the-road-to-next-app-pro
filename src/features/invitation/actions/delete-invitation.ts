"use server";

import { revalidatePath } from "next/cache";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { invitationsPath } from "@/paths";

export const deleteInvitation = async (email: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: {
      email,
    },
  });

  if (!invitation) {
    return toActionState("ERROR", "Invitation not found");
  }

  await getAdminOrRedirect(invitation.organizationId);

  await prisma.invitation.delete({
    where: {
      email,
    },
  });

  revalidatePath(invitationsPath(invitation.organizationId));

  return toActionState("SUCCESS", "Invitation deleted");
};
