import Stripe from "stripe";
import * as stripeData from "@/features/stripe/data";

export const onSubscriptionUpdated = async (
  subscription: Stripe.Subscription
) => {
  await stripeData.updateStripeCustomer(subscription);
};
