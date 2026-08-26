import { Instagram, Send, Twitter, Youtube, Facebook, ExternalLink, Layers } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { MultiPlatformEntry, MultiPlatformKind } from "@/types";

interface MultiPlatformCardProps {
  sources: MultiPlatformEntry[];
  primaryColor: string;
  secondaryColor: string;
}

const PLATFORM_META: Record<MultiPlatformKind, { label: string; icon: typeof Instagram }> = {
  instagram: { label: "Instagram", icon: Instagram },
  telegram: { label: "Telegram", icon: Send },
  twitter: { label: "X (Twitter)", icon: Twitter },
  youtube: { label: "YouTube", icon: Youtube },
  facebook: { label: "Facebook", icon: Facebook },
};

/**
 * Публичная витрина объединённого розыгрыша (entrySource: "multi_platform") —
 * список постов на разных площадках, участники которых собираются в один
 * общий пул. Участие не требует формы — достаточно провзаимодействовать
 * с любым из перечисленных постов.
 */
export function MultiPlatformCard({ sources, primaryColor, secondaryColor }: MultiPlatformCardProps) {
  return (
    <div className="rounded-3xl glass border border-white/10 shadow-glass overflow-hidden p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
          <Layers className="size-4" style={{ color: primaryColor }} />
          Участвуй на любой из площадок
        </div>
        <span className="text-xs text-white/40">{sources.length} источников</span>
      </div>

      <div className="space-y-2">
        {sources.map((source) => {
          const meta = PLATFORM_META[source.platform];
          const Icon = meta.icon;
          return (
            <div
              key={source.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-base-900/50 border border-white/5"
            >
              <div
                className="size-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <Icon className="size-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{meta.label}</p>
                {source.qualifiedCount != null && (
                  <p className="text-xs text-white/40">{formatNumber(source.qualifiedCount)} участников</p>
                )}
              </div>
              {source.postUrl && (
                <a
                  href={source.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs shrink-0 px-3 py-1.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
                >
                  Открыть <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-white/30 text-center">
        Все участники со всех площадок попадают в один общий пул. Победитель выбирается — Fair Randomizer.
      </p>
    </div>
  );
}
