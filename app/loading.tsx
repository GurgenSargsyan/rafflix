import { Loader2 } from "lucide-react";

/**
 * Глобальный fallback на время навигации/компиляции страницы.
 * Next.js показывает его автоматически, пока грузится новый сегмент роута —
 * без этого файла переход между страницами в dev-режиме может выглядеть
 * "зависшим" на пару секунд (первая компиляция роута идёт по требованию).
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white/40">
        <Loader2 className="size-6 animate-spin text-neon-violet" />
        <span className="text-xs uppercase tracking-widest">Загрузка...</span>
      </div>
    </div>
  );
}
