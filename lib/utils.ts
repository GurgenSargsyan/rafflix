import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Слияние классов Tailwind с корректным разрешением конфликтов. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Форматирование числа участников: 1280 -> "1 280". */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n);
}

/** Простой хелпер для оставшегося времени до даты (используется таймером). */
export function getTimeLeft(target: string | Date) {
  const total = new Date(target).getTime() - Date.now();
  const clamped = Math.max(total, 0);

  return {
    total: clamped,
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / 1000 / 60) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    isFinished: clamped <= 0,
  };
}
