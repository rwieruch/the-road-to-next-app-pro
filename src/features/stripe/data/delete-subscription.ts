import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const deleteStripeSubscription = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      productId: null,
      priceId: null,
      eventAt,
    },
  });
};
