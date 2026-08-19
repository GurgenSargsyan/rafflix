"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

/** Простой стильный тоггл с плавной анимацией "таблетки". */
export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-white">{label}</p>}
          {description && <p className="text-xs text-white/45 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
          checked ? "bg-cta-gradient" : "bg-base-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <motion.span
          layout
          className="absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
