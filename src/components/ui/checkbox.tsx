import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "size-4 rounded-md border border-emerald-400 text-emerald-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
        "accent-emerald-600",
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";
