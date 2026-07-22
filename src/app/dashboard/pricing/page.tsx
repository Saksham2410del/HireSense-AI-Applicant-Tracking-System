"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, Shield, Loader2 } from "lucide-react";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
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
      } else {
        alert("Something went wrong");
      }
    } catch (e) {
      console.error(e);
      alert("Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Upgrade to unlock unlimited AI resume parsing and find the perfect
          candidate faster than ever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FREE PLAN */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-sm text-gray-500">Perfect to test the waters.</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-gray-900">₹0</span>
            <span className="text-gray-500 font-medium">/lifetime</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-gray-700">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>3 Total AI Scans</span>
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>Basic Candidate Tracking</span>
            </li>
          </ul>
          <button
            disabled
            className="w-full py-3 px-4 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* PLUS PLAN */}
        <div className="bg-white rounded-3xl p-8 border-2 border-blue-500 shadow-lg relative flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Most Popular
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Plus</h3>
            <p className="text-sm text-gray-500">For active hiring managers.</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-gray-900">₹500</span>
            <span className="text-gray-500 font-medium">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-gray-700">
              <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span className="font-bold text-gray-900">
                50 AI Scans per month
              </span>
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span>Advanced AI Analytics</span>
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span>Priority Support</span>
            </li>
          </ul>
          <button
            onClick={() => handleCheckout("PLUS")}
            disabled={loadingPlan === "PLUS"}
            className="w-full py-3 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors flex items-center justify-center"
          >
            {loadingPlan === "PLUS" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Upgrade to Plus"
            )}
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl flex flex-col text-white">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-sm text-gray-400">
              For serious recruiting teams.
            </p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">₹1299</span>
            <span className="text-gray-400 font-medium">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-gray-300">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span className="font-bold text-white">
                200 AI Scans per month
              </span>
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Enterprise AI Analytics</span>
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Dedicated Account Manager</span>
            </li>
          </ul>
          <button
            onClick={() => handleCheckout("PRO")}
            disabled={loadingPlan === "PRO"}
            className="w-full py-3 px-4 rounded-xl font-bold bg-white text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            {loadingPlan === "PRO" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Upgrade to Pro"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
