"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Package, Gift, Banknote, Plus, Trash2, ChevronUp, ChevronDown, Crown, AlertCircle } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { StepEyebrow } from "@/components/creator/StepEyebrow";
import { Input, Textarea } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { placeLabel, totalWinnerCount, isValueRequired, resolveShowValue } from "@/lib/prizes";
import { cn } from "@/lib/utils";
import type { Prize, PrizeType } from "@/types";

const PRIZE_TYPES: { value: PrizeType; label: string; icon: typeof Package }[] = [
  { value: "physical", label: "Физический", icon: Package },
  { value: "digital", label: "Цифровой", icon: Gift },
  { value: "money", label: "Денежный", icon: Banknote },
];

export function StepPrize() {
  const { draft, addPrize, removePrize, updatePrize, movePrize } = useGiveawayStore();

  return (
    <div className="space-y-6">
      <StepEyebrow />
      <div>
        <h2 className="text-2xl font-semibold text-white">Что вы разыгрываете?</h2>
        <p className="text-white/50 text-sm mt-1">
          Можно разыграть сразу несколько призов. Порядок ниже — это порядок розыгрыша:
          сначала выбирается победитель первого приза, затем следующего, и т.д. — без повторов.
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {draft.prizes.map((prize, index) => {
            const valueRequired = isValueRequired(prize);
            const valueMissing = valueRequired && !(prize.estimatedValue != null && prize.estimatedValue > 0);

            return (
              <motion.div
                key={prize.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl glass-light border border-white/10 p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neon-cyan">
                    {index === 0 && <Crown className="size-3.5" />}
                    {placeLabel(index)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => movePrize(prize.id, "up")}
                      disabled={index === 0}
                      className="size-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      title="Разыграть раньше"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePrize(prize.id, "down")}
                      disabled={index === draft.prizes.length - 1}
                      className="size-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      title="Разыграть позже"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePrize(prize.id)}
                      disabled={draft.prizes.length === 1}
                      className="size-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      title="Удалить приз"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {PRIZE_TYPES.map(({ value, label, icon: Icon }) => {
                    const active = prize.type === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          updatePrize(prize.id, {
                            type: value,
                            // Денежный приз всегда показывает сумму — переключатель ниже не действует.
                            showValue: value === "money" ? true : prize.showValue,
                          })
                        }
                        className={cn(
                          "flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-colors",
                          active
                            ? "border-neon-violet/60 bg-neon-violet/10 text-white"
                            : "border-white/10 text-white/50 hover:border-white/20"
                        )}
                      >
                        <Icon className="size-3.5" /> {label}
                      </button>
                    );
                  })}
                </div>

                <Input
                  label="Название приза"
                  placeholder={
                    prize.type === "money"
                      ? "Например: Денежный приз"
                      : prize.type === "digital"
                        ? "Например: Steam-ключ на игру X"
                        : "Например: iPhone 16 Pro 256GB"
                  }
                  value={prize.title}
                  onChange={(e) => updatePrize(prize.id, { title: e.target.value })}
                />

                <Textarea
                  label="Описание (необязательно)"
                  placeholder="Цвет, комплектация, особенности..."
                  value={prize.description ?? ""}
                  onChange={(e) => updatePrize(prize.id, { description: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={valueRequired ? "Сумма приза, $ *" : "Стоимость, $"}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0"
                    value={prize.estimatedValue ?? ""}
                    error={valueMissing ? "Укажите сумму приза" : undefined}
                    onChange={(e) =>
                      updatePrize(prize.id, {
                        estimatedValue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                  <Input
                    label="Победителей"
                    type="number"
                    min={1}
                    value={prize.quantity}
                    onChange={(e) => updatePrize(prize.id, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </div>

                <div className="p-3 rounded-xl glass border border-white/10">
                  <Switch
                    checked={resolveShowValue(prize)}
                    onChange={(v) => updatePrize(prize.id, { showValue: v })}
                    disabled={prize.type === "money"}
                    label="Показывать сумму участникам"
                    description={
                      prize.type === "money"
                        ? "Для денежного приза сумма — это и есть приз, скрыть её нельзя"
                        : "Можно скрыть точную сумму и оставить только название приза"
                    }
                  />
                </div>

                {valueMissing && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="size-3.5" />
                    Для денежного приза сумма обязательна
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <Button type="button" variant="outline" onClick={addPrize} className="w-full">
          <Plus className="size-4" /> Добавить ещё приз
        </Button>
      </div>

      <p className="text-xs text-white/35 text-center">
        Всего победителей: <span className="text-white/60 font-medium">{totalWinnerCount(draft.prizes)}</span>
        {" "}по {draft.prizes.length} {draft.prizes.length === 1 ? "призу" : "призам"}
      </p>
    </div>
  );
}
