"use client";

import React, { useEffect, useState } from "react";
import Loading from "./loading";
import Overall from "@/app/result/components/Overall";
import ProvinceEfficient from "./components/ProvinceEfficient";
import { useI18n } from "@/lib/i18n";

export default function ResultPage() {
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useI18n();
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
        <main className="py-6 space-y-6 2xl:px-72 ">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold text-emerald-800">
                    {t("result.landing.title")}
                </h1>
                <h1 className="text-5xl font-semibold text-emerald-700">
                    3200 {"->"} 850
                </h1>

                <h2 className="text-lg text-emerald-600">
                    {t("reusult.landing.savings", { value: 2350 })}
                </h2>
                <h2 className="text-lg text-emerald-600">
                    {t("result.landing.ROI", { value: 5 })}
                </h2>

                <h2 className="text-sm text-emerald-600">
                    * ตัวเลขเป็นการประมาณการเบื้องต้นเท่านั้น
                </h2>
            </div>

            <section className="flex flex-col gap-2 rounded-2xl border border-emerald-100 bg-white p-4">
                <Overall />
                <ProvinceEfficient provinceId="bkk" tier="good" />
            </section>
        </main>
    );
}
