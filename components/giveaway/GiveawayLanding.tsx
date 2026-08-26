"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { CountdownTimer } from "@/components/giveaway/CountdownTimer";
import { PrizeCard } from "@/components/giveaway/PrizeCard";
import { ConditionsChecklist } from "@/components/giveaway/ConditionsChecklist";
import { ParticipateForm } from "@/components/giveaway/ParticipateForm";
import { InstagramCommentsCard } from "@/components/giveaway/InstagramCommentsCard";
import { TelegramActionsCard } from "@/components/giveaway/TelegramActionsCard";
import { TwitterEngagementCard } from "@/components/giveaway/TwitterEngagementCard";
import { YoutubeCommentsCard } from "@/components/giveaway/YoutubeCommentsCard";
import { FacebookEngagementCard } from "@/components/giveaway/FacebookEngagementCard";
import { MultiPlatformCard } from "@/components/giveaway/MultiPlatformCard";
import { ManualListCard } from "@/components/giveaway/ManualListCard";
import { SpinWheelBackground } from "@/components/giveaway/SpinWheelBackground";
import { Logo } from "@/components/ui/Logo";
import { resolveGiveawayTheme } from "@/lib/mock-giveaway";
import { formatNumber } from "@/lib/utils";
import type { Giveaway } from "@/types";

interface GiveawayLandingProps {
  giveaway: Giveaway;
}

/**
 * Публичная страница розыгрыша. Применяет кастомные стили (Premium) через
 * инлайн CSS-переменные/градиенты, либо цвета выбранного Free-шаблона.
 */
export function GiveawayLanding({ giveaway }: GiveawayLandingProps) {
  const theme = resolveGiveawayTheme(giveaway);
  const [completedConditionIds, setCompletedConditionIds] = useState<string[]>([]);
  const [participantsCount, setParticipantsCount] = useState(giveaway.participantsCount);

  const toggleCondition = (id: string) =>
    setCompletedConditionIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: theme.background,
        fontFamily: theme.fontFamily ? `${theme.fontFamily}, var(--font-inter), sans-serif` : undefined,
        backgroundImage: theme.backgroundImageUrl ? `url(${theme.backgroundImageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Затемнение + свечение поверх фона для читаемости */}
      <div className="absolute inset-0 bg-black/40" />
      {giveaway.drawStyle === "wheel" ? (
        <SpinWheelBackground primaryColor={theme.primary} secondaryColor={theme.secondary} />
      ) : (
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 size-[560px] rounded-full blur-3xl opacity-25 animate-pulse-slow"
          style={{ background: `radial-gradient(circle, ${theme.primary}, transparent 70%)` }}
        />
      )}

      <div className="relative z-10 px-4 py-10 sm:py-16 max-w-2xl mx-auto">
        {/* Логотип / бренд-шапка */}
        <div className="flex flex-col items-center text-center mb-8">
          {theme.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={theme.logoUrl} alt="Логотип" className="h-12 object-contain mb-4" />
          ) : (
            <Logo size="sm" className="mb-4" />
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white leading-tight"
          >
            {giveaway.title}
          </motion.h1>
          <p className="text-white/60 mt-3 max-w-md">{giveaway.description}</p>

          <div className="flex items-center gap-1.5 mt-3 text-xs text-white/40">
            <Sparkles className="size-3.5" />
            {formatNumber(participantsCount)} участников уже присоединились
          </div>
        </div>

        {/* Таймер */}
        <div className="mb-8">
          <CountdownTimer targetDate={giveaway.endDate} accentColor={theme.primary} />
        </div>

        {/* Карточка приза */}
        <div className="mb-8">
          <PrizeCard
            prizes={giveaway.prizes}
            participantsCount={participantsCount}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        </div>

        {giveaway.entrySource === "instagram_comments" && giveaway.instagramSource ? (
          /* Участники импортируются из комментариев — форма не нужна */
          <InstagramCommentsCard
            source={giveaway.instagramSource}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        ) : giveaway.entrySource === "telegram_channel" && giveaway.telegramSource ? (
          /* Участники импортируются из действий в Telegram-канале — форма не нужна */
          <TelegramActionsCard
            source={giveaway.telegramSource}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        ) : giveaway.entrySource === "twitter_engagement" && giveaway.twitterSource ? (
          /* Участники импортируются из ретвитов/ответов на твит — форма не нужна */
          <TwitterEngagementCard
            source={giveaway.twitterSource}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        ) : giveaway.entrySource === "youtube_comments" && giveaway.youtubeSource ? (
          /* Участники импортируются из комментариев под видео — форма не нужна */
          <YoutubeCommentsCard
            source={giveaway.youtubeSource}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        ) : giveaway.entrySource === "facebook_engagement" && giveaway.facebookSource ? (
          /* Участники импортируются из комментариев/лайков поста — форма не нужна */
          <FacebookEngagementCard
            source={giveaway.facebookSource}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        ) : giveaway.entrySource === "multi_platform" ? (
          /* Несколько площадок объединены в один пул участников — форма не нужна */
          <MultiPlatformCard
            sources={giveaway.multiPlatformSources ?? []}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        ) : giveaway.entrySource === "manual_list" ? (
          /* Организатор уже вписал варианты сам — форма участия не нужна */
          <ManualListCard
            entries={giveaway.manualEntries ?? []}
            drawStyle={giveaway.drawStyle}
            primaryColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        ) : (
          <>
            {/* Условия участия */}
            {giveaway.entryConditions.length > 0 && (
              <div className="mb-8">
                <ConditionsChecklist
                  conditions={giveaway.entryConditions}
                  completedIds={completedConditionIds}
                  onToggle={toggleCondition}
                  accentColor={theme.primary}
                />
              </div>
            )}

            {/* Форма участия */}
            <ParticipateForm
              giveawayId={giveaway.id}
              customFields={giveaway.customFields}
              conditions={giveaway.entryConditions}
              completedConditionIds={completedConditionIds}
              primaryColor={theme.primary}
              secondaryColor={theme.secondary}
              onSubmitted={() => setParticipantsCount((c) => c + 1)}
            />
          </>
        )}

        {/* Водяной знак платформы — скрывается на Premium */}
        {!theme.hideWatermark && (
          <div className="flex justify-center mt-8">
            <span className="text-[11px] text-white/25 flex items-center gap-1">
              <Zap className="size-3" /> Powered by{" "}
              <span className="font-display font-extrabold tracking-tight">RAFFLIX</span>
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
