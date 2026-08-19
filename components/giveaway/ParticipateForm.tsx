"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Send, ShieldCheck } from "lucide-react";
import { participantSchema, type ParticipantFormValues } from "@/lib/schemas";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { saveParticipant } from "@/lib/services/supabase";
import type { CustomField, EntryCondition } from "@/types";

interface ParticipateFormProps {
  giveawayId?: string;
  customFields: CustomField[];
  conditions: EntryCondition[];
  completedConditionIds: string[];
  primaryColor: string;
  secondaryColor: string;
  onSubmitted?: (entryNumber: number) => void;
}

/**
 * Форма участия. Кнопка отправки заблокирована, пока не выполнены все
 * обязательные условия участия (см. completedConditionIds).
 */
export function ParticipateForm({
  giveawayId = "preview",
  customFields,
  conditions,
  completedConditionIds,
  primaryColor,
  secondaryColor,
  onSubmitted,
}: ParticipateFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [entryNumber, setEntryNumber] = useState<number | null>(null);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
  });

  const requiredMissing = conditions
    .filter((c) => c.required)
    .some((c) => !completedConditionIds.includes(c.id));

  const onSubmit = async (values: ParticipantFormValues) => {
    setStatus("submitting");
    const n = Math.floor(1000 + Math.random() * 8999);

    await saveParticipant({
      id: `p_${Date.now()}_${n}`,
      giveawayId,
      source: "form",
      name: values.name,
      email: values.email,
      socialHandle: values.socialHandle,
      customAnswers: customValues,
      completedConditionIds,
      entryNumber: n,
      isWinner: false,
      createdAt: new Date().toISOString(),
    });

    setEntryNumber(n);
    setStatus("done");
    onSubmitted?.(n);
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl glass border border-white/10 p-8 text-center space-y-3"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="size-16 rounded-full mx-auto flex items-center justify-center shadow-glow"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <PartyPopper className="size-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-white">Ты в игре! 🎉</h3>
        <p className="text-white/50 text-sm">
          Твой порядковый номер заявки — <span className="font-mono text-white">#{entryNumber}</span>
        </p>
        <p className="text-white/35 text-xs">
          Результаты будут объявлены после завершения таймера. Удачи!
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl glass border border-white/10 p-6 sm:p-7 space-y-4"
    >
      <h3 className="text-lg font-semibold text-white mb-1">Участвовать</h3>

      <Input label="Имя" placeholder="Как вас зовут?" error={errors.name?.message} {...register("name")} />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Соц. сеть (необязательно)"
        placeholder="@username"
        {...register("socialHandle")}
      />

      <AnimatePresence>
        {customFields.map((field) => (
          <motion.div key={field.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
            <Input
              label={field.label}
              required={field.required}
              value={customValues[field.id] ?? ""}
              onChange={(e) => setCustomValues((p) => ({ ...p, [field.id]: e.target.value }))}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <label className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          {...register("agreeToRules")}
          className="mt-0.5 size-4 rounded border-white/20 bg-base-800 accent-current"
          style={{ color: primaryColor }}
        />
        <span className="text-xs text-white/50">
          Я согласен с правилами розыгрыша и даю согласие на обработку данных
        </span>
      </label>
      {errors.agreeToRules && (
        <p className="text-xs text-red-400">{errors.agreeToRules.message}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full mt-2"
        isLoading={status === "submitting"}
        disabled={requiredMissing}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        <Send className="size-4" />
        {requiredMissing ? "Выполните условия выше" : "Принять участие"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/30">
        <ShieldCheck className="size-3.5" />
        Честный выбор победителя — Fair Randomizer
      </p>
    </form>
  );
}
