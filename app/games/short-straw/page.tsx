"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Split, RotateCw, AlertCircle } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const DRAW_MS = 1400;

/** Бесплатная игра "Короткая соломинка" — впишите варианты, один вытянет короткую соломинку. */
export default function ShortStrawPage() {
  const [text, setText] = useState("");
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const entries = useMemo(
    () => text.split("\n").map((l) => l.trim()).filter(Boolean),
    [text]
  );

  const draw = async () => {
    if (isDrawing || entries.length < 2) return;
    setIsDrawing(true);
    setWinnerIndex(null);

    const cycles = 14;
    for (let i = 0; i < cycles; i++) {
      setHighlighted(Math.floor(Math.random() * entries.length));
      await new Promise((r) => setTimeout(r, DRAW_MS / cycles));
    }

    const finalIndex = Math.floor(Math.random() * entries.length);
    setHighlighted(finalIndex);
    setWinnerIndex(finalIndex);
    setIsDrawing(false);
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
            onChange={(e) => setText(e.target.value)}
            placeholder={"Настя\nИгорь\nДиана\nТимур"}
            rows={5}
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
          <div className="flex flex-wrap justify-center gap-2 py-2">
            {entries.map((entry, i) => {
              const isActive = highlighted === i;
              const isWinner = winnerIndex === i;
              return (
                <motion.div
                  key={`${i}-${entry}`}
                  animate={isActive ? { y: -4 } : { y: 0 }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border transition-colors",
                    isWinner
                      ? "border-neon-fuchsia/60 bg-neon-fuchsia/10 shadow-glow"
                      : isActive
                        ? "border-white/30 bg-white/5"
                        : "border-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "w-1.5 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 transition-all",
                      isWinner ? "h-6" : "h-10"
                    )}
                  />
                  <span className="text-xs text-white/80 font-medium truncate max-w-[80px]">{entry}</span>
                </motion.div>
              );
            })}
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
          isLoading={isDrawing}
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
