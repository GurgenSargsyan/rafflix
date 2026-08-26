"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Twitter, Repeat2, MessageCircle, ExternalLink, RefreshCw, Users } from "lucide-react";
import { fetchTwitterEngagement, summarizeTwitterEngagement, twitterCriteriaLabel } from "@/lib/services/twitter";
import { formatNumber } from "@/lib/utils";
import type { TwitterCriteriaType, TwitterEngagement, TwitterSource } from "@/types";

interface TwitterEngagementCardProps {
  source: TwitterSource;
  primaryColor: string;
  secondaryColor: string;
}

const CRITERIA_ICONS: Record<TwitterCriteriaType, typeof Repeat2> = {
  retweet: Repeat2,
  reply: MessageCircle,
};

/**
 * Публичная витрина розыгрыша "по твиту": показывает сам твит и живой
 * список тех, кто выполнил требуемые критерии (ретвит/ответ). Участие не
 * требует формы — достаточно провзаимодействовать с твитом.
 */
export function TwitterEngagementCard({ source, primaryColor, secondaryColor }: TwitterEngagementCardProps) {
  const [actions, setActions] = useState<TwitterEngagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActions = async () => {
    setIsLoading(true);
    const data = await fetchTwitterEngagement(
      source.requiredCriteria,
      source.qualifiedCount ? source.qualifiedCount + 15 : 30
    );
    setActions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.postId]);

  const { qualified, qualifiedActions } = summarizeTwitterEngagement(actions);

  return (
    <div className="rounded-3xl glass border border-white/10 shadow-glass overflow-hidden">
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <div
          className="size-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <Twitter className="size-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">@{source.authorUsername}</p>
          <p className="text-xs text-white/40 truncate">{source.caption}</p>
        </div>
        <a
          href={source.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs shrink-0 px-3 py-1.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
        >
          Открыть твит <ExternalLink className="size-3.5" />
        </a>
      </div>

      {source.mediaPreviewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={source.mediaPreviewUrl} alt="Твит розыгрыша" className="w-full aspect-square object-cover" />
      )}

      <div className="p-5 space-y-4">
        <div
          className="rounded-2xl p-4 border text-center space-y-2"
          style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}12` }}
        >
          <p className="text-sm text-white">Чтобы участвовать, сделай:</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {source.requiredCriteria.map((c) => {
              const Icon = CRITERIA_ICONS[c];
              return (
                <span
                  key={c}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ color: primaryColor, backgroundColor: `${primaryColor}1a` }}
                >
                  <Icon className="size-3.5" />
                  {twitterCriteriaLabel(c)}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Users className="size-4" style={{ color: primaryColor }} />
            {isLoading ? "Загружаем..." : `${formatNumber(qualified)} участников выполнили условия`}
          </div>
          <button
            type="button"
            onClick={loadActions}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Обновить
          </button>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {qualifiedActions.slice(0, 12).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-base-900/50 border border-white/5"
            >
              <div
                className="size-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {a.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">@{a.username}</p>
                {a.replyText && <p className="text-xs text-white/45 truncate">{a.replyText}</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {a.completedCriteria.map((c) => {
                  const Icon = CRITERIA_ICONS[c];
                  return <Icon key={c} className="size-3.5 text-white/30" />;
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[11px] text-white/30 text-center">
          Список обновляется автоматически. Победитель выбирается из всех, кто выполнил условия — Fair Randomizer.
        </p>
      </div>
    </div>
  );
}
