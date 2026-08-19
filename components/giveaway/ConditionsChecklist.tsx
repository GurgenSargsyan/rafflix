"use client";

import { motion } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import type { EntryCondition } from "@/types";

interface ConditionsChecklistProps {
  conditions: EntryCondition[];
  completedIds: string[];
  onToggle: (id: string) => void;
  accentColor: string;
}

/**
 * Список условий участия — участник отмечает выполненные шаги
 * (переходит по ссылке -> возвращается -> ставит галочку).
 */
export function ConditionsChecklist({
  conditions,
  completedIds,
  onToggle,
  accentColor,
}: ConditionsChecklistProps) {
  if (conditions.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">
        Выполните условия участия
      </p>
      {conditions.map((condition) => {
        const done = completedIds.includes(condition.id);
        return (
          <motion.div
            key={condition.id}
            whileHover={{ x: 2 }}
            className="flex items-center gap-3 p-3 rounded-xl glass-light border border-white/10"
          >
            <button
              type="button"
              onClick={() => onToggle(condition.id)}
              className="size-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors"
              style={{
                borderColor: done ? accentColor : "rgba(255,255,255,0.2)",
                backgroundColor: done ? accentColor : "transparent",
              }}
              aria-pressed={done}
            >
              {done && <Check className="size-4 text-white" />}
            </button>
            <span className={`text-sm flex-1 ${done ? "text-white/50 line-through" : "text-white"}`}>
              {condition.label}
              {condition.required && !done && <span className="text-red-400 ml-1">*</span>}
            </span>
            {condition.url && (
              <a
                href={condition.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors shrink-0"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
