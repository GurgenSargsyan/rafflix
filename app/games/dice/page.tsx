"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice5, RotateCw } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ROLL_MS = 700;

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <div className="relative size-24 sm:size-28 rounded-3xl glass border border-white/15 shadow-glow flex items-center justify-center">
      {/* Без mode="wait" — иначе на фоновой вкладке/reduced-motion результат "зависнет". */}
      <AnimatePresence initial={false}>
        <motion.span
          key={rolling ? `rolling-${value}` : `final-${value}`}
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, position: "absolute" }}
          transition={{ duration: 0.15 }}
          className="text-5xl sm:text-6xl font-bold text-gradient font-mono"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/** Бесплатная игра "Игральная кость" — 1 или 2 кубика, честный случайный бросок. */
export default function DicePage() {
  const [diceCount, setDiceCount] = useState<1 | 2>(1);
  const [values, setValues] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);

  const roll = async () => {
    if (isRolling) return;
    setIsRolling(true);

    const spins = 8;
    for (let i = 0; i < spins; i++) {
      setValues(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
      await new Promise((r) => setTimeout(r, ROLL_MS / spins));
    }

    setIsRolling(false);
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
          <Dice5 className="size-7 text-neon-violet" /> Игральная кость
        </h1>
        <p className="text-white/50 text-sm mt-2">Брось один или два кубика — честный случайный результат.</p>
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-8 space-y-8">
        <div className="flex justify-center gap-2">
          {([1, 2] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setDiceCount(n);
                setValues(Array.from({ length: n }, () => 1));
              }}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                diceCount === n
                  ? "border-neon-violet/60 bg-neon-violet/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/20"
              )}
            >
              {n} {n === 1 ? "кубик" : "кубика"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          {values.map((v, i) => (
            <Die key={i} value={v} rolling={isRolling} />
          ))}
        </div>

        <Button size="lg" className="w-full" isLoading={isRolling} onClick={roll}>
          <RotateCw className="size-4" />
          Бросить
        </Button>
      </div>
    </main>
  );
}
