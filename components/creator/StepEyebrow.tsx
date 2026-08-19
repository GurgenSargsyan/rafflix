"use client";

import { Sparkles } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";

/**
 * Маленькая надпись "ШАГ N" над заголовком шага. Номер считается от реальной
 * позиции в visibleSteps() — так он не сбивается, когда часть шагов скрыта
 * (например, "Условия" пропускается при источнике Instagram-комментарии).
 */
export function StepEyebrow() {
  const stepIndex = useGiveawayStore((s) => s.stepIndex);

  return (
    <div className="flex items-center gap-2 text-neon-cyan">
      <Sparkles className="size-4" />
      <span className="text-xs font-medium uppercase tracking-widest">Шаг {stepIndex + 1}</span>
    </div>
  );
}
