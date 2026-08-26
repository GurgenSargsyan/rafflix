"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Split, RotateCw, AlertCircle } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const DRAW_MS = 1500;
const STRAW_HEIGHT = 130; // px — базовая высота соломинки на полную длину (scaleY: 1)
const SHORT_SCALE = 0.32; // короткая соломинка — победитель
const LONG_SCALE_MIN = 0.72;
const LONG_SCALE_MAX = 1;

/** Косметический разброс длины у "длинных" соломинок — только для вида. */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Пучок соломинок в 3D: тот же приём CSS 3D-трансформаций (perspective +
 * rotateX), что и в SpinWheelBackground.tsx — сначала все соломинки торчат
 * из "кулака" на одну неизвестную высоту, при вытягивании раскрывается
 * настоящая длина каждой: победитель всегда достаётся самая короткая.
 */
export default function ShortStrawPage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"idle" | "drawing" | "done">("idle");
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [finalScales, setFinalScales] = useState<number[]>([]);

  const entries = useMemo(
    () => text.split("\n").map((l) => l.trim()).filter(Boolean),
    [text]
  );

  // Порядок отображения перемешивается ОДИН раз на список вариантов (не на
  // каждый рендер!) — иначе соломинки визуально "перепрыгивали" бы местами
  // между стадиями анимации (idle -> drawing -> done).
  const order = useMemo(() => shuffle(entries.map((_, i) => i)), [entries]);

  const draw = async () => {
    if (phase === "drawing" || entries.length < 2) return;
    setPhase("drawing");
    setWinnerIndex(null);

    const winner = Math.floor(Math.random() * entries.length);
    const scales = entries.map((_, i) =>
      i === winner ? SHORT_SCALE : LONG_SCALE_MIN + Math.random() * (LONG_SCALE_MAX - LONG_SCALE_MIN)
    );
    setFinalScales(scales);

    await new Promise((r) => setTimeout(r, DRAW_MS));
    setWinnerIndex(winner);
    setPhase("done");
  };

  const reset = () => {
    setPhase("idle");
    setWinnerIndex(null);
    setFinalScales([]);
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
          <Split className="size-7 text-neon-fuchsia" /> Короткая соломинка
        </h1>
        <p className="text-white/50 text-sm mt-2">Впишите варианты — один вытянет короткую соломинку.</p>
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-white/50">Варианты</label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              reset();
            }}
            placeholder={"Настя\nИгорь\nДиана\nТимур"}
            rows={4}
            className="w-full rounded-xl bg-base-900/50 border border-white/10 p-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-neon-fuchsia/50 resize-none"
          />
          <p className="text-[11px] text-white/30">Один вариант на строку · {entries.length} вариантов</p>
          {entries.length > 0 && entries.length < 2 && (
            <p className="flex items-center gap-1.5 text-xs text-amber-400/80">
              <AlertCircle className="size-3.5" /> Впишите минимум 2 варианта
            </p>
          )}
        </div>

        {entries.length > 0 && (
          <div className="py-4" style={{ perspective: 900 }}>
            <div
              className="flex items-end justify-center gap-3 sm:gap-4 relative"
              style={{ height: STRAW_HEIGHT + 40, transform: "rotateX(38deg)", transformStyle: "preserve-3d" }}
            >
              {/* "Кулак", из которого торчат соломинки — тёмная опора у основания. */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-base-700 to-base-900 border border-white/10"
                style={{ width: `${entries.length * 34 + 20}px`, height: 36, transform: "translateZ(-4px)" }}
              />

              {order.map((i) => {
                const entry = entries[i];
                const isWinner = winnerIndex === i;
                const scale = phase === "idle" ? 0.42 : finalScales[i] ?? 0.42;
                return (
                  <div key={`${i}-${entry}`} className="relative flex flex-col items-center" style={{ width: 22 }}>
                    <motion.div
                      className="w-3.5 rounded-full border border-white/20 shadow-glow"
                      style={{
                        height: STRAW_HEIGHT,
                        transformOrigin: "bottom",
                        background:
                          "linear-gradient(90deg, #6d28d9 0%, #d946ef 35%, #f0abfc 50%, #d946ef 65%, #6d28d9 100%)",
                      }}
                      animate={{ scaleY: scale }}
                      transition={{
                        duration: phase === "drawing" ? DRAW_MS / 1000 : 0.4,
                        delay: phase === "drawing" ? i * 0.06 : 0,
                        ease: "easeOut",
                      }}
                    />
                    <span
                      className={cn(
                        "mt-2 text-[11px] font-medium truncate max-w-[64px] transition-colors",
                        isWinner ? "text-neon-fuchsia" : "text-white/60"
                      )}
                    >
                      {entry}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {winnerIndex != null && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-white"
          >
            🥢 Короткую соломинку вытянул(а): <span className="font-semibold text-neon-fuchsia">{entries[winnerIndex]}</span>
          </motion.p>
        )}

        <Button
          size="lg"
          className="w-full"
          isLoading={phase === "drawing"}
          disabled={entries.length < 2}
          onClick={draw}
        >
          <RotateCw className="size-4" />
          Тянуть соломинку
        </Button>
      </div>
    </main>
  );
}
