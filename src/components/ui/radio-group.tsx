import * as React from "react";
import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
    value?: string;
    onValueChange?: (value: string) => void;
    name: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
    null
);

function useRadioGroup() {
    const context = React.useContext(RadioGroupContext);

    if (!context) {
        throw new Error(
            "RadioGroup components must be used inside <RadioGroup />"
        );
    }

    return context;
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    (
        {
            className,
            children,
            value: valueProp,
            defaultValue,
            onValueChange,
            name,
            ...props
        },
        ref
    ) => {
        const generatedName = React.useId();
        const [value, setValue] = React.useState(defaultValue);
        const isControlled = valueProp !== undefined;
        const actualValue = isControlled ? valueProp : value;

        const handleChange = React.useCallback(
            (nextValue: string) => {
                if (!isControlled) {
                    setValue(nextValue);
                }
                onValueChange?.(nextValue);
            },
            [isControlled, onValueChange]
        );

        return (
            <RadioGroupContext.Provider
                value={{
                    value: actualValue,
                    onValueChange: handleChange,
                    name: name ?? generatedName,
                }}
            >
                <div
                    ref={ref}
                    role="radiogroup"
                    className={cn("grid gap-2", className)}
                    {...props}
                >
                    {children}
                </div>
            </RadioGroupContext.Provider>
        );
    }
);

RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<
    HTMLButtonElement,
    RadioGroupItemProps
>(({ value, label, description, icon, className, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useRadioGroup();
    const checked = selectedValue === value;

    return (
        <button
            ref={ref}
            type="button"
            role="radio"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            data-disabled={disabled ? "true" : undefined}
            onClick={() => {
                if (!disabled) {
                    onValueChange?.(value);
                }
            }}
            className={cn(
                "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                "data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-50",
                "hover:border-emerald-400 hover:bg-emerald-50",
                "disabled:cursor-not-allowed disabled:opacity-60",
                className
            )}
            disabled={disabled}
            {...props}
        >
            <span
                className={cn(
                    "mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                    checked
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-emerald-400"
                )}
            >
                {checked && (
                    <span
                        className="size-2 rounded-full bg-white"
                        aria-hidden="true"
                    />
                )}
            </span>
            <span className="flex flex-1 flex-col gap-1 text-sm text-emerald-900">
                <span className="flex items-center gap-2 font-medium">
                    {icon}
                    {label}
                </span>
                {description ? (
                    <span className="text-xs text-emerald-700">
                        {description}
                    </span>
                ) : null}
            </span>
        </button>
    );
});

RadioGroupItem.displayName = "RadioGroupItem";
