"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ShieldCheck, ExternalLink, Clock3, Instagram, Send, Twitter, Youtube, Facebook, Mail, Shield } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { CertificateCard } from "@/components/giveaway/CertificateCard";
import { CertificateDownloadButton } from "@/components/giveaway/CertificateDownloadButton";
import { resolveGiveawayTheme } from "@/lib/mock-giveaway";
import { getStoredRandomizerResult } from "@/lib/services/supabase";
import { placeLabel, winnerPlaceLabel } from "@/lib/prizes";
import type { Giveaway, Participant } from "@/types";

interface ResultsViewProps {
  giveaway: Giveaway;
  participants: Participant[];
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
  if (p.source === "instagram_comment") return <Instagram className="size-3.5 text-white/30" />;
  if (p.source === "telegram_action") return <Send className="size-3.5 text-white/30" />;
  if (p.source === "twitter_action") return <Twitter className="size-3.5 text-white/30" />;
  if (p.source === "youtube_comment") return <Youtube className="size-3.5 text-white/30" />;
  if (p.source === "facebook_action") return <Facebook className="size-3.5 text-white/30" />;
  return <Mail className="size-3.5 text-white/30" />;
}

export function ResultsView({ giveaway, participants }: ResultsViewProps) {
  const theme = resolveGiveawayTheme(giveaway);
  // Живой результат (если розыгрыш проводился в этом браузере) важнее статичного демо-фикстура.
  const [result, setResult] = useState(giveaway.randomizerResult ?? null);

  useEffect(() => {
    const live = getStoredRandomizerResult(giveaway.id);
    if (live) setResult(live);
  }, [giveaway.id]);

  // Сортируем по порядку призов в самом розыгрыше (главный приз первым),
  // а не по алфавиту prizeId — иначе порядок мест на экране может не совпадать
  // с реальным порядком последовательного розыгрыша.
  const prizeOrder = new Map(giveaway.prizes.map((p, i) => [p.id, i]));
  const winners = result
    ? [...result.winners].sort(
        (a, b) => (prizeOrder.get(a.prizeId) ?? 0) - (prizeOrder.get(b.prizeId) ?? 0) || a.placeInPrize - b.placeInPrize
      )
    : [];

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16" style={{ backgroundColor: theme.background }}>
      <HomeLink variant="fixed" />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 mb-2">
            Результаты розыгрыша
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-balance">{giveaway.title}</h1>
          <Link
            href={`/g/${giveaway.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors mt-3"
          >
            Открыть страницу розыгрыша <ExternalLink className="size-3.5" />
          </Link>
        </div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center"
          >
            <Clock3 className="size-8 text-white/25 mx-auto mb-3" />
            <p className="text-white font-medium">Победитель пока не выбран</p>
            <p className="text-sm text-white/40 mt-1.5 max-w-sm mx-auto">
              Результаты появятся здесь сразу после того, как организатор запустит Fair Randomizer.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">Победители</h2>
              <div className="space-y-2.5">
                {winners.map((w) => {
                  const prizeIndex = giveaway.prizes.findIndex((p) => p.id === w.prizeId);
                  const prize = giveaway.prizes[prizeIndex];
                  const participant = participants.find((p) => p.id === w.participantId);
                  if (!prize || !participant) return null;
                  return (
                    <div
                      key={`${w.prizeId}-${w.placeInPrize}`}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5"
                    >
                      <div
                        className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                      >
                        {participantLabel(participant).replace("@", "").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                          {w.isBackup ? (
                            <Shield className="size-3.5 text-white/40" />
                          ) : (
                            <Trophy className="size-3.5" style={{ color: theme.primary }} />
                          )}
                          {participantLabel(participant)}
                          <SourceIcon p={participant} />
                        </p>
                        <p className="text-xs text-white/40">
                          {placeLabel(prizeIndex)} · {prize.title}
                          {w.isBackup && ` · ${winnerPlaceLabel(w.placeInPrize, prize.quantity)}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neon-lime uppercase tracking-wide mb-3">
                <ShieldCheck className="size-4" /> Доказательство честности
              </h2>
              <p className="text-sm text-white/45 leading-relaxed mb-4">
                Победитель выбирается из криптографического seed и списка участников. Хэш ниже — это
                SHA-256 от seed и участников; любой может пересчитать выбор по этим данным и убедиться,
                что список не подменялся после розыгрыша.
              </p>
              <div className="rounded-xl bg-black/30 border border-white/10 p-3.5 space-y-1.5">
                <p className="font-mono text-[11px] text-white/40 break-all">seed: {result.seed}</p>
                <p className="font-mono text-[11px] text-white/40 break-all">
                  hash: {result.verificationHash}
                </p>
                <p className="text-[11px] text-white/30 mt-1">
                  Проведён {new Date(result.executedAt).toLocaleString("ru-RU")}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4 text-center">
                Сертификат для Stories
              </h2>
              <CertificateDownloadButton fileName={`rafflix-${giveaway.slug}`}>
                <CertificateCard
                  giveawayTitle={giveaway.title}
                  prizes={giveaway.prizes}
                  result={result}
                  participants={participants}
                  primaryColor={theme.primary}
                  secondaryColor={theme.secondary}
                />
              </CertificateDownloadButton>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
