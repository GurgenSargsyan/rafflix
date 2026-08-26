"use client";

import { useMemo, useState } from "react";
import { Gauge, Info } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

function rateVerdict(rate: number): { label: string; color: string } {
  if (rate >= 6) return { label: "Отличная вовлечённость", color: "text-neon-lime" };
  if (rate >= 3) return { label: "Хорошая вовлечённость", color: "text-neon-cyan" };
  if (rate >= 1) return { label: "Средняя вовлечённость", color: "text-amber-400" };
  return { label: "Низкая вовлечённость", color: "text-red-400" };
}

/**
 * Калькулятор вовлечённости — считает Engagement Rate по формуле
 * (лайки + комментарии) / подписчики × 100% на ЧИСЛАХ, которые вводит сам
 * пользователь. Никакого запроса к Instagram: мы не можем честно "подтянуть"
 * реальную статистику чужого аккаунта без официального API — а подделывать
 * цифры для случайного username было бы просто обманом. Здесь считаем то,
 * что пользователь знает о своём аккаунте сам.
 */
export default function EngagementCalculatorPage() {
  const [followers, setFollowers] = useState(1000);
  const [avgLikes, setAvgLikes] = useState(50);
  const [avgComments, setAvgComments] = useState(5);

  const rate = useMemo(() => {
    if (followers <= 0) return 0;
    return ((avgLikes + avgComments) / followers) * 100;
  }, [followers, avgLikes, avgComments]);

  const verdict = rateVerdict(rate);

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-2xl mx-auto">
      <div className="mb-6">
        <HomeLink />
      </div>

      <div className="text-center mb-8">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          <Logo size="sm" /> · Инструмент
        </p>
        <h1 className="flex items-center justify-center gap-2.5 text-3xl font-bold text-white">
          <Gauge className="size-7 text-neon-cyan" /> Калькулятор вовлечённости
        </h1>
        <p className="text-white/50 text-sm mt-2">
          Введите свои цифры — посчитаем Engagement Rate по стандартной формуле.
        </p>
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-6 sm:p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-3">
          <Input
            label="Подписчики"
            type="number"
            min={1}
            value={followers}
            onChange={(e) => setFollowers(Math.max(0, Number(e.target.value)))}
          />
          <Input
            label="Ср. лайков на пост"
            type="number"
            min={0}
            value={avgLikes}
            onChange={(e) => setAvgLikes(Math.max(0, Number(e.target.value)))}
          />
          <Input
            label="Ср. комментариев"
            type="number"
            min={0}
            value={avgComments}
            onChange={(e) => setAvgComments(Math.max(0, Number(e.target.value)))}
          />
        </div>

        <div className="text-center py-4">
          <p className="text-6xl font-bold text-gradient font-mono">{rate.toFixed(2)}%</p>
          <p className={cn("text-sm font-medium mt-2", verdict.color)}>{verdict.label}</p>
        </div>

        <div className="rounded-xl bg-base-900/40 border border-white/10 p-3.5 flex items-start gap-2.5">
          <Info className="size-4 text-white/30 shrink-0 mt-0.5" />
          <p className="text-xs text-white/40 leading-relaxed">
            Engagement Rate = (лайки + комментарии) / подписчики × 100%. Ориентиры по индустрии условны
            и различаются по нише — используйте как общий бенчмарк, не абсолютную истину.
          </p>
        </div>
      </div>
    </main>
  );
}
