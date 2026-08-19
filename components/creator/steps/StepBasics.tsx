"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { basicsSchema, type BasicsFormValues } from "@/lib/schemas";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { StepEyebrow } from "@/components/creator/StepEyebrow";
import { Input, Textarea } from "@/components/ui/Input";

export function StepBasics() {
  const { draft, updateDraft } = useGiveawayStore();

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
    </div>
  );
}
