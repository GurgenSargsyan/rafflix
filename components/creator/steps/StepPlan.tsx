"use client";

import { motion } from "framer-motion";
import { Check, Crown, Lock, Palette } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { StepEyebrow } from "@/components/creator/StepEyebrow";
import { FREE_TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { PlanTier } from "@/types";

const FREE_FEATURES = [
  "Готовые стильные шаблоны",
  "Таймер обратного отсчёта",
  "Fair Randomizer — честный выбор победителя",
  "Неограниченное число участников",
];

const PREMIUM_FEATURES = [
  "Полностью кастомный дизайн страницы",
  "Свой логотип, цвета и фон",
  "Кастомные поля формы участия",
  "Без водяного знака Freespin",
  "Приоритетная поддержка",
];

export function StepPlan() {
  const { draft, setTier, selectTemplate, isPremiumUnlocked, openPaymentModal, markPremiumUnlocked } =
    useGiveawayStore();

  const handleSelect = (tier: PlanTier) => {
    if (tier === "premium" && !isPremiumUnlocked) {
      openPaymentModal();
      return;
    }
    setTier(tier);
  };

  return (
    <div className="space-y-6">
      <StepEyebrow />
      <div>
        <h2 className="text-2xl font-semibold text-white">Выберите тариф оформления</h2>
        <p className="text-white/50 text-sm mt-1">
          Free — быстро и красиво. Premium — полный контроль над брендингом.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* FREE */}
        <PlanCard
          active={draft.tier === "free"}
          onClick={() => handleSelect("free")}
          title="Free"
          price="0 ₸"
          badge={null}
          features={FREE_FEATURES}
          icon={<Palette className="size-5 text-neon-cyan" />}
          accent="cyan"
        />

        {/* PREMIUM */}
        <PlanCard
          active={draft.tier === "premium"}
          onClick={() => handleSelect("premium")}
          title="Premium"
          price="$19 / розыгрыш"
          badge={
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-cta-gradient px-2 py-1 rounded-full text-white">
              <Crown className="size-3" /> Рекомендуем
            </span>
          }
          features={PREMIUM_FEATURES}
          icon={
            isPremiumUnlocked ? (
              <Crown className="size-5 text-neon-fuchsia" />
            ) : (
              <Lock className="size-5 text-neon-fuchsia" />
            )
          }
          accent="fuchsia"
          footer={
            !isPremiumUnlocked && (
              <p className="text-[11px] text-white/40 mt-3">
                🔒 Требуется оплата — нажмите, чтобы открыть окно оплаты
              </p>
            )
          }
        />
      </div>

      {draft.tier === "free" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            Выберите шаблон оформления
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FREE_TEMPLATES.map((tpl) => {
              const active = draft.templateId === tpl.id;
              return (
                <motion.button
                  key={tpl.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectTemplate(tpl.id)}
                  className={cn(
                    "relative rounded-xl overflow-hidden border aspect-[3/4] flex flex-col justify-end p-2.5 transition-all",
                    active ? "border-neon-violet shadow-glow" : "border-white/10 hover:border-white/25"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${tpl.colors.primary}33, ${tpl.colors.secondary}33), ${tpl.colors.background}`,
                  }}
                >
                  {active && (
                    <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-cta-gradient flex items-center justify-center">
                      <Check className="size-3 text-white" />
                    </div>
                  )}
                  <span className="text-[11px] font-semibold text-white drop-shadow">{tpl.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface PlanCardProps {
  active: boolean;
  onClick: () => void;
  title: string;
  price: string;
  badge: React.ReactNode;
  features: string[];
  icon: React.ReactNode;
  accent: "cyan" | "fuchsia";
  footer?: React.ReactNode;
}

function PlanCard({ active, onClick, title, price, badge, features, icon, accent, footer }: PlanCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      className={cn(
        "text-left p-5 rounded-2xl border glass-light relative overflow-hidden transition-all duration-200",
        active
          ? accent === "cyan"
            ? "border-neon-cyan/60 shadow-glow-cyan bg-neon-cyan/5"
            : "border-neon-fuchsia/60 shadow-glow bg-neon-fuchsia/5"
          : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-lg font-semibold text-white">{title}</span>
        </div>
        {badge}
      </div>
      <p className="text-2xl font-bold text-gradient mb-4 font-mono">{price}</p>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/70">
            <Check className="size-4 text-neon-lime shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      {footer}
    </motion.button>
  );
}
