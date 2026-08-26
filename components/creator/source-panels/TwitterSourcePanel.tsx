"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, RefreshCw, Heart, AlertCircle, CheckCircle2, Repeat2, MessageCircle } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { Input } from "@/components/ui/Input";
import { TWITTER_CRITERIA_OPTIONS } from "@/lib/services/twitter";
import { cn } from "@/lib/utils";
import type { TwitterCriteriaType } from "@/types";

const CRITERIA_ICONS: Record<TwitterCriteriaType, typeof Heart> = {
  retweet: Repeat2,
  reply: MessageCircle,
};

/** Панель настройки источника "twitter_engagement" — ссылка на твит + критерии (ретвит/ответ). */
export function TwitterSourcePanel() {
  const {
    draft,
    updateTwitterSource,
    toggleTwitterCriterion,
    syncTwitterEngagement,
    isSyncingTwitter,
    twitterSyncError,
    twitterEngagement,
  } = useGiveawayStore();

  const [postUrl, setPostUrl] = useState(draft.twitterSource?.postUrl ?? "");
  const tw = draft.twitterSource;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 rounded-2xl border border-white/10 glass-light p-5"
    >
      <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
        <Send className="size-4 text-neon-cyan" />
        Подключение твита в X (Twitter)
      </div>

      <Input
        label="Ссылка на твит"
        placeholder="https://x.com/username/status/1234567890"
        value={postUrl}
        onChange={(e) => {
          setPostUrl(e.target.value);
          updateTwitterSource({ postUrl: e.target.value });
        }}
        hint="Публичный твит — поддерживаются домены x.com и twitter.com"
      />

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">
          Критерии участия (можно выбрать оба — обязательны все выбранные)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TWITTER_CRITERIA_OPTIONS.map(({ value, label }) => {
            const Icon = CRITERIA_ICONS[value];
            const active = tw?.requiredCriteria?.includes(value) ?? false;
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleTwitterCriterion(value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 rounded-xl border text-center transition-colors",
                  active
                    ? "border-neon-cyan/60 bg-neon-cyan/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/20"
                )}
              >
                <Icon className="size-4" />
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={isSyncingTwitter || !postUrl.trim()}
        onClick={syncTwitterEngagement}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <RefreshCw className={cn("size-4", isSyncingTwitter && "animate-spin")} />
        Синхронизировать ретвиты и ответы
      </button>

      {twitterSyncError && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="size-3.5" /> {twitterSyncError}
        </p>
      )}

      {twitterEngagement.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs text-neon-lime font-medium">
            <CheckCircle2 className="size-3.5" />
            {tw?.qualifiedCount ?? 0} из {twitterEngagement.length} прошли фильтр
          </p>
          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
            {twitterEngagement
              .filter((a) => a.qualifies)
              .slice(0, 8)
              .map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-base-900/50 border border-white/5">
                  <div className="size-7 rounded-full bg-cta-gradient flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {a.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium truncate">@{a.username}</p>
                    {a.replyText && <p className="text-xs text-white/40 truncate">{a.replyText}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {a.completedCriteria.map((c) => {
                      const Icon = CRITERIA_ICONS[c];
                      return <Icon key={c} className="size-3 text-white/30" />;
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
