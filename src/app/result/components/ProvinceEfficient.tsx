"use client";

import React, { useMemo, useState } from "react";
import { ThailandMap } from "@/components/thailand-map";
import { useI18n } from "@/lib/i18n";

type EfficiencyTier = "good" | "neutral" | "poor";

type ProvinceEfficientProps = {
  provinceId?: string | null;
  tier?: EfficiencyTier; // if omitted, defaults to "neutral"
  onProvinceChange?: (provinceId: string) => void;
};

const ProvinceEfficient: React.FC<ProvinceEfficientProps> = ({
  provinceId = null,
  tier = "neutral",
  onProvinceChange,
}) => {
  const { t } = useI18n();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    provinceId
  );

  const currentTier: EfficiencyTier = useMemo(() => tier, [tier]);

  const handleSelect = (id: string) => {
    setSelectedProvince(id);
    onProvinceChange?.(id);
  };

  return (
    <section className="grid gap-6 md:grid-cols-[minmax(280px,1fr)_minmax(320px,1fr)]">
      <div className="rounded-2xl border border-emerald-100 bg-white p-4">
        <ThailandMap
          selectedProvinceId={selectedProvince ?? undefined}
          onSelect={handleSelect}
        />
      </div>

      <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-white p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            {t("result.efficiency.title")}
          </p>
        </div>

        {/* 3-step efficiency bar */}
        <div className="relative grid grid-cols-3 overflow-hidden rounded-xl border border-emerald-100">
          <div
            className={`h-12 border-r border-emerald-100 text-center text-xs font-medium leading-[3rem] ${
              currentTier === "poor" ? "bg-rose-100 text-rose-700" : "bg-rose-50 text-rose-600"
            }`}
          >
            {t("result.efficiency.poor")}
          </div>
          <div
            className={`h-12 border-r border-emerald-100 text-center text-xs font-medium leading-[3rem] ${
              currentTier === "neutral" ? "bg-amber-100 text-amber-800" : "bg-amber-50 text-amber-700"
            }`}
          >
            {t("result.efficiency.neutral")}
          </div>
          <div
            className={`h-12 text-center text-xs font-medium leading-[3rem] ${
              currentTier === "good" ? "bg-emerald-100 text-emerald-800" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {t("result.efficiency.good")}
          </div>

          {/* indicator chevron */}
          <div
            className={`pointer-events-none absolute -top-2 h-0 w-0 border-l-8 border-r-8 border-b-8 border-transparent ${
              currentTier === "poor"
                ? "left-[16.5%] border-b-rose-400"
                : currentTier === "neutral"
                ? "left-1/2 -translate-x-1/2 border-b-amber-500"
                : "right-[16.5%] border-b-emerald-500"
            }`}
          />
        </div>

        {/* helper text */}
        <p className="text-sm text-emerald-700">
          {/* Placeholder message; can be refined later */}
          {currentTier === "good"
            ? "Great solar potential in this area."
            : currentTier === "neutral"
            ? "Decent solar conditions; results may vary."
            : "Challenging conditions; consider system sizing carefully."}
        </p>
      </div>
    </section>
  );
};

export default ProvinceEfficient;
