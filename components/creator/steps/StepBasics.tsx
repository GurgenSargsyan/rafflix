"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Lock, Globe2 } from "lucide-react";
import { basicsSchema, type BasicsFormValues } from "@/lib/schemas";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { StepEyebrow } from "@/components/creator/StepEyebrow";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { GiveawayVisibility } from "@/types";

const VISIBILITY_OPTIONS: {
  value: GiveawayVisibility;
  icon: typeof Lock;
  title: string;
  description: string;
}[] = [
  {
    value: "private",
    icon: Lock,
    title: "Только по ссылке",
    description: "Для своей аудитории — не появляется в общем каталоге розыгрышей",
  },
  {
    value: "public",
    icon: Globe2,
    title: "Публичный",
    description: "Дополнительно виден всем на странице /giveaways — больше охвата",
  },
];

export function StepBasics() {
  const { draft, updateDraft, setVisibility } = useGiveawayStore();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<BasicsFormValues>({
    resolver: zodResolver(basicsSchema),
    defaultValues: { title: draft.title, description: draft.description },
    mode: "onBlur",
  });

  const values = watch();

  // Синхронизируем локальную форму с глобальным драфтом на каждое изменение.
  useEffect(() => {
    updateDraft({ title: values.title, description: values.description });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.title, values.description]);

  return (
    <div className="space-y-6">
      <StepEyebrow />
      <div>
        <h2 className="text-2xl font-semibold text-white">Расскажите о розыгрыше</h2>
        <p className="text-white/50 text-sm mt-1">
          Название и описание — это первое, что увидят участники.
        </p>
      </div>

      <Input
        label="Название розыгрыша"
        placeholder="Например: Розыгрыш iPhone 16 Pro 🎁"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Описание"
        placeholder="Опишите условия, атмосферу и то, за что вы разыгрываете приз..."
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="text-right text-xs text-white/30">
        {values.description?.length ?? 0}/500
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">Видимость</p>
        <div className="grid grid-cols-2 gap-3">
          {VISIBILITY_OPTIONS.map(({ value, icon: Icon, title, description }) => {
            const active = draft.visibility === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setVisibility(value)}
                className={cn(
                  "text-left p-4 rounded-2xl border transition-all glass-light",
                  active
                    ? "border-neon-violet/60 shadow-glow bg-neon-violet/10"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                <Icon className={cn("size-5 mb-2", active ? "text-neon-violet" : "text-white/50")} />
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-white/40 mt-1">{description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
