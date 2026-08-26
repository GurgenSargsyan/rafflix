"use client";

import { useState } from "react";
import { ShieldAlert, ChevronDown } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { cn } from "@/lib/utils";

/**
 * Общие "защитные" настройки для источников с реальной аудиторией
 * (Instagram/Telegram/X/YouTube/Facebook/объединённые) — не зависят от
 * конкретной платформы, поэтому вынесены в отдельный блок под источником:
 * - Чёрный список: конкретные имена/username исключаются из розыгрыша.
 * - Порог справедливого участия: не более N заявок от одного участника.
 */
export function FairnessSettingsPanel() {
  const { draft, setBlacklist, setMaxEntriesPerUser } = useGiveawayStore();
  const [open, setOpen] = useState(false);
  const [blacklistText, setBlacklistText] = useState(() => (draft.blacklist ?? []).join("\n"));

  return (
    <div className="rounded-2xl border border-white/10 glass-light overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 p-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-white/70">
          <ShieldAlert className="size-4 text-amber-400" />
          Защита от накруток (необязательно)
        </span>
        <ChevronDown className={cn("size-4 text-white/40 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-4 border-t border-white/10 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-white/50">
              Чёрный список
            </label>
            <textarea
              value={blacklistText}
              onChange={(e) => {
                setBlacklistText(e.target.value);
                setBlacklist(
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                );
              }}
              placeholder={"username_бота\n@сотрудник_бренда"}
              rows={3}
              className="w-full rounded-xl bg-base-900/50 border border-white/10 p-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/50 resize-none"
            />
            <p className="text-[11px] text-white/30">
              Имя/username на строку — эти участники не попадут в розыгрыш
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-white/50">
              Порог справедливого участия
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={draft.maxEntriesPerUser ?? ""}
                onChange={(e) =>
                  setMaxEntriesPerUser(e.target.value ? Math.max(1, Number(e.target.value)) : undefined)
                }
                placeholder="Без ограничения"
                className="w-40 rounded-xl bg-base-900/50 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/50"
              />
              <p className="text-[11px] text-white/30 flex-1">
                Максимум заявок/комментариев, засчитываемых от одного участника — остальные его записи
                отбрасываются до розыгрыша
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
