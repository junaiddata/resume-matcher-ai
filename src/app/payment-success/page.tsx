"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PaymentSuccessPage() {
  const { data: session } = useSession();

  useEffect(() => {
    const confirmPayment = async () => {
      const email = session?.user?.email;
      if (!email) return;

      const res = await fetch("https://resumematcher.duckdns.org/flaskapp/payment-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.message); // e.g., "500 resume matches unlocked!"
    };

    confirmPayment();
  }, [session]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Payment Successful!</h1>
      <p className="text-lg text-gray-700">Thank you for upgrading your plan. You can now match 500 more resumes.</p>
    </main>
  );
}
