"use server";

import { revalidatePath } from "next/cache";
import { setCookieByKey } from "@/actions/cookies";
import { toActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { membershipsPath } from "@/paths";
import { getMemberships } from "../queries/get-memberships";

export const deleteMembership = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const memberships = await getMemberships(organizationId);

  const isLastMembership = (memberships ?? []).length <= 1;

  if (isLastMembership) {
    return toActionState(
      "ERROR",
      "You cannot delete the last membership of an organization"
    );
  }

  await prisma.membership.delete({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
  });

  revalidatePath(membershipsPath(organizationId));

  await setCookieByKey("toast", "The membership has been deleted");
};
