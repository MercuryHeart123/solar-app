"use client";

import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend as ChartLegend,
    Chart,
} from "chart.js";
import { useI18n } from "@/lib/i18n";

type ApplianceDatum = {
    name: string;
    kWh: number;
    color?: string;
};

type OverallProps = {
    data?: ApplianceDatum[];
    billBaht?: number; // monthly electrical bill in THB
    monthKWh?: number; // total kWh used in the current month
};

const DEFAULT_COLORS = [
    "var(--emerald-500)",
    "var(--emerald-400)",
    "var(--emerald-300)",
    "var(--emerald-200)",
    "var(--emerald-100)",
    "var(--emerald-50)",
    "var(--emerald-600)",
    "var(--emerald-700)",
];

const bahtFormatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
});
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);
const Overall: React.FC<OverallProps> = ({ data, billBaht, monthKWh }) => {
    const { t } = useI18n();

    const chartData: Required<ApplianceDatum>[] = useMemo(() => {
        const sample: ApplianceDatum[] =
            data && data.length
                ? data
                : [
                      { name: "AC", kWh: 120 },
                      { name: "Fridge", kWh: 45 },
                      { name: "TV", kWh: 20 },
                      { name: "Laundry", kWh: 35 },
                      { name: "Heater", kWh: 60 },
                  ];
        return sample.map((d, i) => ({
            name: d.name,
            kWh: Math.max(0, d.kWh),
            color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        }));
    }, [data]);

    const totalKWh = useMemo(() => {
        const sum = chartData.reduce((acc, d) => acc + d.kWh, 0);
        return typeof monthKWh === "number" && monthKWh > 0 ? monthKWh : sum;
    }, [chartData, monthKWh]);

    // Chart.js dataset
    const labels = useMemo(() => chartData.map((d) => d.name), [chartData]);
    const values = useMemo(() => chartData.map((d) => d.kWh), [chartData]);
    const colors = useMemo(() => chartData.map((d) => d.color), [chartData]);

    const dataSet = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 4,
                },
            ],
        }),
        [labels, values, colors]
    );

    // Center text plugin
    const centerPlugin = useMemo(() => {
        const plugin = {
            id: "centerText",
            afterDraw(chart: Chart) {
                const {
                    ctx,
                    chartArea: { width, height, left, top },
                } = chart as ChartJS;
                if (!ctx) return;
                ctx.save();

                const cx = left + width / 2;
                const cy = top + height / 2;

                const billText = bahtFormatter.format(
                    typeof billBaht === "number" ? billBaht : 3200
                );
                const kwhText = `${totalKWh} kWh / month`;

                // Bill (primary)
                ctx.fillStyle = "#111827"; // gray-900
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font =
                    "600 18px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
                ctx.fillText(billText, cx, cy - 6);

                // kWh per month (secondary)
                ctx.fillStyle = "#6B7280"; // gray-500/600
                ctx.font =
                    "400 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
                ctx.fillText(kwhText, cx, cy + 14);

                ctx.restore();
            },
        } as const;
        return plugin;
    }, [billBaht, totalKWh]);

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%" as const,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context: {
                            parsed: number;
                            label?: string;
                        }) {
                            const value = context.parsed;
                            const label = context.label ?? "";
                            const pct =
                                totalKWh > 0
                                    ? ((value / totalKWh) * 100).toFixed(1)
                                    : "0.0";
                            return `${label}: ${value} kWh (${pct}%)`;
                        },
                    },
                },
            },
        }),
        [totalKWh]
    );

    return (
        <div className="grid gap-6 md:grid-cols-[minmax(260px,340px)_1fr] items-center">
            <div className="relative">
                <div className="h-[260px] w-full">
                    <Doughnut
                        data={dataSet}
                        options={options}
                        plugins={[centerPlugin]}
                    />
                </div>
            </div>

            {/* legend */}
            <div className="grid gap-3 content-start">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--emerald-700)]">
                    {t("summary.appliances")}
                </h3>
                <ul className="grid gap-2">
                    {chartData.map((d, i) => {
                        const ratio =
                            totalKWh > 0 ? (d.kWh / totalKWh) * 100 : 0;
                        return (
                            <li
                                key={`${d.name}-${i}`}
                                className="flex items-center justify-between rounded-lg border border-[var(--emerald-100)] bg-white p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="inline-block h-3 w-3 rounded-sm"
                                        style={{ backgroundColor: d.color }}
                                        aria-hidden
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        {d.name}
                                    </span>
                                </div>
                                <div className="text-sm tabular-nums text-gray-700">
                                    {d.kWh} kWh
                                    <span className="ml-2 text-gray-500">
                                        ({ratio.toFixed(1)}%)
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Overall;
