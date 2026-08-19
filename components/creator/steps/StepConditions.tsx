"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Instagram,
  Send,
  Youtube,
  Share2,
  Link2,
  Plus,
  X,
  GripVertical,
} from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { StepEyebrow } from "@/components/creator/StepEyebrow";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { EntryConditionType } from "@/types";

const CONDITION_PRESETS: { type: EntryConditionType; label: string; icon: typeof Mail }[] = [
  { type: "email_subscribe", label: "Подписка на email", icon: Mail },
  { type: "instagram_follow", label: "Подписка в Instagram", icon: Instagram },
  { type: "telegram_join", label: "Вступить в Telegram", icon: Send },
  { type: "youtube_subscribe", label: "Подписка на YouTube", icon: Youtube },
  { type: "repost_share", label: "Репост / шеринг", icon: Share2 },
  { type: "visit_link", label: "Перейти по ссылке", icon: Link2 },
];

export function StepConditions() {
  const { draft, addCondition, removeCondition } = useGiveawayStore();
  const [pendingUrl, setPendingUrl] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <StepEyebrow />
      <div>
        <h2 className="text-2xl font-semibold text-white">Условия участия</h2>
        <p className="text-white/50 text-sm mt-1">
          Выберите, что должен сделать участник, чтобы принять участие в розыгрыше.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CONDITION_PRESETS.map(({ type, label, icon: Icon }) => {
          const alreadyAdded = draft.entryConditions.some((c) => c.type === type);
          return (
            <motion.button
              key={type}
              type="button"
              disabled={alreadyAdded}
              whileHover={{ y: alreadyAdded ? 0 : -2 }}
              whileTap={{ scale: alreadyAdded ? 1 : 0.97 }}
              onClick={() =>
                addCondition({ type, label, required: true, url: pendingUrl[type] })
              }
              className={cn(
                "flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all glass-light",
                alreadyAdded
                  ? "opacity-30 cursor-not-allowed border-white/5"
                  : "border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/5"
              )}
            >
              <Icon className="size-5 text-white/70" />
              <span className="text-xs text-white/70">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-white/40">
          Добавленные условия ({draft.entryConditions.length})
        </p>
        <AnimatePresence>
          {draft.entryConditions.length === 0 && (
            <p className="text-sm text-white/30 italic py-4 text-center border border-dashed border-white/10 rounded-xl">
              Пока не выбрано ни одного условия — участие будет свободным
            </p>
          )}
          {draft.entryConditions.map((condition) => (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-3 rounded-xl glass-light border border-white/10"
            >
              <GripVertical className="size-4 text-white/25 shrink-0" />
              <span className="text-sm text-white flex-1">{condition.label}</span>
              {(condition.type === "visit_link" ||
                condition.type === "instagram_follow" ||
                condition.type === "telegram_join" ||
                condition.type === "youtube_subscribe" ||
                condition.type === "repost_share") && (
                <input
                  type="url"
                  placeholder="https://..."
                  defaultValue={condition.url}
                  onBlur={(e) =>
                    setPendingUrl((p) => ({ ...p, [condition.type]: e.target.value }))
                  }
                  className="w-40 sm:w-56 bg-base-900/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-neon-cyan/50"
                />
              )}
              <button
                type="button"
                onClick={() => removeCondition(condition.id)}
                className="text-white/30 hover:text-red-400 transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
