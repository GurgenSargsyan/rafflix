"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, RotateCw } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const SIDES = ["Орёл", "Решка"] as const;
const FLIP_MS = 900;

/** Бесплатная игра "Флип монеты" — орёл или решка, случайный выбор из двух вариантов. */
export default function CoinFlipPage() {
  const [side, setSide] = useState<0 | 1>(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flips, setFlips] = useState(0);

  const flip = async () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlips((f) => f + 1);

    // Несколько дополнительных "оборотов" + финальный случайный результат — чисто визуальный эффект.
    const result = Math.random() < 0.5 ? 0 : 1;
    await new Promise((r) => setTimeout(r, FLIP_MS));
    setSide(result);
    setIsFlipping(false);
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
          <Coins className="size-7 text-neon-lime" /> Флип монеты
        </h1>
        <p className="text-white/50 text-sm mt-2">Орёл или решка — простое случайное решение на двоих.</p>
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-8 space-y-8">
        <div className="flex justify-center" style={{ perspective: 800 }}>
          <motion.div
            key={flips}
            className="size-36 sm:size-40 rounded-full flex items-center justify-center shadow-glow border-2 border-white/20"
            style={{ background: "linear-gradient(135deg, #a3e635, #22d3ee)" }}
            animate={isFlipping ? { rotateY: [0, 360, 720, 1080] } : { rotateY: 0 }}
            transition={{ duration: FLIP_MS / 1000, ease: "easeInOut" }}
          >
            <span className="text-2xl font-bold text-base-950 font-display">{SIDES[side]}</span>
          </motion.div>
        </div>

        <Button size="lg" className="w-full" isLoading={isFlipping} onClick={flip}>
          <RotateCw className="size-4" />
          Подбросить монету
        </Button>
      </div>
    </main>
  );
}
