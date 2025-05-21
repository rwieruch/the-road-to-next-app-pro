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

  const productsWithPrices = [];

  const products = await stripe.products.list({
    active: true,
  });

  for (const product of products.data) {
    const prices = await stripe.prices.list({
      active: true,
      product: product.id,
    });

    productsWithPrices.push({
      product,
      prices: prices.data,
    });
  }

  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      privacy_policy_url: "https://example.com/privacy",
      terms_of_service_url: "https://example.com/terms",
    },
    features: {
      payment_method_update: {
        enabled: true,
      },
      customer_update: {
        allowed_updates: ["name", "email", "address", "tax_id"],
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
      },
      subscription_update: {
        default_allowed_updates: ["price"],
        enabled: true,
        proration_behavior: "create_prorations",
        products: productsWithPrices.map(({ product, prices }) => ({
          product: product.id,
          prices: prices.map((price) => price.id),
        })),
      },
    },
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer.customerId,
    return_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`,
    configuration: configuration.id,
  });

  if (!session.url) {
    return toActionState("ERROR", "Session URL could not be created");
  }

  redirect(session.url);
};
