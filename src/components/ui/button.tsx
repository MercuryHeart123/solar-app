import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
    default:
        "bg-[var(--emerald-600)] text-white hover:bg-[var(--emerald-500)] focus-visible:ring-[var(--emerald-500)]",
    outline:
        "border border-[var(--emerald-600)] text-[var(--emerald-700)] hover:bg-[var(--emerald-50)] focus-visible:ring-[var(--emerald-400)]",
    ghost: "text-[var(--emerald-700)] hover:bg-[var(--emerald-50)] focus-visible:ring-[var(--emerald-400)]",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
};

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant = "default", size = "default", type, ...props },
        ref
    ) => {
        return (
            <button
                ref={ref}
                type={type ?? "button"}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50",
                    "focus-visible:ring-offset-background",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
