import * as React from "react";
import { cn } from "@/lib/utils";

export type Step = {
    id: string;
    title: string;
    description?: string;
};

export interface StepperProps extends React.HTMLAttributes<HTMLElement> {
    steps: Step[];
    currentStep: number;
}

export const Stepper = React.forwardRef<HTMLElement, StepperProps>(
    ({ steps, currentStep, className, ...props }, ref) => {
        const clampedCurrent = Math.min(
            Math.max(currentStep, 0),
            steps.length - 1
        );

        return (
            <nav
                ref={ref}
                className={cn("w-full", className)}
                aria-label="Survey progress"
                {...props}
            >
                <ol className="flex items-center justify-between gap-3 sm:gap-4">
                    {steps.map((step, index) => {
                        const status =
                            index < clampedCurrent
                                ? "completed"
                                : index === clampedCurrent
                                ? "current"
                                : "upcoming";

                        return (
                            <li
                                key={step.id}
                                className={cn(
                                    "flex flex-1 items-center gap-3 text-sm sm:text-base",
                                    index === steps.length - 1
                                        ? "flex-none sm:flex-1"
                                        : undefined
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "flex size-8 items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-wide sm:size-9 sm:text-sm",
                                            status === "completed" &&
                                                "border-emerald-500 bg-emerald-500 text-white",
                                            status === "current" &&
                                                "border-emerald-600 bg-white text-emerald-700 shadow-sm",
                                            status === "upcoming" &&
                                                "border-emerald-200 bg-emerald-50 text-emerald-400"
                                        )}
                                        aria-hidden="true"
                                    >
                                        {index + 1}
                                    </span>
                                    <div className="flex flex-col text-xs leading-tight text-emerald-700 sm:text-sm">
                                        <span
                                            className={cn(
                                                "font-medium text-emerald-800",
                                                status === "upcoming" &&
                                                    "text-emerald-600"
                                            )}
                                        >
                                            {step.title}
                                        </span>
                                        {step.description ? (
                                            <span className="text-[10px] text-emerald-600 sm:text-xs">
                                                {step.description}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                {index < steps.length - 1 ? (
                                    <span
                                        className={cn(
                                            "hidden h-px flex-1 rounded-full sm:block",
                                            status === "completed"
                                                ? "bg-emerald-500"
                                                : "bg-emerald-200"
                                        )}
                                        aria-hidden="true"
                                    />
                                ) : null}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        );
    }
);

Stepper.displayName = "Stepper";
