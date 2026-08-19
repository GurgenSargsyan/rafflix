"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

const baseFieldClasses =
  "w-full bg-base-800/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 " +
  "focus:outline-none focus:ring-2 focus:ring-neon-violet/50 focus:border-neon-violet/50 transition-all duration-200";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FieldWrapperProps {
  /** Иконка слева внутри поля (напр. CreditCard для номера карты). */
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, leftIcon, ...props }, ref) => {
    return (
      <label className="block w-full">
        {label && (
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
            {label}
          </span>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              baseFieldClasses,
              leftIcon && "pl-10",
              error && "border-red-500/60 focus:ring-red-500/40",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="mt-1.5 text-xs text-white/35">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </label>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldWrapperProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <label className="block w-full">
        {label && (
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
            {label}
          </span>
        )}
        <textarea
          ref={ref}
          className={cn(baseFieldClasses, "resize-none min-h-[110px]", error && "border-red-500/60 focus:ring-red-500/40", className)}
          {...props}
        />
        {hint && !error && <p className="mt-1.5 text-xs text-white/35">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </label>
    );
  }
);
Textarea.displayName = "Textarea";
