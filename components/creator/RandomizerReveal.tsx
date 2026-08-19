"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice5, Trophy, ShieldCheck, PartyPopper, Instagram, Send, Mail, Crown } from "lucide-react";
import { runFairRandomizer } from "@/lib/randomizer";
import { placeLabel } from "@/lib/prizes";
import { Button } from "@/components/ui/Button";
import type { Participant, Prize, RandomizerResult, Winner } from "@/types";

interface RandomizerRevealProps {
  participants: Participant[];
  prizes: Prize[];
  primaryColor?: string;
  secondaryColor?: string;
  onComplete?: (result: RandomizerResult) => void;
}

function participantLabel(p: Participant) {
  if (p.source === "instagram_comment") return `@${p.instagram?.username ?? p.name}`;
  if (p.source === "telegram_action") return `@${p.telegram?.username ?? p.name}`;
  return p.name;
}

function SourceIcon({ p }: { p: Participant }) {
  if (p.source === "instagram_comment") return <Instagram className="size-3 text-white/30 shrink-0" />;
  if (p.source === "telegram_action") return <Send className="size-3 text-white/30 shrink-0" />;
  return <Mail className="size-3 text-white/30 shrink-0" />;
}

function participantInitials(p: Participant) {
  return participantLabel(p).replace("@", "").slice(0, 2).toUpperCase();
}

const SPIN_MS = 1600;
const PAUSE_MS = 700;

/**
 * Последовательный "барабан" честного розыгрыша: результат для ВСЕХ призов
 * считается один раз атомарно (единый seed + непересекающиеся победители,
 * см. lib/randomizer.ts), но раскрывается пользователю по одному призу за
 * раз, в порядке розыгрыша — сначала главный приз, потом следующий, и т.д.
 */
export function RandomizerReveal({
  participants,
  prizes,
  primaryColor = "#8b5cf6",
  secondaryColor = "#d946ef",
  onComplete,
}: RandomizerRevealProps) {
  const [phase, setPhase] = useState<"idle" | "drawing" | "done">("idle");
  const [cycleLabel, setCycleLabel] = useState<string | null>(null);
  const [drawingPrizeIndex, setDrawingPrizeIndex] = useState(-1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [result, setResult] = useState<RandomizerResult | null>(null);

  const winnersForPrize = (prizeId: string) =>
    (result?.winners.filter((w) => w.prizeId === prizeId) ?? []).sort(
      (a, b) => a.placeInPrize - b.placeInPrize
    );

  const findParticipant = (w: Winner) => participants.find((p) => p.id === w.participantId);

  const handleRun = async () => {
    if (participants.length === 0 || phase === "drawing") return;
    setPhase("drawing");
    setRevealedCount(0);

    const computed = await runFairRandomizer(participants, prizes);
    setResult(computed);

    // Раскрываем приз за призом, чтобы это ощущалось как последовательный розыгрыш.
    for (let i = 0; i < prizes.length; i++) {
      setDrawingPrizeIndex(i);
      const spinInterval = setInterval(() => {
        const random = participants[Math.floor(Math.random() * participants.length)];
        setCycleLabel(participantLabel(random));
      }, 70);

      await new Promise((r) => setTimeout(r, SPIN_MS));
      clearInterval(spinInterval);

      // Сбрасываем "текущий разыгрываемый" ДО отметки "раскрыт" — иначе на
      // одно мгновение оба условия (isDrawingThis и isRevealed) истинны сразу
      // для одного и того же приза, и AnimatePresence mode="wait" получает
      // двух детей одновременно (предупреждение + визуальный глюк).
      setDrawingPrizeIndex(-1);
      setRevealedCount(i + 1);
      await new Promise((r) => setTimeout(r, PAUSE_MS));
    }

    setPhase("done");
    onComplete?.(computed);
  };

  return (
    <div className="rounded-3xl glass border border-white/10 shadow-glass p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-2">
        <Dice5 className="size-5" style={{ color: primaryColor }} />
        <h3 className="text-lg font-semibold text-white">Fair Randomizer</h3>
      </div>
      <p className="text-sm text-white/50">
        Последовательный честный розыгрыш {prizes.length}{" "}
        {prizes.length === 1 ? "приза" : "призов"} среди {participants.length} участников —
        без повторов победителей.
      </p>

      <div className="space-y-2.5">
        {prizes.map((prize, i) => {
          const isRevealed = phase !== "idle" && i < revealedCount;
          const isDrawingThis = phase === "drawing" && drawingPrizeIndex === i;
          const winners = isRevealed ? winnersForPrize(prize.id) : [];

          return (
            <div
              key={prize.id}
              className="rounded-2xl glass-light border border-white/10 p-4 min-h-[76px] flex items-center"
            >
              <div className="flex items-center gap-2 w-32 sm:w-40 shrink-0">
                {i === 0 && <Crown className="size-3.5" style={{ color: primaryColor }} />}
                <div>
                  <p className="text-xs font-semibold text-white/70">{placeLabel(i)}</p>
                  <p className="text-[11px] text-white/35 truncate">{prize.title}</p>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {isDrawingThis && (
                    <motion.p
                      key={cycleLabel}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-sm font-bold text-gradient truncate"
                    >
                      {cycleLabel ?? "..."}
                    </motion.p>
                  )}

                  {isRevealed && (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-1"
                    >
                      {winners.map((w) => {
                        const p = findParticipant(w);
                        if (!p) return null;
                        return (
                          <p key={w.participantId} className="flex items-center gap-1.5 text-sm text-white truncate">
                            <Trophy className="size-3.5 shrink-0" style={{ color: primaryColor }} />
                            <span
                              className="size-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                            >
                              {participantInitials(p)}
                            </span>
                            {participantLabel(p)}
                            <SourceIcon p={p} />
                          </p>
                        );
                      })}
                    </motion.div>
                  )}

                  {!isDrawingThis && !isRevealed && (
                    <p key="pending" className="text-xs text-white/25">
                      {phase === "idle" ? "Ожидает розыгрыша" : "В очереди..."}
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {phase !== "done" ? (
        <Button
          size="lg"
          className="w-full"
          isLoading={phase === "drawing"}
          disabled={participants.length === 0}
          onClick={handleRun}
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <Dice5 className="size-4" />
          Запустить честный розыгрыш
        </Button>
      ) : (
        result && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-neon-lime text-sm font-medium">
              <PartyPopper className="size-4" /> Розыгрыш завершён!
            </div>
            <div className="rounded-xl bg-base-900/50 border border-white/10 p-3.5 space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs text-white/50">
                <ShieldCheck className="size-3.5 text-neon-lime" />
                Проверка честности — любой может пересчитать выбор по этим данным:
              </p>
              <p className="font-mono text-[11px] text-white/40 break-all">seed: {result.seed}</p>
              <p className="font-mono text-[11px] text-white/40 break-all">
                hash: {result.verificationHash}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
