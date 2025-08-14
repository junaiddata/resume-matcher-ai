"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Check, 
  Zap, 
  TrendingUp, 
  Shield, 
  Crown,
  Star,
  AlertCircle,
  CreditCard,
  Users,
  BarChart3,
  Clock
} from "lucide-react";

const plans = [
  { 
    id: "100", 
    name: "Starter", 
    matches: "100",
    price: 99,
    originalPrice: 149,
    popular: false,
    features: [
      "100 Resume Matches",
      "AI-Powered Scoring",
      "Skill Gap Analysis",
      "CSV Export",
      "Email Support",
      "7-day History"
    ],
    icon: <Zap className="w-6 h-6" />
  },
  { 
    id: "500", 
    name: "Professional", 
    matches: "500",
    price: 199,
    originalPrice: 299,
    popular: true,
    features: [
      "500 Resume Matches",
      "AI-Powered Scoring",
      "Advanced Skill Analysis",
      "CSV & PDF Export",
      "Priority Email Support",
      "30-day History",
      "Bulk Upload (up to 50)",
      "Custom Keywords"
    ],
    icon: <TrendingUp className="w-6 h-6" />
  },
  { 
    id: "unlimited", 
    name: "Enterprise", 
    matches: "1000",
    price: 499,
    originalPrice: 799,
    popular: false,
    features: [
      "1000 Resume Matches",
      "AI-Powered Scoring",
      "Advanced Analytics Dashboard",
      "Unlimited History",
      "Bulk Upload (up to 200)",
      "Custom Keywords",
      "API Access",
      "Team Collaboration"
    ],
    icon: <Crown className="w-6 h-6" />
  },
];

export default function PlansPage() {
  const searchParams = useSearchParams();
  const limitReached = searchParams.get("limit") === "true";
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState("500");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!session?.user?.email) {
      alert("Please log in to upgrade.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://resumematcher.duckdns.org/flaskapp/create-checkout-session", {
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
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanDetails = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            {session && (
              <Link href="/profile">
                <button className="text-purple-600 hover:text-purple-700 transition">
                  View Profile
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scale your hiring process with AI-powered resume matching. 
            No hidden fees, cancel anytime.
          </p>
          
          {limitReached && (
            <div className="mt-6 mx-auto max-w-md bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-red-800 font-medium">Free limit reached!</p>
                <p className="text-red-600 text-sm mt-1">
                  Upgrade now to continue matching resumes and unlock premium features.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex items-center text-gray-600">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-sm">Secure Payment</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-sm">10,000+ Happy Users</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="text-sm">4.9/5 Rating</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                selectedPlan === plan.id
                  ? "bg-white shadow-2xl scale-105 border-2 border-purple-500"
                  : "bg-white shadow-lg hover:shadow-xl border border-gray-200"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`inline-flex p-3 rounded-lg mb-4 ${
                plan.popular ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {plan.icon}
              </div>

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="text-gray-500 line-through ml-2">₹{plan.originalPrice}</span>
                <p className="text-sm text-gray-600 mt-1">{plan.matches} matches included</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition ${
                  selectedPlan === plan.id
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Selected Plan Summary */}
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">{selectedPlanDetails?.name} Plan</p>
              <p className="text-sm text-gray-600">{selectedPlanDetails?.matches} resume matches</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{selectedPlanDetails?.price}</p>
              <p className="text-sm text-gray-500 line-through">₹{selectedPlanDetails?.originalPrice}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{selectedPlanDetails?.price}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">
                -₹{(selectedPlanDetails?.originalPrice || 0) - (selectedPlanDetails?.price || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{selectedPlanDetails?.price}</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading || !session}
            className={`w-full mt-6 py-3 rounded-lg font-medium transition transform ${
              loading || !session
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                {session ? "Proceed to Checkout" : "Login to Upgrade"}
              </span>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Features Comparison */}
        <div className="text-center mb-8">
          <button className="text-purple-600 hover:text-purple-700 transition flex items-center mx-auto">
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare all features
          </button>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {/* <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold mb-2">Can I change my plan later?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan anytime from your profile.</p>
            </div> */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold mb-2">What happens when I reach my limit?</h4>
              <p className="text-gray-600">You'll need to upgrade to continue matching resumes. Your history remains accessible.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold mb-2">Is there a refund policy?</h4>
              <p className="text-gray-600">No, But we have a free tier without any payment information</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}