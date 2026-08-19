"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTimeLeft } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: string;
  accentColor?: string;
  onFinish?: () => void;
}

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "дней" },
  { key: "hours", label: "часов" },
  { key: "minutes", label: "минут" },
  { key: "seconds", label: "секунд" },
];

function TimeDigit({ value, accentColor }: { value: number; accentColor?: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="relative overflow-hidden h-12 sm:h-16 w-full">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={padded}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0, position: "absolute" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={accentColor ? { color: accentColor } : undefined}
          className="absolute inset-0 flex items-center justify-center font-mono text-3xl sm:text-5xl font-bold text-gradient tabular-nums"
        >
          {padded}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/**
 * Стильный таймер обратного отсчёта с "прокруткой" цифр при каждом тике.
 *
 * timeLeft инициализируется как null (а не сразу getTimeLeft(targetDate)):
 * секунды на сервере (SSR) и секунды в момент гидратации на клиенте почти
 * всегда отличаются, что даёт React hydration mismatch. Настоящее значение
 * считается только в useEffect — то есть уже после гидратации, на клиенте.
 */
export function CountdownTimer({ targetDate, accentColor, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));
    const interval = setInterval(() => {
      const next = getTimeLeft(targetDate);
      setTimeLeft(next);
      if (next.isFinished) {
        clearInterval(interval);
        onFinish?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onFinish]);

  if (timeLeft?.isFinished) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-semibold text-white/80">Приём заявок завершён 🏁</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="glass rounded-2xl border border-white/10 py-3 px-1 sm:px-2 flex flex-col items-center gap-1"
        >
          <TimeDigit value={timeLeft?.[key] ?? 0} accentColor={accentColor} />
          <span className="text-[10px] sm:text-xs uppercase tracking-wide text-white/40">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
