import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Optimized Card for 60 FPS rendering
 * - ใช้สีทึบแทน transparency
 * - ตัด backdrop-blur ออก
 * - ลด shadow radius
 * - เพิ่ม transform-gpu (translateZ(0)) เพื่อให้ browser ใช้ GPU compositing layer เดียว
 */
export const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl border border-emerald-100 bg-white transform-gpu will-change-transform shadow-sm",
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pb-0", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-xl font-semibold text-emerald-900", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-3", className)} {...props} />
));
CardContent.displayName = "CardContent";
