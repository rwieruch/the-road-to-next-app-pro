import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { onSubscriptionCreated } from "@/features/stripe/webhooks/on-subscription-created";
import { onSubscriptionDeleted } from "@/features/stripe/webhooks/on-subscription-deleted";
import { onSubscriptionUpdated } from "@/features/stripe/webhooks/on-subscription-updated";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse("Missing Webhook Secret", {
      status: 500,
    });
  }

  if (!signature) {
    return new NextResponse("Missing Stripe Signature", {
      status: 400,
    });
  }

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "customer.subscription.created":
        onSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        onSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        onSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse("Invalid Stripe Signature", {
      status: 400,
    });
  }
}
