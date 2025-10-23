"use client";

import Lottie from "lottie-react";
import solarAnimation from "@/assets/solar.json";
import { useI18n } from "@/lib/i18n";

export default function Loading() {
    const { t } = useI18n();

    return (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-[300px]">
                <Lottie animationData={solarAnimation} loop={true} />
            </div>
            <p className="mt-6 text-gray-600 text-lg animate-pulse">
                {t("loading.text")}
            </p>
        </div>
    );
}
