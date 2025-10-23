"use client";

import { useMemo, useState } from "react";

import { ThailandMap } from "@/components/thailand-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stepper } from "@/components/ui/stepper";
import { Slider } from "@/components/ui/slider";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import {
  THAILAND_PROVINCES,
  type ThailandProvinceId,
} from "@/data/thailand-provinces";
import { useRouter } from "next/navigation";

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

type ResidenceOptionConfig = {
  value: string;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
};

const RESIDENCE_OPTION_CONFIG = [
  {
    value: "house",
    labelKey: "residence.options.house.label",
    descriptionKey: "residence.options.house.description",
  },
  {
    value: "townhouse",
    labelKey: "residence.options.townhouse.label",
    descriptionKey: "residence.options.townhouse.description",
  },
  {
    value: "apartment",
    labelKey: "residence.options.apartment.label",
    descriptionKey: "residence.options.apartment.description",
  },
] satisfies ResidenceOptionConfig[];

type ApplianceOptionConfig = {
  id: string;
  labelKey: TranslationKey;
};

const APPLIANCE_OPTION_CONFIG = [
  { id: "ac", labelKey: "appliances.options.ac" },
  { id: "heater", labelKey: "appliances.options.heater" },
  { id: "laundry", labelKey: "appliances.options.laundry" },
  { id: "fridge", labelKey: "appliances.options.fridge" },
  { id: "tv", labelKey: "appliances.options.tv" },
  { id: "ev", labelKey: "appliances.options.ev" },
] satisfies ApplianceOptionConfig[];

type StepConfig = {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
};

const STEP_CONFIG = [
  {
    id: "bill",
    titleKey: "steps.overview.bill.title",
    descriptionKey: "steps.overview.bill.description",
  },
  {
    id: "residence",
    titleKey: "steps.overview.residence.title",
    descriptionKey: "steps.overview.residence.description",
  },
  {
    id: "household",
    titleKey: "steps.overview.household.title",
    descriptionKey: "steps.overview.household.description",
  },
  {
    id: "appliances",
    titleKey: "steps.overview.appliances.title",
    descriptionKey: "steps.overview.appliances.description",
  },
] satisfies StepConfig[];

const DEFAULT_RESIDENCE_TYPE = RESIDENCE_OPTION_CONFIG[0]?.value ?? "house";

const DEFAULT_PROVINCE_ID: ThailandProvinceId | null = THAILAND_PROVINCES.length
  ? THAILAND_PROVINCES[0].id
  : null;

const APPLIANCE_MAX = 6;

const occupantLimits = {
  min: 1,
  max: 10,
};

export default function Home() {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [monthlyBill, setMonthlyBill] = useState<number>(4000);
  const [residenceType, setResidenceType] = useState<string>(
    DEFAULT_RESIDENCE_TYPE
  );
  const [selectedProvinceId, setSelectedProvinceId] =
    useState<ThailandProvinceId | null>(DEFAULT_PROVINCE_ID);
  const [occupants, setOccupants] = useState<number>(2);
  const [appliances, setAppliances] = useState<Record<string, number>>(() =>
    APPLIANCE_OPTION_CONFIG.reduce(
      (acc, appliance) => ({ ...acc, [appliance.id]: 0 }),
      {} as Record<string, number>
    )
  );

  const steps = useMemo(
    () =>
      STEP_CONFIG.map((step) => ({
        id: step.id,
        title: t(step.titleKey),
        description: t(step.descriptionKey),
      })),
    [t]
  );

  const residenceOptions = useMemo(
    () =>
      RESIDENCE_OPTION_CONFIG.map((option) => ({
        value: option.value,
        label: t(option.labelKey),
        description: t(option.descriptionKey),
      })),
    [t]
  );

  const applianceOptions = useMemo(
    () =>
      APPLIANCE_OPTION_CONFIG.map((appliance) => ({
        id: appliance.id,
        label: t(appliance.labelKey),
      })),
    [t]
  );

  const provinceOptions = useMemo(
    () =>
      THAILAND_PROVINCES.map((province) => ({
        value: province.id,
        label: t(province.nameKey),
      })),
    [t]
  );

  const selectedAppliances = useMemo(
    () =>
      applianceOptions.filter(
        (appliance) => (appliances[appliance.id] ?? 0) > 0
      ),
    [applianceOptions, appliances]
  );

  const selectedProvinceName = useMemo(() => {
    if (!selectedProvinceId) {
      return t("province.notSelected");
    }

    const provinceNameKey =
      THAILAND_PROVINCES.find((province) => province.id === selectedProvinceId)
        ?.nameKey ?? null;

    return provinceNameKey ? t(provinceNameKey) : t("province.notSelected");
  }, [selectedProvinceId, t]);

  const applianceSummary = useMemo(() => {
    if (!selectedAppliances.length) {
      return t("applianceSummary.empty");
    }

    return selectedAppliances
      .map(
        (appliance) => `${appliance.label} ×${appliances[appliance.id] ?? 0}`
      )
      .join(", ");
  }, [appliances, selectedAppliances, t]);

  const householdSummaryLabel = useMemo(
    () =>
      occupants === 1
        ? t("steps.household.summary.single", { count: occupants })
        : t("steps.household.summary.plural", { count: occupants }),
    [occupants, t]
  );

  const router = useRouter();

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
    const clamped = Math.min(Math.max(rounded, 1), APPLIANCE_MAX);
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

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const stepNumber = currentStep + 1;

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

    const refId = "home_survey_2024_06";

    const query = new URLSearchParams({
      refId: refId,
    }).toString();

    router.push(`/result?${query}`);
  };

  const stepContent = (() => {
    switch (currentStep) {
      case 0:
        return (
          <section className="grid gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                {t("steps.bill.heading", { step: stepNumber })}
              </h2>
              <p className="text-sm text-emerald-700">
                {t("steps.bill.description")}
              </p>
            </div>
            <div className="grid gap-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    {t("steps.bill.estimatedSpendLabel")}
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
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMonthlyBill(amount)}
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
                  <span>{t("steps.bill.averageHomes")}</span>
                  <span>{formatBaht(billSlider.max)}</span>
                </div>
                <Slider
                  min={billSlider.min}
                  max={billSlider.max}
                  step={billSlider.step}
                  value={monthlyBill}
                  onValueChange={setMonthlyBill}
                  aria-label={t("steps.bill.sliderAria")}
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
                {t("steps.residence.heading", {
                  step: stepNumber,
                })}
              </h2>
              <p className="text-sm text-emerald-700">
                {t("steps.residence.description")}
              </p>
            </div>
            <div className="grid gap-5 rounded-2xl border border-emerald-100 bg-white p-4 lg:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(260px,1fr)_minmax(260px,1fr)] lg:items-start lg:gap-8">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      {t("steps.residence.map.title")}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {t("steps.residence.map.description")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-white p-3">
                    <ThailandMap
                      selectedProvinceId={selectedProvinceId}
                      onSelect={(provinceId) =>
                        updateProvinceSelection(provinceId)
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
                      {t("steps.residence.map.dropdownLabel")}
                    </label>
                    <p className="text-sm text-emerald-700">
                      {t("steps.residence.map.dropdownDescription")}
                    </p>
                    <SearchableSelect
                      id="province-select"
                      ariaLabel={t("steps.residence.map.dropdownLabel")}
                      placeholder={t("steps.residence.map.placeholder")}
                      emptyMessage={t("steps.residence.map.noResults")}
                      clearLabel={t("searchableSelect.clear")}
                      options={provinceOptions}
                      value={selectedProvinceId}
                      onValueChange={(nextValue) =>
                        updateProvinceSelection(nextValue)
                      }
                    />
                  </div>
                  <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      {t("steps.residence.form.title")}
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
                          description={option.description}
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
                {t("steps.household.heading", {
                  step: stepNumber,
                })}
              </h2>
              <p className="text-sm text-emerald-700">
                {t("steps.household.description")}
              </p>
            </div>
            <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
              <div className="space-y-1">
                <p className="text-base font-medium text-emerald-900">
                  {householdSummaryLabel}
                </p>
                <p className="text-sm text-emerald-700">
                  {occupants <= 2
                    ? t("steps.household.helper.small")
                    : occupants >= 6
                    ? t("steps.household.helper.large")
                    : t("steps.household.helper.medium")}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-emerald-700">
                  <span>{t("steps.household.sliderLabel")}</span>
                  <span>
                    {occupantLimits.min} – {occupantLimits.max}
                  </span>
                </div>
                <Slider
                  min={occupantLimits.min}
                  max={occupantLimits.max}
                  step={1}
                  value={occupants}
                  onValueChange={handleOccupantChange}
                  aria-label={t("steps.household.sliderAria")}
                />
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>{occupantLimits.min}</span>
                  <span>
                    {t("steps.household.sliderTypical", {
                      value: 3,
                    })}
                  </span>
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
                  {t("steps.appliances.heading", {
                    step: stepNumber,
                  })}
                </h2>
                <p className="text-sm text-emerald-700">
                  {t("steps.appliances.description")}
                </p>
              </div>
              <div className="grid gap-3">
                {applianceOptions.map((appliance) => {
                  const quantity = appliances[appliance.id] ?? 0;
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
                            {t("steps.appliances.status.active")}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex w-full flex-col gap-3 sm:w-72">
                        <div className="flex items-center justify-between text-sm font-medium text-emerald-800">
                          <span>{t("steps.appliances.quantityLabel")}</span>
                          <span className="flex h-9 w-14 items-center justify-center rounded-full bg-emerald-100 text-base font-semibold text-emerald-900">
                            {quantity}
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={APPLIANCE_MAX}
                          step={1}
                          value={quantity}
                          onValueChange={(nextValue) =>
                            handleApplianceQuantity(appliance.id, nextValue)
                          }
                          aria-label={t("steps.appliances.sliderAria", {
                            appliance: appliance.label,
                          })}
                        />
                        <div className="flex justify-between text-[11px] uppercase tracking-wide text-emerald-600">
                          <span>0</span>
                          <span>3</span>
                          <span>{APPLIANCE_MAX}</span>
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
                  {t("summary.bannerTitle")}
                </span>
                <span className="text-xs text-emerald-700">
                  {t("summary.bannerSubtitle")}
                </span>
              </div>
              <div className="grid gap-2 text-sm text-emerald-800 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-emerald-900">
                    {t("summary.monthlyBill")}
                  </p>
                  <p className="text-emerald-700">{formatBaht(monthlyBill)}</p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    {t("summary.residence")}
                  </p>
                  <p className="text-emerald-700">
                    {
                      residenceOptions.find(
                        (option) => option.value === residenceType
                      )?.label
                    }
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    {t("summary.province")}
                  </p>
                  <p className="text-emerald-700">{selectedProvinceName}</p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    {t("summary.household")}
                  </p>
                  <p className="text-emerald-700">{householdSummaryLabel}</p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    {t("summary.appliances")}
                  </p>
                  <p className="text-emerald-700">{applianceSummary}</p>
                </div>
              </div>
              <p className="text-xs text-emerald-700">{t("summary.cta")}</p>
            </section>
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <main className="mx-auto flex max-w-4xl flex-col items-center gap-10">
      <div className="text-center">
        <span className="rounded-full bg-emerald-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
          {t("hero.badge")}
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-emerald-900 sm:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-emerald-800 sm:text-base">
          {t("hero.subtitle")}
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{t("card.title")}</CardTitle>
          <p className="mt-2 text-sm text-emerald-700">
            {t("card.description")}
          </p>
        </CardHeader>
        <CardContent className="grid gap-8">
          <Stepper steps={steps} currentStep={currentStep} />
          <div className="grid gap-6 rounded-3xl border border-emerald-100 bg-white p-6">
            {stepContent}
          </div>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-emerald-700">
              {t("progress.label", {
                current: stepNumber,
                total: steps.length,
              })}
            </span>
            <div className="flex items-center gap-3">
              {!isFirstStep && (
                <Button variant="ghost" size="sm" onClick={handlePrevious}>
                  {t("buttons.back")}
                </Button>
              )}
              <Button
                size="lg"
                onClick={isLastStep ? handleSubmit : handleNext}
              >
                {isLastStep ? t("buttons.submit") : t("buttons.next")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
