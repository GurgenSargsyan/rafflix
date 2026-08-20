"use client";

import { useEffect, useRef } from "react";

/**
 * Интерактивный фон: мягкое фирменное свечение (violet → fuchsia → cyan),
 * которое следует за курсором. Позиция обновляется через CSS-переменные
 * напрямую на DOM-узле (без React state) — это не вызывает лишних
 * ре-рендеров при каждом движении мыши, только троттлится через rAF.
 * На touch-устройствах курсора нет, поэтому эффект просто не появляется —
 * запасной статичный фон страницы остаётся как есть.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;

    const handleMove = (e: PointerEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--glow-x", `${e.clientX}px`);
        el.style.setProperty("--glow-y", `${e.clientY}px`);
        el.style.opacity = "1";
        rafId = 0;
      });
    };

    const handleLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="cursor-glow" />;
}
