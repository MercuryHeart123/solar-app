"use client";

import React, { useEffect, useState } from "react";
import Loading from "./loading";
import Overall from "@/app/result/components/Overall";
import ProvinceEfficient from "./components/ProvinceEfficient";

export default function ResultPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-emerald-700">
          Overall Usage
        </h1>
        <p className="text-sm text-emerald-700">
          Monthly bill and appliance energy breakdown
        </p>
      </div>

      <section className="rounded-2xl border border-emerald-100 bg-white p-4">
        <Overall />
      </section>
    </main>
  );
}
