import Stripe from "stripe";
import * as stripeData from "@/features/stripe/data";

export const onSubscriptionCreated = async (
  subscription: Stripe.Subscription
) => {
  await stripeData.updateStripeCustomer(subscription);
};
