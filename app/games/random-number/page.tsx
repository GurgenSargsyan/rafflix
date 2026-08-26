"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, RotateCw, AlertCircle } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const GENERATE_MS = 700;

/** Бесплатный генератор случайных чисел в заданном диапазоне [min; max]. */
export default function RandomNumberPage() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const invalid = min >= max;

  const generate = async () => {
    if (isGenerating || invalid) return;
    setIsGenerating(true);

    const spins = 10;
    for (let i = 0; i < spins; i++) {
      setResult(Math.floor(Math.random() * (max - min + 1)) + min);
      await new Promise((r) => setTimeout(r, GENERATE_MS / spins));
    }

    setIsGenerating(false);
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-2xl mx-auto">
      <div className="mb-6">
        <HomeLink />
      </div>

      <div className="text-center mb-10">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          <Logo size="sm" /> · Игра
        </p>
        <h1 className="flex items-center justify-center gap-2.5 text-3xl font-bold text-white">
          <Hash className="size-7 text-neon-cyan" /> Генератор случайных чисел
        </h1>
        <p className="text-white/50 text-sm mt-2">Задайте диапазон — получите честное случайное число.</p>
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-8 space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="От"
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
          <Input
            label="До"
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
        </div>
        {invalid && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="size-3.5" /> «До» должно быть больше «От»
          </p>
        )}

        <div className="relative flex justify-center py-4">
          {/*
            Без mode="wait": новое число монтируется сразу, не дожидаясь
            завершения exit-анимации предыдущего — иначе на фоновой вкладке
            или при reduced-motion (где анимация не докручивается) результат
            "зависал" бы на прежнем значении навсегда.
          */}
          <AnimatePresence initial={false}>
            <motion.span
              key={result ?? "empty"}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, position: "absolute" }}
              transition={{ duration: 0.15 }}
              className="text-6xl sm:text-7xl font-bold text-gradient font-mono tabular-nums"
            >
              {result ?? "?"}
            </motion.span>
          </AnimatePresence>
        </div>

        <Button size="lg" className="w-full" isLoading={isGenerating} disabled={invalid} onClick={generate}>
          <RotateCw className="size-4" />
          Сгенерировать
        </Button>
      </div>
    </main>
  );
}
