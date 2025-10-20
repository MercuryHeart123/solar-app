'use client';

import { useMemo, useState } from "react";

import { MapPicker } from "@/components/map/map-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Stepper } from "@/components/ui/stepper";
import { Slider } from "@/components/ui/slider";

const billOptions = [
  {
    value: "under-75",
    label: "Under $75",
    description: "You keep things efficient and consistent.",
  },
  {
    value: "75-150",
    label: "$75 – $150",
    description: "Most households fall right in this range.",
  },
  {
    value: "150-250",
    label: "$150 – $250",
    description: "Higher usage or variable seasonal bills.",
  },
  {
    value: "over-250",
    label: "Over $250",
    description: "Great solar candidates with big potential savings.",
  },
];

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
  const [billRange, setBillRange] = useState<string>(billOptions[1]?.value);
  const [residenceType, setResidenceType] = useState<string>(
    residenceOptions[0]?.value
  );
  const [occupants, setOccupants] = useState<number>(2);
  const [appliances, setAppliances] = useState<Record<string, number>>(() =>
    appliancePresets.reduce(
      (acc, appliance) => ({ ...acc, [appliance.id]: 0 }),
      {} as Record<string, number>
    )
  );
  const [residenceLocation, setResidenceLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const selectedAppliances = useMemo(
    () =>
      appliancePresets.filter((appliance) => (appliances[appliance.id] ?? 0) > 0),
    [appliances]
  );

  const applianceSummary = useMemo(() => {
    if (!selectedAppliances.length) {
      return "No power-hungry appliances selected yet.";
    }

    return selectedAppliances
      .map(
        (appliance) =>
          `${appliance.label} ×${appliances[appliance.id] ?? 0}`
      )
      .join(", ");
  }, [appliances, selectedAppliances]);

  const toggleAppliance = (id: string, enabled: boolean) => {
    setAppliances((current) => {
      const nextValue = enabled
        ? Math.max(1, current[id] ?? 1)
        : 0;

      return { ...current, [id]: nextValue };
    });
  };

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
      billRange,
      residenceType,
      residenceLocation,
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
              <p className="text-sm text-emerald-700/80">
                Pick the range that matches most months.
              </p>
            </div>
            <RadioGroup
              value={billRange}
              onValueChange={setBillRange}
              className="grid gap-3 md:grid-cols-2"
            >
              {billOptions.map((option) => (
                <RadioGroupItem
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </RadioGroup>
          </section>
        );
      case 1:
        return (
          <section className="grid gap-6">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                2. Residence type
              </h2>
              <p className="text-sm text-emerald-700/80">
                Choose the option that best matches your roof situation.
              </p>
            </div>
            <RadioGroup
              value={residenceType}
              onValueChange={setResidenceType}
              className="grid gap-3 md:grid-cols-3"
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
            <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-white/70 p-5">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-900">
                  Pin your rooftop
                </p>
                <p className="text-xs text-emerald-700/80">
                  Tap on the OpenStreetMap below to drop a pin on your home. Drag
                  to fine-tune the location so we can factor local conditions.
                </p>
              </div>
              <MapPicker
                className="h-72 w-full overflow-hidden rounded-2xl"
                value={residenceLocation}
                onChange={setResidenceLocation}
              />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-emerald-700/90">
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold uppercase tracking-wide text-emerald-800">
                  {residenceLocation
                    ? "Location pinned"
                    : "Drop a pin to capture your rooftop"}
                </span>
                {residenceLocation ? (
                  <span>
                    Lat: {residenceLocation.lat.toFixed(5)} · Lng:{" "}
                    {residenceLocation.lng.toFixed(5)}
                  </span>
                ) : (
                  <span>We’ll use this to tailor sun exposure estimates.</span>
                )}
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
              <p className="text-sm text-emerald-700/80">
                Slide to adjust your household size. Most solar-ready homes fall
                between two and four residents.
              </p>
            </div>
            <div className="grid gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
              <div className="space-y-1">
                <p className="text-base font-medium text-emerald-900">
                  {occupants} resident{occupants > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-emerald-700/80">
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
                    {occupantLimits.min} – {occupantLimits.max}
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
                <p className="text-sm text-emerald-700/80">
                  Check what you run regularly, then slide to match how many you rely on.
                </p>
              </div>
              <div className="grid gap-3">
                {appliancePresets.map((appliance) => {
                  const selected = (appliances[appliance.id] ?? 0) > 0;
                  const quantity = appliances[appliance.id] ?? 0;

                  return (
                    <div
                      key={appliance.id}
                      className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <Label className="flex w-full items-center gap-3 text-base font-medium text-emerald-900 sm:w-auto">
                        <Checkbox
                          checked={selected}
                          onChange={(event) =>
                            toggleAppliance(appliance.id, event.target.checked)
                          }
                          aria-label={appliance.label}
                        />
                        {appliance.label}
                      </Label>
                      <div className="flex w-full flex-col gap-3 sm:w-72">
                        <div className="flex items-center justify-between text-sm font-medium text-emerald-800">
                          <span>Quantity</span>
                          <span className="flex h-9 w-14 items-center justify-center rounded-full bg-emerald-100 text-base font-semibold text-emerald-900">
                            {selected ? quantity : 0}
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={6}
                          step={1}
                          value={selected ? quantity : 0}
                          disabled={!selected}
                          onValueChange={(nextValue) =>
                            handleApplianceQuantity(appliance.id, nextValue)
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
            <section className="grid gap-3 rounded-2xl bg-emerald-600/10 p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Snapshot
                </span>
                <span className="text-xs text-emerald-700/80">
                  Review before sending
                </span>
              </div>
              <div className="grid gap-2 text-sm text-emerald-800 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-emerald-900">Pinned location</p>
                  <p className="text-emerald-700/90">
                    {residenceLocation
                      ? `Lat ${residenceLocation.lat.toFixed(
                          4
                        )}, Lng ${residenceLocation.lng.toFixed(4)}`
                      : "Not pinned yet"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Bill range</p>
                  <p className="text-emerald-700/90">
                    {billOptions.find((option) => option.value === billRange)
                      ?.label ?? "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Residence</p>
                  <p className="text-emerald-700/90">
                    {
                      residenceOptions.find(
                        (option) => option.value === residenceType
                      )?.label
                    }
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    Household size
                  </p>
                  <p className="text-emerald-700/90">
                    {occupants} resident{occupants > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    Appliances & quantities
                  </p>
                  <p className="text-emerald-700/90">{applianceSummary}</p>
                </div>
              </div>
            <p className="text-xs text-emerald-700/90">
              Ready to go? Submit to receive a tailored solar savings estimate in
              your inbox.
            </p>
          </section>
        </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200 px-6 py-12">
      <main className="mx-auto flex max-w-4xl flex-col items-center gap-10">
        <div className="text-center">
          <span className="rounded-full bg-emerald-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Under one minute
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-emerald-900 sm:text-4xl">
            Quick solar readiness check
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-800 sm:text-base">
            Answer four lightweight questions—no typing needed—and we’ll give you
            a personalized starting point for your solar journey.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              Your household snapshot
            </CardTitle>
            <p className="mt-2 text-sm text-emerald-700">
              Tap the options that fit best. You can tweak anything before
              submitting.
            </p>
          </CardHeader>
          <CardContent className="grid gap-8">
            <Stepper steps={steps} currentStep={currentStep} />
            <div className="grid gap-6 rounded-3xl border border-emerald-100/80 bg-white/80 p-6">
              {stepContent}
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-emerald-700/90">
                Step {currentStep + 1} of {steps.length}
              </span>
              <div className="flex items-center gap-3">
                {!isFirstStep && (
                  <Button variant="ghost" size="sm" onClick={handlePrevious}>
                    Back
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={isLastStep ? handleSubmit : handleNext}
                >
                  {isLastStep ? "Submit responses" : "Next question"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
