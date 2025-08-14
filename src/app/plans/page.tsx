import { Suspense } from "react";
import PlansClient from "./PlansClient";



export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PlansClient />;
    </Suspense>
  );
}