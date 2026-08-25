"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Instagram, Send, Mail, Users, Trophy, PartyPopper } from "lucide-react";
import { RandomizerReveal } from "@/components/creator/RandomizerReveal";
import { HomeLink } from "@/components/ui/HomeLink";
import { resolveGiveawayTheme } from "@/lib/mock-giveaway";
import { saveRandomizerResult } from "@/lib/services/supabase";
import {
  generateMockFormParticipants,
  generateMockInstagramParticipants,
  generateMockTelegramParticipants,
} from "@/lib/mock-participants";
import { formatNumber } from "@/lib/utils";
import type { Giveaway, RandomizerResult } from "@/types";

interface DashboardGiveawayDetailProps {
  giveaway: Giveaway;
}

export function DashboardGiveawayDetail({ giveaway }: DashboardGiveawayDetailProps) {
  const theme = resolveGiveawayTheme(giveaway);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleRandomizerComplete = async (result: RandomizerResult) => {
    await saveRandomizerResult(giveaway.id, result);
    setJustSaved(true);
  };

  // В реальном приложении — запрос участников из БД по giveaway.id.
  const participants = useMemo(() => {
    if (giveaway.entrySource === "instagram_comments") {
      return generateMockInstagramParticipants(giveaway.id, giveaway.participantsCount);
    }
    if (giveaway.entrySource === "telegram_channel") {
      return generateMockTelegramParticipants(giveaway.id, giveaway.participantsCount);
    }
    return generateMockFormParticipants(giveaway.id, giveaway.participantsCount);
  }, [giveaway.id, giveaway.entrySource, giveaway.participantsCount]);

  const visibleParticipants = showAllParticipants ? participants : participants.slice(0, 8);

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Все розыгрыши
        </Link>
        <HomeLink />
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{giveaway.title}</h1>
          <p className="text-white/50 text-sm mt-1.5 max-w-lg">{giveaway.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/g/${giveaway.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
          >
            Публичная страница <ExternalLink className="size-3.5" />
          </Link>
          <Link
            href={`/g/${giveaway.slug}/results`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
          >
            <Trophy className="size-3.5" /> Результаты
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Список участников */}
        <div className="rounded-2xl glass border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Users className="size-4" style={{ color: theme.primary }} />
              Участники ({formatNumber(participants.length)})
            </h2>
            {giveaway.entrySource === "instagram_comments" && (
              <span className="flex items-center gap-1 text-[11px] text-neon-fuchsia">
                <Instagram className="size-3.5" /> из комментариев
              </span>
            )}
            {giveaway.entrySource === "telegram_channel" && (
              <span className="flex items-center gap-1 text-[11px] text-neon-cyan">
                <Send className="size-3.5" /> из Telegram-канала
              </span>
            )}
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {visibleParticipants.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-base-900/40">
                <div
                  className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                >
                  {(p.source === "instagram_comment"
                    ? p.instagram?.username ?? p.name
                    : p.source === "telegram_action"
                      ? p.telegram?.username ?? p.name
                      : p.name)
                    .replace("@", "")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium truncate">
                    {p.source === "instagram_comment"
                      ? `@${p.instagram?.username}`
                      : p.source === "telegram_action"
                        ? `@${p.telegram?.username}`
                        : p.name}
                  </p>
                  {p.source === "form" && (
                    <p className="text-[11px] text-white/35 truncate flex items-center gap-1">
                      <Mail className="size-2.5" /> {p.email}
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-white/25 shrink-0">#{p.entryNumber}</span>
              </div>
            ))}
          </div>

          {participants.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllParticipants((v) => !v)}
              className="text-xs text-white/40 hover:text-white transition-colors mt-3"
            >
              {showAllParticipants ? "Скрыть" : `Показать всех (${formatNumber(participants.length)})`}
            </button>
          )}
        </div>

        {/* Fair Randomizer */}
        <div className="space-y-4">
          <RandomizerReveal
            participants={participants}
            prizes={giveaway.prizes}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
            onComplete={handleRandomizerComplete}
          />
          {justSaved && (
            <div className="rounded-2xl border border-neon-lime/30 bg-neon-lime/5 p-4 flex items-center justify-between gap-3 flex-wrap">
              <p className="flex items-center gap-1.5 text-sm text-white">
                <PartyPopper className="size-4 text-neon-lime" /> Результаты сохранены и опубликованы
              </p>
              <Link
                href={`/g/${giveaway.slug}/results`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-neon-lime/15 text-neon-lime hover:bg-neon-lime/25 transition-colors"
              >
                Открыть страницу результатов <ExternalLink className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
