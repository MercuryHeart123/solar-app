"use client";

import { ChangeEvent, useMemo, useState } from "react";

import { ThailandMap } from "@/components/thailand-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stepper } from "@/components/ui/stepper";
import { Slider } from "@/components/ui/slider";
import {
    THAILAND_PROVINCES,
    type ThailandProvinceId,
} from "@/data/thailand-provinces";

const billSlider = {
    min: 500,
    max: 20000,
    step: 100,
};

const billPresets = [1200, 2500, 4000, 6000, 9000];
const billMidpoint =
    Math.round((billSlider.max + billSlider.min) / 2 / billSlider.step) *
    billSlider.step;

const bahtFormatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
});

const formatBaht = (value: number) => bahtFormatter.format(value);

const residenceOptions = [
    {
        value: "house",
        label: "Single-family home",
        description: "Detached home with rooftop space.",
    },
    {
        value: "townhouse",
        label: "Townhouse",
        description: "Shared walls but your own roof.",
    },
    {
        value: "apartment",
        label: "Apartment / Condo",
        description: "Shared building and common roof.",
    },
];

const appliancePresets = [
    { id: "ac", label: "Air conditioner unit" },
    { id: "heater", label: "Water heater" },
    { id: "laundry", label: "Washer & dryer pair" },
    { id: "fridge", label: "Refrigerator" },
    { id: "tv", label: "Smart TV / Home theater" },
    { id: "ev", label: "EV charger" },
];

const occupantLimits = {
    min: 1,
    max: 10,
};

const steps = [
    {
        id: "bill",
        title: "Bill",
        description: "Monthly spend",
    },
    {
        id: "residence",
        title: "Residence",
        description: "Home type",
    },
    {
        id: "household",
        title: "Household",
        description: "People count",
    },
    {
        id: "appliances",
        title: "Appliances",
        description: "Energy use",
    },
];

export default function Home() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [monthlyBill, setMonthlyBill] = useState<number>(4000);
    const [residenceType, setResidenceType] = useState<string>(
        residenceOptions[0]?.value
    );
    const [selectedProvinceId, setSelectedProvinceId] =
        useState<ThailandProvinceId | null>(
            THAILAND_PROVINCES.length ? THAILAND_PROVINCES[0].id : null
        );
    const [occupants, setOccupants] = useState<number>(2);
    const [appliances, setAppliances] = useState<Record<string, number>>(() =>
        appliancePresets.reduce(
            (acc, appliance) => ({ ...acc, [appliance.id]: 0 }),
            {} as Record<string, number>
        )
    );

    const selectedAppliances = useMemo(
        () =>
            appliancePresets.filter(
                (appliance) => (appliances[appliance.id] ?? 0) > 0
            ),
        [appliances]
    );

    const selectedProvinceName = useMemo(() => {
        if (!selectedProvinceId) {
            return "Not selected";
        }

        return (
            THAILAND_PROVINCES.find(
                (province) => province.id === selectedProvinceId
            )?.name ?? "Not selected"
        );
    }, [selectedProvinceId]);

    const applianceSummary = useMemo(() => {
        if (!selectedAppliances.length) {
            return "No power-hungry appliances set yet.";
        }

        return selectedAppliances
            .map(
                (appliance) =>
                    `${appliance.label} ×${appliances[appliance.id] ?? 0}`
            )
            .join(", ");
    }, [appliances, selectedAppliances]);

    const handleOccupantChange = (value: number) => {
        const rounded = Math.round(value);
        const clamped = Math.min(
            Math.max(rounded, occupantLimits.min),
            occupantLimits.max
        );
        setOccupants(clamped);
    };

    const handleApplianceQuantity = (id: string, value: number) => {
        const rounded = Math.round(value);
        if (rounded <= 0) {
            setAppliances((current) => ({ ...current, [id]: 0 }));
            return;
        }
        const clamped = Math.min(Math.max(rounded, 1), 6);
        setAppliances((current) => ({ ...current, [id]: clamped }));
    };

    const updateProvinceSelection = (provinceId: string | null) => {
        if (!provinceId) {
            setSelectedProvinceId(null);
            return;
        }

        const match = THAILAND_PROVINCES.find(
            (province) => province.id === provinceId
        );
        if (match) {
            setSelectedProvinceId(match.id);
        }
    };

    const handleProvinceDropdownChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        updateProvinceSelection(event.target.value || null);
    };

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((step) => Math.max(step - 1, 0));
    };

    const handleSubmit = () => {
        console.log("Survey responses", {
            monthlyBill,
            residenceType,
            province: {
                id: selectedProvinceId,
                name: selectedProvinceName,
            },
            occupants,
            appliances,
        });
    };

    const stepContent = (() => {
        switch (currentStep) {
            case 0:
                return (
                    <section className="grid gap-4">
                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                                1. Monthly electricity bill
                            </h2>
                            <p className="text-sm text-emerald-700">
                                Slide to match your average bill in Thai Baht
                                (฿). This helps us estimate savings more
                                precisely.
                            </p>
                        </div>
                        <div className="grid gap-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                        Estimated monthly spend
                                    </p>
                                    <p className="text-3xl font-semibold text-emerald-900">
                                        {formatBaht(monthlyBill)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {billPresets.map((amount) => {
                                        const isActive = amount === monthlyBill;
                                        return (
                                            <Button
                                                key={amount}
                                                variant={
                                                    isActive
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setMonthlyBill(amount)
                                                }
                                            >
                                                {formatBaht(amount)}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-emerald-700">
                                    <span>0฿</span>
                                    <span>Average homes</span>
                                    <span>{formatBaht(billSlider.max)}</span>
                                </div>
                                <Slider
                                    min={billSlider.min}
                                    max={billSlider.max}
                                    step={billSlider.step}
                                    value={monthlyBill}
                                    onValueChange={setMonthlyBill}
                                    aria-label="Monthly electricity bill in Thai Baht"
                                />
                                <div className="flex justify-between text-xs text-emerald-600">
                                    <span>{formatBaht(billSlider.min)}</span>
                                    <span>{formatBaht(billMidpoint)}</span>
                                    <span>{formatBaht(billSlider.max)}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 1:
                return (
                    <section className="flex flex-col gap-6 lg:grid-cols-[minmax(280px,1fr)_minmax(320px,1fr)]">
                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                                2. Residence type
                            </h2>
                            <p className="text-sm text-emerald-700">
                                Choose the option that best matches your roof
                                situation and tell us where in Thailand you
                                live.
                            </p>
                        </div>
                        <div className="grid gap-5 rounded-2xl border border-emerald-100 bg-white p-4 lg:p-6">
                            <div className="grid gap-5 lg:grid-cols-[minmax(260px,1fr)_minmax(260px,1fr)] lg:items-start lg:gap-8">
                                <div className="grid gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                            Map your province
                                        </p>
                                        <p className="text-sm text-emerald-700">
                                            Click directly on the map or use the
                                            dropdown. We will highlight the
                                            province in deep green.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-emerald-100 bg-whit p-3">
                                        <ThailandMap
                                            selectedProvinceId={
                                                selectedProvinceId
                                            }
                                            onSelect={(provinceId) =>
                                                updateProvinceSelection(
                                                    provinceId
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-5">
                                    <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-white p-4">
                                        <label
                                            htmlFor="province-select"
                                            className="text-xs font-semibold uppercase tracking-wide text-emerald-600"
                                        >
                                            Province
                                        </label>
                                        <p className="text-sm text-emerald-700">
                                            Selecting your province helps us
                                            tailor the sunshine profile for your
                                            home.
                                        </p>
                                        <select
                                            id="province-select"
                                            value={selectedProvinceId ?? ""}
                                            onChange={
                                                handleProvinceDropdownChange
                                            }
                                            className="h-11 rounded-xl border border-emerald-200 bg-white px-3 text-sm text-emerald-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                                        >
                                            <option value="" disabled>
                                                Choose a province
                                            </option>
                                            {THAILAND_PROVINCES.map(
                                                (province) => (
                                                    <option
                                                        key={province.id}
                                                        value={province.id}
                                                    >
                                                        {province.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-white p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                            Residence style
                                        </p>
                                        <RadioGroup
                                            value={residenceType}
                                            onValueChange={setResidenceType}
                                            className="grid gap-3"
                                        >
                                            {residenceOptions.map((option) => (
                                                <RadioGroupItem
                                                    key={option.value}
                                                    value={option.value}
                                                    label={option.label}
                                                    description={
                                                        option.description
                                                    }
                                                />
                                            ))}
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 2:
                return (
                    <section className="grid gap-4">
                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                                3. People in the home
                            </h2>
                            <p className="text-sm text-emerald-700">
                                Slide to adjust your household size. Most
                                solar-ready homes fall between two and four
                                residents.
                            </p>
                        </div>
                        <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                            <div className="space-y-1">
                                <p className="text-base font-medium text-emerald-900">
                                    {occupants} resident
                                    {occupants > 1 ? "s" : ""}
                                </p>
                                <p className="text-sm text-emerald-700">
                                    {occupants <= 2
                                        ? "Smaller households still drive meaningful demand."
                                        : occupants >= 6
                                        ? "Larger homes often unlock the best solar savings."
                                        : "Nice balance—perfect for solar comparisons."}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-emerald-700">
                                    <span>Household size</span>
                                    <span>
                                        {occupantLimits.min} –{" "}
                                        {occupantLimits.max}
                                    </span>
                                </div>
                                <Slider
                                    min={occupantLimits.min}
                                    max={occupantLimits.max}
                                    step={1}
                                    value={occupants}
                                    onValueChange={handleOccupantChange}
                                    aria-label="Number of people in the home"
                                />
                                <div className="flex justify-between text-xs text-emerald-600">
                                    <span>{occupantLimits.min}</span>
                                    <span>Typical: 3</span>
                                    <span>{occupantLimits.max}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 3:
                return (
                    <div className="grid gap-6">
                        <section className="grid gap-4">
                            <div className="space-y-1">
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                                    4. Power-hungry appliances
                                </h2>
                                <p className="text-sm text-emerald-700">
                                    Slide each bar to match how many you rely
                                    on—leave it at zero if it rarely runs.
                                </p>
                            </div>
                            <div className="grid gap-3">
                                {appliancePresets.map((appliance) => {
                                    const quantity =
                                        appliances[appliance.id] ?? 0;
                                    const isActive = quantity > 0;

                                    return (
                                        <div
                                            key={appliance.id}
                                            className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                                                isActive
                                                    ? "border-emerald-200 bg-emerald-50 shadow-sm"
                                                    : "border-emerald-100"
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                                                <span className="text-base font-medium text-emerald-900">
                                                    {appliance.label}
                                                </span>
                                                {isActive ? (
                                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                                                        In use
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="flex w-full flex-col gap-3 sm:w-72">
                                                <div className="flex items-center justify-between text-sm font-medium text-emerald-800">
                                                    <span>Quantity</span>
                                                    <span className="flex h-9 w-14 items-center justify-center rounded-full bg-emerald-100 text-base font-semibold text-emerald-900">
                                                        {quantity}
                                                    </span>
                                                </div>
                                                <Slider
                                                    min={0}
                                                    max={6}
                                                    step={1}
                                                    value={quantity}
                                                    onValueChange={(
                                                        nextValue
                                                    ) =>
                                                        handleApplianceQuantity(
                                                            appliance.id,
                                                            nextValue
                                                        )
                                                    }
                                                    aria-label={`${appliance.label} quantity`}
                                                />
                                                <div className="flex justify-between text-[11px] uppercase tracking-wide text-emerald-600">
                                                    <span>0</span>
                                                    <span>3</span>
                                                    <span>6</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                        <section className="grid gap-3 rounded-2xl bg-emerald-600 p-5">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                                    Snapshot
                                </span>
                                <span className="text-xs text-emerald-700">
                                    Review before sending
                                </span>
                            </div>
                            <div className="grid gap-2 text-sm text-emerald-800 sm:grid-cols-2">
                                <div>
                                    <p className="font-semibold text-emerald-900">
                                        Monthly bill
                                    </p>
                                    <p className="text-emerald-700">
                                        {formatBaht(monthlyBill)}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-900">
                                        Residence
                                    </p>
                                    <p className="text-emerald-700">
                                        {
                                            residenceOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    residenceType
                                            )?.label
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-900">
                                        Province
                                    </p>
                                    <p className="text-emerald-700">
                                        {selectedProvinceName}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-900">
                                        Household size
                                    </p>
                                    <p className="text-emerald-700">
                                        {occupants} resident
                                        {occupants > 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-900">
                                        Appliances & quantities
                                    </p>
                                    <p className="text-emerald-700">
                                        {applianceSummary}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-emerald-700">
                                Ready to go? Submit to receive a tailored solar
                                savings estimate in your inbox.
                            </p>
                        </section>
                    </div>
                );
            default:
                return null;
        }
    })();

    return (
        <div className="min-h-screen px-6 py-12">
            <main className="mx-auto flex max-w-4xl flex-col items-center gap-10">
                <div className="text-center">
                    <span className="rounded-full bg-emerald-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        Under one minute
                    </span>
                    <h1 className="mt-4 text-3xl font-semibold text-emerald-900 sm:text-4xl">
                        Quick solar readiness check
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-emerald-800 sm:text-base">
                        Answer four lightweight questions—no typing needed—and
                        we’ll give you a personalized starting point for your
                        solar journey.
                    </p>
                </div>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Your household snapshot
                        </CardTitle>
                        <p className="mt-2 text-sm text-emerald-700">
                            Tap the options that fit best. You can tweak
                            anything before submitting.
                        </p>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <Stepper steps={steps} currentStep={currentStep} />
                        <div className="grid gap-6 rounded-3xl border border-emerald-100 bg-white p-6">
                            {stepContent}
                        </div>
                        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-xs text-emerald-700">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                            <div className="flex items-center gap-3">
                                {!isFirstStep && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handlePrevious}
                                    >
                                        Back
                                    </Button>
                                )}
                                <Button
                                    size="lg"
                                    onClick={
                                        isLastStep ? handleSubmit : handleNext
                                    }
                                >
                                    {isLastStep
                                        ? "Submit responses"
                                        : "Next question"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
