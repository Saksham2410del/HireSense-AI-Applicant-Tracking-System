import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { plan } = await req.json();

    // Check if the user already has a UserSubscription
    let userSubscription = await prisma.userSubscription.findUnique({
      where: { clerkUserId: userId },
    });

    if (!userSubscription) {
      userSubscription = await prisma.userSubscription.create({
        data: {
          clerkUserId: userId,
          plan: "FREE",
          scanCount: 0,
        },
      });
    }

    const price = plan === "PRO" ? 129900 : 50000; // in paise (₹1299 or ₹500)
    const name = plan === "PRO" ? "HireSense Pro Plan" : "HireSense Plus Plan";

    // Create Stripe Checkout Session
    // We use dynamic price_data so the user doesn't even need to pre-create products in the Stripe Dashboard!
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/pricing`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: undefined, // Clerk doesn't guarantee email on the session without extra fetching
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: name,
              description: `Unlimited AI Resume parsing for the ${plan} tier.`,
            },
            unit_amount: price,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        clerkUserId: userId,
        plan: plan,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
