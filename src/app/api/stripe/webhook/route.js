import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

function periodEnd(subscription) {
  const seconds =
    subscription.current_period_end || subscription.items.data[0].current_period_end;
  return new Date(seconds * 1000);
}

export async function POST(req) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const data = event.data.object;

  if (event.type === "checkout.session.completed") {
    if (!data.metadata || !data.metadata.clerkUserId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(data.subscription);

    const values = {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: periodEnd(subscription),
      plan: data.metadata.plan,
      scanCount: 0,
    };

    await prisma.userSubscription.upsert({
      where: { clerkUserId: data.metadata.clerkUserId },
      create: { clerkUserId: data.metadata.clerkUserId, ...values },
      update: values,
    });
  }

  if (event.type === "invoice.payment_succeeded" && data.subscription) {
    const subscription = await stripe.subscriptions.retrieve(data.subscription);

    await prisma.userSubscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: periodEnd(subscription),
        scanCount: 0,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
