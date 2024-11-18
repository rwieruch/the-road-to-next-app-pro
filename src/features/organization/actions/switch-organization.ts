"use server";

import { revalidatePath } from "next/cache";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { organizationsPath } from "@/paths";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";

export const switchOrganization = async (organizationId: string) => {
  const { user } = await getAuthOrRedirect();

  try {
    const organizations = await getOrganizationsByUser();

    const canSwitch = organizations.some(
      (organization) => organization.id === organizationId
    );

    if (!canSwitch) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await prisma.user.update({
      data: {
        activeOrganizationId: organizationId,
      },
      where: {
        id: user.id,
      },
    });

    const foo = await getOrganizationsByUser();

    console.log(foo);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationsPath());

  return toActionState("SUCCESS", "Active organization has been switched");
};
