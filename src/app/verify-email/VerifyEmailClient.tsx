"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    axios.post("http://18.143.206.136/flaskapp/verify-email", { token })
      .then((res) => {
        setStatus(res.data.message);
      })
      .catch((err) => {
        setStatus(
          err?.response?.data?.error || "Verification failed. Invalid or expired token."
        );
      });
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p>{status}</p>
      </div>
    </main>
  );
}
