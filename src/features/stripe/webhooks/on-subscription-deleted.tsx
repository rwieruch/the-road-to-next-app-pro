import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const onSubscriptionDeleted = async (
  subscription: Stripe.Subscription
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
    },
  });
};
