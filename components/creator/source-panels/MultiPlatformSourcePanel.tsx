"use client";

import { motion } from "framer-motion";
import { Instagram, Send, Twitter, Youtube, Facebook, Trash2, Layers } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import type { MultiPlatformKind } from "@/types";

const PLATFORMS: { value: MultiPlatformKind; label: string; icon: typeof Instagram }[] = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "telegram", label: "Telegram", icon: Send },
  { value: "twitter", label: "X (Twitter)", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "facebook", label: "Facebook", icon: Facebook },
];

/**
 * Панель настройки источника "multi_platform" — несколько постов на разных
 * площадках объединяются в один общий пул участников одного розыгрыша.
 * Упрощённая мок-модель: без live-синхронизации по каждой строке — участники
 * генерируются при запуске розыгрыша (см. lib/mock-participants.ts).
 */
export function MultiPlatformSourcePanel() {
  const { draft, addMultiPlatformSource, updateMultiPlatformSource, removeMultiPlatformSource } =
    useGiveawayStore();

  const sources = draft.multiPlatformSources ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 rounded-2xl border border-white/10 glass-light p-5"
    >
      <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
        <Layers className="size-4 text-neon-violet" />
        Объединённые источники
      </div>
      <p className="text-xs text-white/40">
        Добавьте посты с разных площадок — участники всех постов попадут в один общий пул для розыгрыша.
      </p>

      <div className="space-y-3">
        {sources.map((source) => {
          const platform = PLATFORMS.find((p) => p.value === source.platform) ?? PLATFORMS[0];
          const Icon = platform.icon;
          return (
            <div key={source.id} className="flex items-center gap-2 p-3 rounded-xl bg-base-900/40 border border-white/5">
              <div className="flex items-center gap-1.5 shrink-0 w-28 text-xs text-white/60">
                <Icon className="size-4" /> {platform.label}
              </div>
              <input
                type="text"
                value={source.postUrl}
                onChange={(e) => updateMultiPlatformSource(source.id, { postUrl: e.target.value })}
                placeholder="Ссылка на пост..."
                className="flex-1 min-w-0 rounded-lg bg-base-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-neon-violet/50"
              />
              <button
                type="button"
                onClick={() => removeMultiPlatformSource(source.id)}
                className="size-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                title="Удалить источник"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      {sources.length === 0 && (
        <p className="text-xs text-white/25 text-center py-2">Пока не добавлено ни одного источника</p>
      )}

      <div className="grid grid-cols-5 gap-1.5">
        {PLATFORMS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => addMultiPlatformSource(value)}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors"
            title={`Добавить ${label}`}
          >
            <Icon className="size-4" />
            <span className="text-[9px] font-medium leading-none">{label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
