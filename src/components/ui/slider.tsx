import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "type" | "value" | "onChange"
    > {
    value: number;
    onValueChange?: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    (
        {
            className,
            value,
            onValueChange,
            min = 0,
            max = 100,
            step = 1,
            disabled,
            ...props
        },
        ref
    ) => {
        const clampedValue = Math.min(
            Math.max(value, Number(min)),
            Number(max)
        );

        return (
            <input
                ref={ref}
                type="range"
                min={min}
                max={max}
                step={step}
                value={clampedValue}
                disabled={disabled}
                onChange={(event) =>
                    onValueChange?.(Number(event.target.value))
                }
                className={cn(
                    "h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--emerald-200)] disabled:cursor-not-allowed",
                    "accent-[var(--emerald-600)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald-500)] focus-visible:ring-offset-2",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--emerald-600)]",
                    "[&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(16,185,129,0.45)]",
                    "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--emerald-600)]",
                    "[&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
                    className
                )}
                {...props}
            />
        );
    }
);

Slider.displayName = "Slider";
