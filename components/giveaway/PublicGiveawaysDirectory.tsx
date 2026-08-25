"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Instagram, Send, FormInput, ListPlus, Users, Globe2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { EntrySourceType, Giveaway } from "@/types";

interface PublicGiveawaysDirectoryProps {
  giveaways: Giveaway[];
}

const FILTERS: { value: EntrySourceType | "all"; label: string; icon: typeof Globe2 }[] = [
  { value: "all", label: "Все", icon: Globe2 },
  { value: "instagram_comments", label: "Instagram", icon: Instagram },
  { value: "telegram_channel", label: "Telegram", icon: Send },
  { value: "form", label: "Форма на сайте", icon: FormInput },
  { value: "manual_list", label: "Свой список", icon: ListPlus },
];

function SourceBadge({ source }: { source: EntrySourceType }) {
  if (source === "instagram_comments") {
    return (
      <>
        <Instagram className="size-3.5" /> Instagram-комментарии
      </>
    );
  }
  if (source === "telegram_channel") {
    return (
      <>
        <Send className="size-3.5" /> Telegram-канал
      </>
    );
  }
  if (source === "manual_list") {
    return (
      <>
        <ListPlus className="size-3.5" /> Свой список
      </>
    );
  }
  return (
    <>
      <FormInput className="size-3.5" /> Форма на сайте
    </>
  );
}

/**
 * Публичный каталог активных розыгрышей (/giveaways) — сюда попадают только
 * розыгрыши с visibility: "public". Приватные (по прямой ссылке для целевой
 * аудитории) сюда никогда не выводятся, см. lib/mock-giveaway.getPublicActiveGiveaways.
 */
export function PublicGiveawaysDirectory({ giveaways }: PublicGiveawaysDirectoryProps) {
  const [filter, setFilter] = useState<EntrySourceType | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? giveaways : giveaways.filter((g) => g.entrySource === filter)),
    [giveaways, filter]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(({ value, label, icon: Icon }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all",
                active
                  ? "bg-neon-violet/15 border-neon-violet/50 text-white shadow-glow"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
              )}
            >
              <Icon className="size-3.5" /> {label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <p className="text-white font-medium">Пока нет активных розыгрышей с таким условием</p>
          <p className="text-sm text-white/40 mt-1.5">Попробуйте выбрать другой фильтр или загляните позже.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/g/${g.slug}`}
                className="group block h-full rounded-2xl glass border border-white/10 p-5 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-neon-lime/15 text-neon-lime">
                    Активен
                  </span>
                  {g.tier === "premium" ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-neon-fuchsia">
                      <Crown className="size-3.5" /> Premium
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-neon-cyan">Free</span>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                  {g.title}
                </h2>
                <p className="text-sm text-white/40 line-clamp-2 mb-4">{g.description}</p>

                <div className="flex items-center justify-between text-xs text-white/45 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1.5">
                    <SourceBadge source={g.entrySource} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5" /> {formatNumber(g.participantsCount)}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-white/30 mt-3 group-hover:text-white/60 transition-colors">
                  Участвовать <ArrowRight className="size-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
