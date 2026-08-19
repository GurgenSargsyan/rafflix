"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "@/store/useGiveawayStore";

const STEP_LABELS: Record<WizardStep, string> = {
  basics: "Основное",
  prize: "Приз",
  source: "Источник",
  conditions: "Условия",
  plan: "Тариф",
  branding: "Брендинг",
  review: "Публикация",
};

interface StepIndicatorProps {
  steps: WizardStep[];
  currentIndex: number;
  onStepClick: (step: WizardStep) => void;
}

export function StepIndicator({ steps, currentIndex, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full overflow-x-auto no-scrollbar pb-2">
      {steps.map((step, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 min-w-[90px] last:flex-none">
            <button
              type="button"
              onClick={() => isDone && onStepClick(step)}
              disabled={!isDone && !isActive}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                className={cn(
                  "size-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors duration-300",
                  isActive
                    ? "bg-cta-gradient border-transparent text-white shadow-glow"
                    : isDone
                      ? "bg-neon-violet/20 border-neon-violet/50 text-neon-violet cursor-pointer"
                      : "bg-base-800 border-white/10 text-white/30"
                )}
              >
                {isDone ? <Check className="size-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap transition-colors",
                  isActive ? "text-white" : "text-white/35"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-1.5 bg-white/10 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-cta-gradient"
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
