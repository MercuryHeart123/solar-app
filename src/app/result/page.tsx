"use client";

import React, { useEffect, useState } from "react";
import Loading from "./loading";

export default function ResultPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ⏳ จำลองโหลดข้อมูล 2 วินาที
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (true) {
        return <Loading />;
    }

    return (
        <main className="p-6 space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-green-600">
                ✅ ผลการวิเคราะห์โซลาร์ของคุณ
            </h1>
            <p>ระบบที่เหมาะสม: 5 kWp</p>
            <p>คืนทุนใน: 6.3 ปี</p>
            <p>ROI โดยประมาณ: 15% ต่อปี</p>
        </main>
    );
}
