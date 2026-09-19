import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { planPrice } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { plan } = await req.json();
    const amount = planPrice[plan];
    if (!amount) {
      return new NextResponse("Invalid plan", { status: 400 });
    }

    const existing = await prisma.userSubscription.findUnique({
      where: { clerkUserId: userId },
    });

    if (!existing) {
      await prisma.userSubscription.create({ data: { clerkUserId: userId } });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/dashboard/pricing`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: amount,
            recurring: { interval: "month" },
            product_data: {
              name: `HireSense ${plan} Plan`,
              description: `AI resume parsing for the ${plan} tier.`,
            },
          },
        },
      ],
      metadata: { clerkUserId: userId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
