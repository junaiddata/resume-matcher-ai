"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

const plans = [
  { id: "100", name: "100 Resume Matches", price: 99 },
  { id: "500", name: "500 Resume Matches", price: 199 },
  { id: "unlimited", name: "1000 Resume Matches", price: 499 },
];

export default function PlansPage() {
  const searchParams = useSearchParams();
  const limitReached = searchParams.get("limit") === "true";
  const { data: session } = useSession();

  const [selectedPlan, setSelectedPlan] = useState("500");

  const handleUpgrade = async () => {
    if (!session?.user?.email) {
      alert("Please log in to upgrade.");
      return;
    }

    const res = await fetch("http://18.143.206.136/flaskapp/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        plan: selectedPlan,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error creating checkout session");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Upgrade Your Plan</h1>
      {limitReached && (
        <p className="mb-6 text-red-600">
          You’ve reached your free limit. Upgrade to continue matching resumes.
        </p>
      )}

      <div className="flex space-x-4 mb-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`px-5 py-3 rounded-xl border ${
              selectedPlan === plan.id
                ? "bg-purple-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {plan.name} - ₹{plan.price}
          </button>
        ))}
      </div>

      <button
        onClick={handleUpgrade}
        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
      >
        Proceed to Checkout
      </button>
    </main>
  );
}
