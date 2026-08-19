"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-cta-gradient text-white shadow-glow hover:shadow-[0_0_45px_-5px_rgba(217,70,239,0.6)] border border-white/10",
  secondary:
    "bg-base-700 text-white border border-white/10 hover:bg-base-600",
  outline:
    "bg-transparent border border-white/15 text-white hover:border-neon-violet/60 hover:bg-white/5",
  ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, children, disabled, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
