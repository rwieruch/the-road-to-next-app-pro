"use server";

import { redirect } from "next/navigation";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { pricingPath, signInPath, subscriptionPath } from "@/paths";
import { getBaseUrl } from "@/utils/url";

export const createCheckoutSession = async (
  organizationId: string | null | undefined,
  priceId: string
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

  const price = await stripe.prices.retrieve(priceId);

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    customer: stripeCustomer.customerId,
    mode: "subscription",
    success_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`,
    cancel_url: `${getBaseUrl()}${pricingPath()}`,
    metadata: {
      organizationId,
    },
    subscription_data: {
      metadata: {
        organizationId,
      },
    },
  });

  if (!session.url) {
    return toActionState("ERROR", "Session URL could not be created");
  }

  redirect(session.url);
};
