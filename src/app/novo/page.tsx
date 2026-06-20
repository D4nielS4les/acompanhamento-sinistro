"use client";

import dynamic from "next/dynamic";

const NewClaimForm = dynamic(() => import("./new-claim-form"), {
  ssr: false,
  loading: () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-card rounded-2xl p-6 border border-border/50 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  ),
});

export default function NewClaim() {
  return <NewClaimForm />;
}
