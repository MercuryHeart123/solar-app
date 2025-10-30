"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend as ChartLegend,
    LinearScale,
    Tooltip as ChartTooltip,
    TooltipItem,
} from "chart.js";
import { ThailandMap } from "@/components/thailand-map";
import { THAILAND_PROVINCES } from "@/data/thailand-provinces";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PiSunLight } from "react-icons/pi";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTooltip,
    ChartLegend
);

const PROVINCE_BAR_COLOR = "var(--emerald-700)";
const NATIONAL_BAR_COLOR = "var(--emerald-300)";
const NATIONAL_AVERAGE_SCORE = 68;

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

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

    useEffect(() => {
        setSelectedProvince(provinceId ?? null);
    }, [provinceId]);

    const currentTier: EfficiencyTier = useMemo(() => tier, [tier]);
    const activeProvinceId = selectedProvince ?? provinceId ?? null;

    const provinceName = useMemo(() => {
        if (!activeProvinceId) {
            return null;
        }
        const match = THAILAND_PROVINCES.find(
            (province) => province.id === activeProvinceId
        );
        if (!match) {
            return null;
        }
        return t(match.nameKey);
    }, [activeProvinceId, t]);

    const { overallScore, averageSunHours } = useMemo(() => {
        const idSource = activeProvinceId ?? "avg";
        const charTotal = Array.from(idSource).reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
        );
        const normalized = (charTotal % 97) / 96; // 0 – 1 range
        const tierBias =
            currentTier === "good" ? 0.35 : currentTier === "poor" ? -0.35 : 0;
        const baseSunHours = 4.6 + (normalized - 0.5) * 0.8;

        const drySeason = clamp(baseSunHours + 0.5 + tierBias * 0.55, 3.7, 6.3);
        const rainySeason = clamp(
            baseSunHours - 0.4 + tierBias * 0.4,
            2.8,
            5.2
        );
        const coolSeason = clamp(baseSunHours + 0.6 + tierBias * 0.6, 4.0, 6.5);

        const score = Math.round(
            clamp(
                ((drySeason * 0.38 + rainySeason * 0.22 + coolSeason * 0.4) /
                    6) *
                    100,
                45,
                95
            )
        );

        return {
            overallScore: score,
            averageSunHours: Number(
                ((drySeason + rainySeason + coolSeason) / 3).toFixed(1)
            ),
        };
    }, [activeProvinceId, currentTier]);

    const resolvedProvinceName =
        provinceName ??
        (activeProvinceId ? activeProvinceId.toUpperCase() : null);

    const datasetLabel = t("result.efficiency.chart.datasetLabel");
    const provinceLabel = resolvedProvinceName
        ? t("result.efficiency.chart.provinceLabel", {
              province: resolvedProvinceName,
          })
        : t("result.efficiency.chart.selectedFallback");
    const nationalLabel = t("result.efficiency.chart.nationalLabel");

    const chartData = useMemo(
        () => ({
            labels: [provinceLabel, nationalLabel],
            datasets: [
                {
                    label: datasetLabel,
                    data: [overallScore, NATIONAL_AVERAGE_SCORE],
                    backgroundColor: [PROVINCE_BAR_COLOR, NATIONAL_BAR_COLOR],
                    borderRadius: 999,
                    barThickness: 36,
                },
            ],
        }),
        [datasetLabel, nationalLabel, overallScore, provinceLabel]
    );

    const chartOptions = useMemo(
        () => ({
            indexAxis: "y" as const,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { display: false },
                    ticks: {
                        color: "var(--emerald-700)",
                        font: { size: 12 },
                        padding: 8,
                    },
                },
                x: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    ticks: {
                        color: "var(--emerald-700)",
                        stepSize: 20,
                    },
                    grid: {
                        color: "rgba(4, 120, 87, 0.08)",
                    },
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context: TooltipItem<"bar">) => {
                            const parsedValue =
                                typeof context.parsed?.x === "number"
                                    ? context.parsed.x
                                    : Number(
                                          context.raw ??
                                              (context.chart.data.datasets?.[
                                                  context.datasetIndex ?? 0
                                              ]?.data?.[
                                                  context.dataIndex ?? 0
                                              ] as number | undefined) ??
                                              0
                                      );
                            const value = Number.isFinite(parsedValue)
                                ? parsedValue
                                : 0;
                            return t("result.efficiency.chart.tooltip", {
                                score: value.toFixed(0),
                            });
                        },
                    },
                },
            },
        }),
        [t]
    );

    const scoreDelta = overallScore - NATIONAL_AVERAGE_SCORE;
    const summaryText = resolvedProvinceName
        ? t("result.efficiency.chart.summary", {
              province: resolvedProvinceName,
              score: overallScore,
              national: NATIONAL_AVERAGE_SCORE,
              delta: scoreDelta > 0 ? `+${scoreDelta}` : `${scoreDelta}`,
              sunHours: averageSunHours,
          })
        : t("result.efficiency.chart.summaryNoProvince");

    const handleSelect = (id: string) => {
        setSelectedProvince(id);
        onProvinceChange?.(id);
    };

    const cardContents = [
        {
            icon: PiSunLight,
            title: t("result.efficiency.card1.title"),
            tooltip: t("result.efficiency.card1.tooltip"),
            unit: t("result.efficiency.card1.unit"),
            value: averageSunHours,
        },
        {
            icon: PiSunLight,
            title: t("result.efficiency.card1.title"),
            tooltip: t("result.efficiency.card1.tooltip"),
            unit: t("result.efficiency.card1.unit"),
            value: averageSunHours,
        },
        {
            icon: PiSunLight,
            title: t("result.efficiency.card1.title"),
            tooltip: t("result.efficiency.card1.tooltip"),
            unit: t("result.efficiency.card1.unit"),
            value: averageSunHours,
        },
        {
            icon: PiSunLight,
            title: t("result.efficiency.card1.title"),
            tooltip: t("result.efficiency.card1.tooltip"),
            unit: t("result.efficiency.card1.unit"),
            value: averageSunHours,
        },
    ];

    return (
        <section className="grid gap-6 md:grid-cols-[minmax(280px,1fr)_minmax(320px,1fr)]">
            <div className="rounded-2xl border border-[var(--emerald-100)] bg-white p-4">
                <ThailandMap
                    selectedProvinceId={selectedProvince ?? undefined}
                    onSelect={handleSelect}
                />
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--emerald-100)] bg-white p-4">
                <div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="text-xl font-semibold uppercase tracking-wide text-[var(--emerald-600)]">
                            {t("result.efficiency.chart.scoreLabel")}
                        </p>
                        <p className="text-7xl font-semibold text-[var(--emerald-700)] tabular-nums">
                            {overallScore}
                        </p>
                    </div>

                    <div className="h-36 md:h-40">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
                    {cardContents.map((card, index) => (
                        <Card
                            key={index}
                            className="w-full h-full flex flex-col"
                        >
                            <CardHeader>
                                <CardTitle className="text-center">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            {card.title}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{card.tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-around items-center">
                                <div className="flex items-center gap-4">
                                    <card.icon className="text-4xl text-[var(--emerald-500)]" />
                                    <p className="text-4xl font-semibold text-[var(--emerald-700)] tabular-nums">
                                        {card.value}
                                    </p>
                                </div>
                                <p className="text-sm text-[var(--emerald-600)]">
                                    {card.unit}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                    {/* <Card className="w-full h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Card 1</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p>เนื้อหาของการ์ดที่ 1</p>
                        </CardContent>
                    </Card>

                    <Card className="w-full h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Card 2</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p>เนื้อหาของการ์ดที่ 2</p>
                        </CardContent>
                    </Card>

                    <Card className="w-full h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Card 3</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p>เนื้อหาของการ์ดที่ 3</p>
                        </CardContent>
                    </Card>

                    <Card className="w-full h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Card 4</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p>เนื้อหาของการ์ดที่ 4</p>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </section>
    );
};

export default ProvinceEfficient;
