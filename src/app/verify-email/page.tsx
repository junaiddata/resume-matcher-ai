// /app/verify-email/page.tsx
import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailClient />
    </Suspense>
  );
}