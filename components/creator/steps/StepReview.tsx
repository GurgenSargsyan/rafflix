"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Gift,
  Instagram,
  Send,
  FormInput,
  ListChecks,
  Palette,
  Rocket,
  Users,
  ExternalLink,
} from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { Button } from "@/components/ui/Button";
import { draftToGiveaway } from "@/lib/mock-giveaway";
import { saveGiveaway } from "@/lib/services/supabase";
import { criteriaLabel } from "@/lib/services/telegram";
import { placeLabel, totalWinnerCount, resolveShowValue } from "@/lib/prizes";
import { formatNumber } from "@/lib/utils";

const PRIZE_TYPE_SHORT = { physical: "физ.", digital: "цифр.", money: "деньги" } as const;

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gift;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-none">
      <Icon className="size-4 text-white/40 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-white/40 uppercase tracking-wide">{label}</p>
        <div className="text-sm text-white mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export function StepReview() {
  const { draft } = useGiveawayStore();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    await saveGiveaway(draftToGiveaway(draft));
    setIsPublishing(false);
    setPublished(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-neon-cyan">
        <Rocket className="size-4" />
        <span className="text-xs font-medium uppercase tracking-widest">Финальный шаг</span>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-white">Проверьте и опубликуйте</h2>
        <p className="text-white/50 text-sm mt-1">
          Всё выглядит хорошо? Публикуем розыгрыш и получаем ссылку для участников.
        </p>
      </div>

      <div className="rounded-2xl glass border border-white/10 p-5">
        <SummaryRow icon={Gift} label="Название" value={draft.title || "—"} />
        <SummaryRow
          icon={Gift}
          label={`Призы (${draft.prizes.length}), победителей: ${totalWinnerCount(draft.prizes)}`}
          value={
            <ul className="space-y-0.5">
              {draft.prizes.map((p, i) => (
                <li key={p.id}>
                  {placeLabel(i)}: {p.title || "—"} ({PRIZE_TYPE_SHORT[p.type]}
                  {p.quantity > 1 ? `, ×${p.quantity}` : ""})
                  {p.estimatedValue != null &&
                    (resolveShowValue(p) ? (
                      <span className="text-white/50"> · ${formatNumber(p.estimatedValue)}</span>
                    ) : (
                      <span className="text-white/30"> · сумма скрыта от участников</span>
                    ))}
                </li>
              ))}
            </ul>
          }
        />
        <SummaryRow
          icon={
            draft.entrySource === "instagram_comments"
              ? Instagram
              : draft.entrySource === "telegram_channel"
                ? Send
                : FormInput
          }
          label="Источник участников"
          value={
            draft.entrySource === "instagram_comments" ? (
              <span className="text-neon-fuchsia font-medium">
                Комментарии в Instagram
                {draft.instagramSource?.qualifiedCount != null &&
                  ` · ${formatNumber(draft.instagramSource.qualifiedCount)} подходящих комментариев`}
              </span>
            ) : draft.entrySource === "telegram_channel" ? (
              <span className="text-neon-cyan font-medium">
                Telegram-канал ({draft.telegramSource?.requiredCriteria?.map(criteriaLabel).join(" + ") || "—"})
                {draft.telegramSource?.qualifiedCount != null &&
                  ` · ${formatNumber(draft.telegramSource.qualifiedCount)} подходящих подписчиков`}
              </span>
            ) : (
              "Форма на сайте"
            )
          }
        />
        <SummaryRow
          icon={ListChecks}
          label="Условия участия"
          value={
            draft.entryConditions.length
              ? draft.entryConditions.map((c) => c.label).join(" · ")
              : "Без условий (свободное участие)"
          }
        />
        <SummaryRow
          icon={Palette}
          label="Тариф оформления"
          value={
            draft.tier === "premium" ? (
              <span className="text-neon-fuchsia font-medium">Premium · кастомный брендинг</span>
            ) : (
              <span className="text-neon-cyan font-medium">Free · готовый шаблон</span>
            )
          }
        />
        <SummaryRow
          icon={CalendarClock}
          label="Дедлайн розыгрыша"
          value={new Date(draft.endDate).toLocaleString("ru-RU")}
        />
        <SummaryRow
          icon={Users}
          label="Ожидаемая аудитория"
          value={`Неограниченно · заявки нумеруются автоматически`}
        />
      </div>

      {!published ? (
        <Button
          size="lg"
          className="w-full"
          isLoading={isPublishing}
          onClick={handlePublish}
        >
          <Rocket className="size-4" />
          Опубликовать розыгрыш
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-neon-lime/30 bg-neon-lime/5 p-5 text-center space-y-3"
        >
          <p className="text-white font-medium">🎉 Розыгрыш опубликован!</p>
          <p className="text-sm text-white/50">
            Публичная страница готова — поделитесь ссылкой с участниками.
          </p>
          <Button variant="outline" onClick={() => router.push("/g/preview")}>
            Открыть страницу розыгрыша <ExternalLink className="size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
