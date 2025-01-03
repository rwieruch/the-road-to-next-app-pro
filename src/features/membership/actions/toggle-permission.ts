"use server";

import { revalidatePath } from "next/cache";
import { toActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { membershipsPath } from "@/paths";
import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";

type PermissionKey = "canDeleteTicket";

export const togglePermission = async ({
  userId,
  organizationId,
  permissionKey,
}: {
  userId: string;
  organizationId: string;
  permissionKey: PermissionKey;
}) => {
  await getAdminOrRedirect(organizationId);

  const where = {
    membershipId: {
      userId,
      organizationId,
    },
  };

  const membership = await prisma.membership.findUnique({
    where,
  });

  if (!membership) {
    return toActionState("ERROR", "Membership not found");
  }

  await prisma.membership.update({
    where,
    data: {
      [permissionKey]: membership[permissionKey] === true ? false : true,
    },
  });

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "Permission updated");
};
