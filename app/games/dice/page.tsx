"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dice5, RotateCw } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SIZE = 84;
const HALF = SIZE / 2;
const ROLL_SECONDS = 1.1;

/** Какие из 9 ячеек сетки 3×3 светятся точками для каждого числа 1–6. */
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

/**
 * Поворот ВСЕГО кубика (не отдельной грани), при котором нужная грань
 * оказывается лицом к камере — обратный поворот к тому, каким грань была
 * "приклеена" при сборке кубика (см. FACE_PLACEMENTS ниже).
 */
const FACE_TO_ROTATION: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 },
};

/** Как каждая грань "приклеена" при сборке кубика — placement, а не показ. */
const FACE_PLACEMENTS: { value: number; transform: string }[] = [
  { value: 1, transform: `translateZ(${HALF}px)` },
  { value: 6, transform: `rotateY(180deg) translateZ(${HALF}px)` },
  { value: 3, transform: `rotateY(90deg) translateZ(${HALF}px)` },
  { value: 4, transform: `rotateY(-90deg) translateZ(${HALF}px)` },
  { value: 2, transform: `rotateX(90deg) translateZ(${HALF}px)` },
  { value: 5, transform: `rotateX(-90deg) translateZ(${HALF}px)` },
];

function Face({ value, transform }: { value: number; transform: string }) {
  const active = new Set(PIPS[value]);
  return (
    <div
      className="absolute inset-0 rounded-xl border-2 border-neon-violet/40 shadow-glow grid grid-cols-3 grid-rows-3 gap-1.5 p-3"
      style={{
        transform,
        background: "linear-gradient(135deg, #f5f5f7, #dcdce3)",
        backfaceVisibility: "hidden",
      }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="flex items-center justify-center">
          {active.has(i) && <div className="size-full rounded-full bg-base-950/85" />}
        </div>
      ))}
    </div>
  );
}

/**
 * Настоящий 3D-кубик: 6 граней, каждая "приклеена" на свою сторону куба
 * (FACE_PLACEMENTS), сам куб вращается по X/Y так, чтобы к камере оказалась
 * повёрнута грань с нужным числом (FACE_TO_ROTATION) — тот же приём CSS 3D
 * (perspective + preserve-3d + backface-visibility), что уже используется
 * для монеты и колеса на фоне розыгрыша. Вращение копится вперёд, не
 * сбрасывается к 0 — кубик всегда докручивается, а не "перепрыгивает".
 */
function Die3D({ value, size = SIZE }: { value: number; size?: number }) {
  const [rot, setRot] = useState(() => FACE_TO_ROTATION[value]);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;

    const target = FACE_TO_ROTATION[value];
    const targetXmod = ((target.x % 360) + 360) % 360;
    const targetYmod = ((target.y % 360) + 360) % 360;

    setRot((prev) => {
      const curXmod = ((prev.x % 360) + 360) % 360;
      const curYmod = ((prev.y % 360) + 360) % 360;
      let dx = targetXmod - curXmod;
      if (dx <= 0) dx += 360;
      let dy = targetYmod - curYmod;
      if (dy <= 0) dy += 360;
      return { x: prev.x + 720 + dx, y: prev.y + 720 + dy };
    });
  }, [value]);

  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        className="relative"
        style={{ width: size, height: size, transformStyle: "preserve-3d" }}
        animate={{ rotateX: rot.x, rotateY: rot.y }}
        transition={{ duration: ROLL_SECONDS, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {FACE_PLACEMENTS.map((f) => (
          <Face key={f.value} value={f.value} transform={f.transform} />
        ))}
      </motion.div>
    </div>
  );
}

export default function DicePage() {
  const [diceCount, setDiceCount] = useState<1 | 2>(1);
  const [values, setValues] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);

  const roll = async () => {
    if (isRolling) return;
    setIsRolling(true);
    setValues(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
    await new Promise((r) => setTimeout(r, ROLL_SECONDS * 1000));
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

        <div className="flex items-center justify-center gap-8 py-4">
          {values.map((v, i) => <Die3D key={i} value={v} />)}
        </div>

        {!isRolling && (
          <p className="text-center text-sm text-white/50">
            Выпало: <span className="text-white font-semibold">{values.join(" + ")}</span>
            {values.length > 1 && <> = <span className="text-neon-violet font-semibold">{values.reduce((a, b) => a + b, 0)}</span></>}
          </p>
        )}

        <Button size="lg" className="w-full" isLoading={isRolling} onClick={roll}>
          <RotateCw className="size-4" />
          Бросить
        </Button>
      </div>
    </main>
  );
}
