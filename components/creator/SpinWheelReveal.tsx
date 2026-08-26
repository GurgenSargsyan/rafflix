"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Disc3,
  Trophy,
  ShieldCheck,
  PartyPopper,
  Instagram,
  Send,
  Twitter,
  Youtube,
  Facebook,
  Mail,
  Crown,
  Shield,
} from "lucide-react";
import { runFairRandomizer } from "@/lib/randomizer";
import { placeLabel, winnerPlaceLabel } from "@/lib/prizes";
import { Button } from "@/components/ui/Button";
import type { Participant, Prize, RandomizerResult, Winner } from "@/types";

interface SpinWheelRevealProps {
  participants: Participant[];
  prizes: Prize[];
  primaryColor?: string;
  secondaryColor?: string;
  onComplete?: (result: RandomizerResult) => void;
}

function participantLabel(p: Participant) {
  if (p.source === "instagram_comment") return `@${p.instagram?.username ?? p.name}`;
  if (p.source === "telegram_action") return `@${p.telegram?.username ?? p.name}`;
  if (p.source === "twitter_action") return `@${p.twitter?.username ?? p.name}`;
  if (p.source === "youtube_comment") return `@${p.youtube?.username ?? p.name}`;
  if (p.source === "facebook_action") return p.facebook?.username ?? p.name;
  return p.name;
}

function SourceIcon({ p }: { p: Participant }) {
  if (p.source === "instagram_comment") return <Instagram className="size-3 text-white/30 shrink-0" />;
  if (p.source === "telegram_action") return <Send className="size-3 text-white/30 shrink-0" />;
  if (p.source === "twitter_action") return <Twitter className="size-3 text-white/30 shrink-0" />;
  if (p.source === "youtube_comment") return <Youtube className="size-3 text-white/30 shrink-0" />;
  if (p.source === "facebook_action") return <Facebook className="size-3 text-white/30 shrink-0" />;
  return <Mail className="size-3 text-white/30 shrink-0" />;
}

function participantInitials(p: Participant) {
  return participantLabel(p).replace("@", "").slice(0, 2).toUpperCase();
}

/** Косметический шаффл — только для того, какие "лишние" имена попадут на колесо. */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MAX_SEGMENTS = 10;
const SPIN_SECONDS = 3.6;
const PAUSE_MS = 900;

/** Сектора колеса: гарантированный победитель + случайная выборка остальных из пула. */
function buildSegments(pool: Participant[], winner: Participant, maxSegments: number): Participant[] {
  const others = shuffle(pool.filter((p) => p.id !== winner.id));
  const filler = others.slice(0, Math.max(0, maxSegments - 1));
  return shuffle([winner, ...filler]);
}

function buildIdleSegments(pool: Participant[], maxSegments: number): Participant[] {
  return shuffle(pool).slice(0, Math.min(maxSegments, pool.length));
}

function conicGradient(segments: Participant[], primaryColor: string, secondaryColor: string): string {
  if (segments.length === 0) return primaryColor;
  const palette = [primaryColor, secondaryColor, `${primaryColor}99`, `${secondaryColor}99`];
  const segAngle = 360 / segments.length;
  const stops = segments
    .map((_, i) => `${palette[i % palette.length]} ${i * segAngle}deg ${(i + 1) * segAngle}deg`)
    .join(", ");
  return `conic-gradient(${stops})`;
}

/**
 * "Колесо Фортуны" — та же честная механика Fair Randomizer (см.
 * lib/randomizer.ts: единый криптографический seed, атомарно посчитанный
 * результат для ВСЕХ призов сразу), но раскрывается не строкой-барабаном
 * (см. RandomizerReveal), а вращением колеса — по образцу
 * it-som.net/ru/spin-wheel/. Победитель на колесе гарантированно есть среди
 * секторов; остальные сектора — случайная выборка участников для вида.
 */
export function SpinWheelReveal({
  participants,
  prizes,
  primaryColor = "#8b5cf6",
  secondaryColor = "#d946ef",
  onComplete,
}: SpinWheelRevealProps) {
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [spinningPrizeIndex, setSpinningPrizeIndex] = useState(-1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [result, setResult] = useState<RandomizerResult | null>(null);
  // Пусто на сервере и на первом клиентском рендере (одинаково — без
  // рассинхрона гидратации), а случайная выборка для "холостого" колеса
  // считается уже после гидратации, в useEffect (см. CountdownTimer.tsx —
  // тот же приём для Math.random()/Date.now() внутри клиентского компонента).
  const [segments, setSegments] = useState<Participant[]>([]);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setSegments(buildIdleSegments(participants, MAX_SEGMENTS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const winnersForPrize = (prizeId: string) =>
    (result?.winners.filter((w) => w.prizeId === prizeId) ?? []).sort(
      (a, b) => a.placeInPrize - b.placeInPrize
    );

  const findParticipant = (w: Winner) => participants.find((p) => p.id === w.participantId);

  const handleRun = async () => {
    if (participants.length === 0 || phase === "spinning") return;
    setPhase("spinning");
    setRevealedCount(0);

    const computed = await runFairRandomizer(participants, prizes);
    setResult(computed);

    let pool = participants;
    let rot = rotation;

    for (let i = 0; i < prizes.length; i++) {
      const prize = prizes[i];
      const prizeWinners = computed.winners
        .filter((w) => w.prizeId === prize.id)
        .sort((a, b) => a.placeInPrize - b.placeInPrize);
      const primaryWinner = prizeWinners[0];
      const winnerParticipant = primaryWinner && participants.find((p) => p.id === primaryWinner.participantId);
      if (!primaryWinner || !winnerParticipant) continue;

      const segs = buildSegments(pool.length ? pool : participants, winnerParticipant, MAX_SEGMENTS);
      const winnerIdx = segs.findIndex((p) => p.id === winnerParticipant.id);
      const segAngle = 360 / segs.length;
      const centerAngle = winnerIdx * segAngle + segAngle / 2;

      // Крутим колесо так, чтобы сектор победителя оказался под указателем
      // (зафиксирован сверху) — плюс несколько полных оборотов для эффекта.
      const currentMod = ((rot % 360) + 360) % 360;
      const finalMod = (360 - centerAngle) % 360;
      let delta = finalMod - currentMod;
      if (delta <= 0) delta += 360;
      rot += 5 * 360 + delta;

      setSegments(segs);
      setSpinningPrizeIndex(i);
      setRotation(rot);

      await new Promise((r) => setTimeout(r, SPIN_SECONDS * 1000));

      setSpinningPrizeIndex(-1);
      setRevealedCount(i + 1);

      // Победители этого приза больше не показываются на следующих колёсах.
      const wonIds = new Set(prizeWinners.map((w) => w.participantId));
      pool = pool.filter((p) => !wonIds.has(p.id));

      await new Promise((r) => setTimeout(r, PAUSE_MS));
    }

    setPhase("done");
    onComplete?.(computed);
  };

  return (
    <div className="rounded-3xl glass border border-white/10 shadow-glass p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2">
        <Disc3 className="size-5" style={{ color: primaryColor }} />
        <h3 className="text-lg font-semibold text-white">Колесо Фортуны</h3>
      </div>
      <p className="text-sm text-white/50">
        Та же честная механика Fair Randomizer — {prizes.length}{" "}
        {prizes.length === 1 ? "приз" : "призов"} среди {participants.length} участников, но
        результат раскрывается вращением колеса.
      </p>

      {/* Само колесо */}
      <div className="relative mx-auto aspect-square w-60 sm:w-72">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg">
          <div
            className="size-0 border-l-[9px] border-r-[9px] border-t-[16px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: secondaryColor }}
          />
        </div>

        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-white/15 shadow-glow overflow-hidden"
          style={{ background: conicGradient(segments, primaryColor, secondaryColor) }}
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ duration: SPIN_SECONDS, ease: [0.12, 0.67, 0.1, 0.99] }}
        >
          {segments.map((p, i) => {
            const segAngle = 360 / segments.length;
            const angle = i * segAngle + segAngle / 2;
            return (
              <div key={p.id} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                <span className="absolute left-1/2 top-2 -translate-x-1/2 max-w-[62px] truncate text-center text-[10px] font-semibold text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                  {participantLabel(p)}
                </span>
              </div>
            );
          })}
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-11 rounded-full glass border border-white/20 flex items-center justify-center shadow-glow">
            <Disc3 className="size-5 text-white/70" />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {prizes.map((prize, i) => {
          const isRevealed = phase !== "idle" && i < revealedCount;
          const isSpinningThis = phase === "spinning" && spinningPrizeIndex === i;
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
                {isSpinningThis ? (
                  <p className="font-mono text-sm font-bold text-gradient">Колесо крутится...</p>
                ) : isRevealed ? (
                  <div className="space-y-1">
                    {winners.map((w) => {
                      const p = findParticipant(w);
                      if (!p) return null;
                      return (
                        <p key={w.participantId} className="flex items-center gap-1.5 text-sm text-white truncate">
                          {w.isBackup ? (
                            <Shield className="size-3.5 shrink-0 text-white/40" />
                          ) : (
                            <Trophy className="size-3.5 shrink-0" style={{ color: primaryColor }} />
                          )}
                          <span
                            className="size-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {participantInitials(p)}
                          </span>
                          {participantLabel(p)}
                          <SourceIcon p={p} />
                          {w.isBackup && (
                            <span className="text-[10px] text-white/35 shrink-0">
                              ({winnerPlaceLabel(w.placeInPrize, prize.quantity)})
                            </span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-white/25">{phase === "idle" ? "Ожидает розыгрыша" : "В очереди..."}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {phase !== "done" ? (
        <Button
          size="lg"
          className="w-full"
          isLoading={phase === "spinning"}
          disabled={participants.length === 0}
          onClick={handleRun}
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <Disc3 className="size-4" />
          Крутить колесо
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
