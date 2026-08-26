"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, RotateCw, Sparkle, Disc } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const FLIP_SECONDS = 1.7;

/**
 * Настоящая 3D-монета: две отдельные стороны (backface-visibility: hidden)
 * на одном вращающемся по Y элементе внутри perspective-контейнера — тот же
 * приём CSS 3D-трансформаций, что уже используется в SpinWheelBackground.tsx.
 * Вращение накапливается (не сбрасывается к 0), поэтому монета всегда
 * докручивается ВПЕРЁД к нужной стороне — без визуального "скачка".
 */
function CoinFace({
  label,
  icon: Icon,
  gradient,
  flipped,
}: {
  label: string;
  icon: typeof Disc;
  gradient: string;
  flipped?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1 border-[3px] border-white/25 shadow-glow"
      style={{
        background: gradient,
        backfaceVisibility: "hidden",
        transform: flipped ? "rotateY(180deg)" : undefined,
      }}
    >
      <div className="absolute inset-[10%] rounded-full border-2 border-white/20" />
      <Icon className="size-7 text-base-950/70 relative" />
      <span className="text-xl font-bold text-base-950/80 font-display relative">{label}</span>
    </div>
  );
}

export default function CoinFlipPage() {
  const [rotation, setRotation] = useState(0);
  const [side, setSide] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);

  const flip = async () => {
    if (isFlipping) return;
    setIsFlipping(true);

    const result: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
    const targetMod = result === "heads" ? 0 : 180;
    const currentMod = ((rotation % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;

    const spins = 5;
    const next = rotation + spins * 360 + delta;
    setRotation(next);

    await new Promise((r) => setTimeout(r, FLIP_SECONDS * 1000));
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

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-8 space-y-10">
        <div className="flex flex-col items-center" style={{ perspective: 1000 }}>
          <motion.div
            className="relative size-40 sm:size-44"
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              rotateY: rotation,
              y: isFlipping ? [0, -70, -70, 0] : 0,
              rotateX: isFlipping ? [0, 12, -8, 0] : 0,
            }}
            transition={{ duration: FLIP_SECONDS, ease: "easeInOut" }}
          >
            <CoinFace label="ОРЁЛ" icon={Disc} gradient="linear-gradient(135deg, #a3e635, #d9f99d)" />
            <CoinFace label="РЕШКА" icon={Sparkle} gradient="linear-gradient(135deg, #22d3ee, #67e8f9)" flipped />
          </motion.div>

          {/* Тень монеты — сжимается, когда монета "в воздухе", как в тосс-анимации. */}
          <motion.div
            className="mt-6 h-3 rounded-full bg-black/40 blur-sm"
            animate={{ width: isFlipping ? [96, 40, 40, 96] : 96, opacity: isFlipping ? [0.4, 0.15, 0.15, 0.4] : 0.4 }}
            transition={{ duration: FLIP_SECONDS, ease: "easeInOut" }}
          />

          {!isFlipping && (
            <p className={cn("mt-4 text-sm font-medium", side === "heads" ? "text-neon-lime" : "text-neon-cyan")}>
              {side === "heads" ? "Выпал Орёл" : "Выпала Решка"}
            </p>
          )}
        </div>

        <Button size="lg" className="w-full" isLoading={isFlipping} onClick={flip}>
          <RotateCw className="size-4" />
          Подбросить монету
        </Button>
      </div>
    </main>
  );
}
