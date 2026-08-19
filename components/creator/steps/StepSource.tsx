"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Send,
  FormInput,
  RefreshCw,
  Heart,
  AlertCircle,
  CheckCircle2,
  Hash,
  AtSign,
  MessageCircle,
  Repeat2,
} from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { StepEyebrow } from "@/components/creator/StepEyebrow";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { TELEGRAM_CRITERIA_OPTIONS } from "@/lib/services/telegram";
import { cn } from "@/lib/utils";
import type { EntrySourceType, TelegramCriteriaType } from "@/types";

const SOURCE_OPTIONS: {
  value: EntrySourceType;
  title: string;
  description: string;
  icon: typeof Instagram;
}[] = [
  {
    value: "instagram_comments",
    title: "Комментарии в Instagram",
    description: "Каждый комментарий под постом = участие. Без формы, без трения.",
    icon: Instagram,
  },
  {
    value: "telegram_channel",
    title: "Telegram-канал",
    description: "Лайк, репост или комментарий к посту в канале — на выбор.",
    icon: Send,
  },
  {
    value: "form",
    title: "Форма на сайте",
    description: "Классическая регистрация: имя, email, соц. сети.",
    icon: FormInput,
  },
];

const CRITERIA_ICONS: Record<TelegramCriteriaType, typeof Heart> = {
  reaction: Heart,
  forward: Repeat2,
  comment: MessageCircle,
};

export function StepSource() {
  const {
    draft,
    setEntrySource,
    updateInstagramSource,
    syncInstagramComments,
    isSyncingInstagram,
    instagramSyncError,
    instagramComments,
    updateTelegramSource,
    toggleTelegramCriterion,
    syncTelegramActions,
    isSyncingTelegram,
    telegramSyncError,
    telegramActions,
  } = useGiveawayStore();

  const [igPostUrl, setIgPostUrl] = useState(draft.instagramSource?.postUrl ?? "");
  const [tgPostUrl, setTgPostUrl] = useState(draft.telegramSource?.postUrl ?? "");

  const isInstagram = draft.entrySource === "instagram_comments";
  const isTelegram = draft.entrySource === "telegram_channel";
  const ig = draft.instagramSource;
  const tg = draft.telegramSource;

  return (
    <div className="space-y-6">
      <StepEyebrow />
      <div>
        <h2 className="text-2xl font-semibold text-white">Откуда берём участников?</h2>
        <p className="text-white/50 text-sm mt-1">
          Большинство розыгрышей проводят среди тех, кто оставил комментарий, лайк или репост под
          постом — это самый быстрый способ для аудитории и самый честный для вас.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {SOURCE_OPTIONS.map(({ value, title, description, icon: Icon }) => {
          const active = draft.entrySource === value;
          const isRecommended = value === "instagram_comments";
          return (
            <motion.button
              key={value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEntrySource(value)}
              className={cn(
                "relative text-left p-4 rounded-2xl border transition-all glass-light",
                active
                  ? "border-neon-fuchsia/60 shadow-glow bg-neon-fuchsia/10"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              {isRecommended && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wide bg-cta-gradient px-2 py-0.5 rounded-full text-white">
                  Приоритет
                </span>
              )}
              <Icon className={cn("size-5 mb-2", active ? "text-neon-fuchsia" : "text-white/50")} />
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="text-xs text-white/40 mt-1 pr-10">{description}</p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        {isInstagram && (
          <motion.div
            key="ig-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 rounded-2xl border border-white/10 glass-light p-5"
          >
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <Instagram className="size-4 text-neon-fuchsia" />
              Подключение поста Instagram
            </div>

            <Input
              label="Ссылка на пост"
              placeholder="https://instagram.com/p/Cxxxxxxxxxx/"
              value={igPostUrl}
              onChange={(e) => {
                setIgPostUrl(e.target.value);
                updateInstagramSource({ postUrl: e.target.value });
              }}
              hint="Пост должен быть опубликован в подключённом Business/Creator-аккаунте"
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="Обязательный хэштег"
                placeholder="#freespin"
                leftIcon={<Hash className="size-4" />}
                value={ig?.requireHashtag ?? ""}
                onChange={(e) => updateInstagramSource({ requireHashtag: e.target.value })}
              />
              <Input
                label="Мин. длина комментария"
                type="number"
                value={ig?.minCommentLength ?? 0}
                onChange={(e) => updateInstagramSource({ minCommentLength: Number(e.target.value) })}
              />
            </div>

            <div className="p-3 rounded-xl glass border border-white/10">
              <Switch
                checked={!!ig?.requireMention}
                onChange={(v) => updateInstagramSource({ requireMention: v })}
                label="Требовать упоминание друга (@username)"
                description="Отсекает комментарии без отметки — увеличивает виральность"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              isLoading={isSyncingInstagram}
              disabled={!igPostUrl.trim()}
              onClick={syncInstagramComments}
              className="w-full"
            >
              <RefreshCw className="size-4" />
              Синхронизировать комментарии
            </Button>

            {instagramSyncError && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="size-3.5" /> {instagramSyncError}
              </p>
            )}

            {instagramComments.length > 0 && (
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs text-neon-lime font-medium">
                  <CheckCircle2 className="size-3.5" />
                  {ig?.qualifiedCount ?? 0} из {instagramComments.length} комментариев прошли фильтр
                </p>
                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                  {instagramComments
                    .filter((c) => c.qualifies)
                    .slice(0, 8)
                    .map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-base-900/50 border border-white/5"
                      >
                        <div className="size-7 rounded-full bg-cta-gradient flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {c.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-medium truncate">@{c.username}</p>
                          <p className="text-xs text-white/40 truncate">{c.text}</p>
                        </div>
                        <div className="flex items-center gap-1 text-white/30 text-xs shrink-0">
                          <Heart className="size-3" /> {c.likeCount}
                        </div>
                      </div>
                    ))}
                </div>
                <p className="text-[11px] text-white/30 flex items-center gap-1">
                  <AtSign className="size-3" />
                  Список обновится автоматически перед розыгрышем — новые комментарии тоже учтутся
                </p>
              </div>
            )}
          </motion.div>
        )}

        {isTelegram && (
          <motion.div
            key="tg-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 rounded-2xl border border-white/10 glass-light p-5"
          >
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <Send className="size-4 text-neon-cyan" />
              Подключение поста в Telegram-канале
            </div>

            <Input
              label="Ссылка на пост"
              placeholder="https://t.me/your_channel/123"
              value={tgPostUrl}
              onChange={(e) => {
                setTgPostUrl(e.target.value);
                updateTelegramSource({ postUrl: e.target.value });
              }}
              hint="Бот Freespin должен быть добавлен администратором в канал"
            />

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">
                Критерии участия (можно выбрать несколько — обязательны все выбранные)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TELEGRAM_CRITERIA_OPTIONS.map(({ value, label }) => {
                  const Icon = CRITERIA_ICONS[value];
                  const active = tg?.requiredCriteria?.includes(value) ?? false;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleTelegramCriterion(value)}
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

            <Input
              label="Требовать конкретную реакцию (необязательно)"
              placeholder="🔥 — оставить пустым, чтобы засчитывать любую"
              value={tg?.requiredReactionEmoji ?? ""}
              onChange={(e) => updateTelegramSource({ requiredReactionEmoji: e.target.value })}
            />

            <Button
              type="button"
              variant="outline"
              isLoading={isSyncingTelegram}
              disabled={!tgPostUrl.trim() || (tg?.requiredCriteria?.length ?? 0) === 0}
              onClick={syncTelegramActions}
              className="w-full"
            >
              <RefreshCw className="size-4" />
              Синхронизировать подписчиков
            </Button>

            {telegramSyncError && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="size-3.5" /> {telegramSyncError}
              </p>
            )}

            {telegramActions.length > 0 && (
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs text-neon-lime font-medium">
                  <CheckCircle2 className="size-3.5" />
                  {tg?.qualifiedCount ?? 0} из {telegramActions.length} подписчиков выполнили все условия
                </p>
                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                  {telegramActions
                    .filter((a) => a.qualifies)
                    .slice(0, 8)
                    .map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-base-900/50 border border-white/5"
                      >
                        <div className="size-7 rounded-full bg-cta-gradient flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {a.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-medium truncate">@{a.username}</p>
                          {a.commentText && (
                            <p className="text-xs text-white/40 truncate">{a.commentText}</p>
                          )}
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
                <p className="text-[11px] text-white/30">
                  Список обновится автоматически перед розыгрышем — новые действия тоже учтутся
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {draft.entrySource === "form" && (
        <p className="text-xs text-white/35 italic">
          Форма участия будет настроена на следующих шагах (условия участия, кастомные поля).
        </p>
      )}
    </div>
  );
}
