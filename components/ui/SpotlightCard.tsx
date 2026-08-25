"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Карточка с "прожектором", следующим за курсором — фирменная деталь этого
 * дизайн-языка (радиальный градиент 300px, ~15% прозрачности, привязан к
 * позиции мыши внутри карточки, а не к экрану целиком — в отличие от
 * CursorGlow, который работает на уровне всей страницы).
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--sy", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "spotlight-card relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.015] overflow-hidden transition-colors duration-300 hover:border-white/[0.14]",
        className
      )}
    >
      <div className="spotlight-card-glow" aria-hidden="true" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
