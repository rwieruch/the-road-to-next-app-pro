"use server";

import { redirect } from "next/navigation";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { signInPath, subscriptionPath } from "@/paths";
import { getBaseUrl } from "@/utils/url";

export const createCustomerPortal = async (
  organizationId: string | null | undefined
) => {
  if (!organizationId) {
    redirect(signInPath());
  }

  await getAdminOrRedirect(organizationId);

  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });

  if (!stripeCustomer) {
    return toActionState("ERROR", "Stripe customer not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer.customerId,
    return_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`,
  });

  if (!session.url) {
    return toActionState("ERROR", "Session URL could not be created");
  }

  redirect(session.url);
};
