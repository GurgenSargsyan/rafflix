"use client";

import { motion } from "framer-motion";
import { Gift, Package, Banknote, Users, Trophy, Crown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { placeLabel, totalWinnerCount, resolveShowValue } from "@/lib/prizes";
import type { Prize } from "@/types";

const PRIZE_TYPE_ICON = { physical: Package, digital: Gift, money: Banknote } as const;
const PRIZE_TYPE_LABEL = { physical: "Физический приз", digital: "Цифровой приз", money: "Денежный приз" } as const;

interface PrizeCardProps {
  prizes: Prize[];
  participantsCount: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Карточка приза(ов). Главный приз (prizes[0]) показывается крупно, остальные —
 * компактным списком мест ниже, в порядке последовательного розыгрыша.
 */
export function PrizeCard({ prizes, participantsCount, primaryColor, secondaryColor }: PrizeCardProps) {
  const [mainPrize, ...restPrizes] = prizes;
  const MainIcon = PRIZE_TYPE_ICON[mainPrize.type];
  const winnerCount = totalWinnerCount(prizes);
  const showMainValue = resolveShowValue(mainPrize) && mainPrize.estimatedValue != null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl glass border border-white/10 shadow-glass overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20 animate-pulse-slow"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${primaryColor}, transparent 60%), radial-gradient(circle at 80% 80%, ${secondaryColor}, transparent 55%)`,
        }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border"
            style={{
              color: primaryColor,
              borderColor: `${primaryColor}55`,
              backgroundColor: `${primaryColor}15`,
            }}
          >
            <Crown className="size-3.5" />
            {prizes.length > 1 ? "Главный приз" : PRIZE_TYPE_LABEL[mainPrize.type]}
          </span>
          {showMainValue && (
            <span className="font-mono text-sm text-white/50">
              {mainPrize.type === "money" ? "$" : "≈ $"}
              {formatNumber(mainPrize.estimatedValue!)}
            </span>
          )}
        </div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center size-24 sm:size-28 rounded-2xl mx-auto mb-5 border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}33, ${secondaryColor}33)`,
          }}
        >
          <MainIcon className="size-10 sm:size-12 text-white/90" />
        </motion.div>

        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-1.5">
          {mainPrize.title}
        </h2>
        {mainPrize.description && (
          <p className="text-sm text-white/50 text-center max-w-sm mx-auto">
            {mainPrize.description}
          </p>
        )}

        {restPrizes.length > 0 && (
          <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/35 mb-2">
              Ещё призы (по порядку розыгрыша)
            </p>
            {restPrizes.map((prize, i) => {
              const Icon = PRIZE_TYPE_ICON[prize.type];
              const showValue = resolveShowValue(prize) && prize.estimatedValue != null;
              return (
                <div
                  key={prize.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-base-900/40 border border-white/5"
                >
                  <div
                    className="size-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)` }}
                  >
                    <Icon className="size-4 text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{prize.title}</p>
                    <p className="text-[11px] text-white/35">
                      {placeLabel(i + 1)} · {prize.quantity > 1 ? `×${prize.quantity} победителя` : "1 победитель"}
                    </p>
                  </div>
                  {showValue && (
                    <span className="font-mono text-xs text-white/40 shrink-0">
                      ${formatNumber(prize.estimatedValue!)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Trophy className="size-4" style={{ color: primaryColor }} />
            {winnerCount} {winnerCount === 1 ? "победитель" : "победителей"} · {prizes.length}{" "}
            {prizes.length === 1 ? "приз" : "приза"}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Users className="size-4" style={{ color: secondaryColor }} />
            {formatNumber(participantsCount)} участников
          </div>
        </div>
      </div>
    </motion.div>
  );
}
