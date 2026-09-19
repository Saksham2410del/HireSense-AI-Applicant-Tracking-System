"use client";

import { useState } from "react";
import { Check, Sparkles, Spinner } from "@/components/icons";

const plans = [
  {
    id: "FREE",
    name: "Free",
    tagline: "Perfect to test the waters.",
    price: "₹0",
    period: "/lifetime",
    features: ["3 Total AI Scans", "Basic Candidate Tracking"],
  },
  {
    id: "PLUS",
    name: "Plus",
    tagline: "For active hiring managers.",
    price: "₹500",
    period: "/month",
    features: ["50 AI Scans per month", "Advanced AI Analytics", "Priority Support"],
    popular: true,
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "For serious recruiting teams.",
    price: "₹1299",
    period: "/month",
    features: ["200 AI Scans per month", "Enterprise AI Analytics", "Dedicated Account Manager"],
    dark: true,
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState("");

  async function handleCheckout(plan) {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert("Something went wrong");
    } catch (err) {
      alert("Checkout failed");
    }
    setLoadingPlan("");
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Upgrade to unlock unlimited AI resume parsing and find the perfect candidate faster
          than ever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-8 flex flex-col relative ${
              plan.dark
                ? "bg-gray-900 border border-gray-800 shadow-xl text-white"
                : plan.popular
                  ? "bg-white border-2 border-blue-500 shadow-lg md:-translate-y-4"
                  : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-2 ${plan.dark ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm ${plan.dark ? "text-gray-400" : "text-gray-500"}`}>
                {plan.tagline}
              </p>
            </div>

            <div className="mb-6">
              <span className={`text-4xl font-extrabold ${plan.dark ? "text-white" : "text-gray-900"}`}>
                {plan.price}
              </span>
              <span className={`font-medium ${plan.dark ? "text-gray-400" : "text-gray-500"}`}>
                {plan.period}
              </span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-center text-sm ${plan.dark ? "text-gray-300" : "text-gray-700"}`}
                >
                  <Check className={`w-5 h-5 mr-3 shrink-0 ${plan.dark ? "text-green-400" : "text-green-500"}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {plan.id === "FREE" ? (
              <button disabled className="w-full py-3 px-4 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center transition-colors ${
                  plan.dark
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                }`}
              >
                {loadingPlan === plan.id ? (
                  <Spinner className="w-5 h-5 animate-spin" />
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
