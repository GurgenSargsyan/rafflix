import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/utils";

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
  "Без водяного знака Rafflix",
  "Приоритетная поддержка",
];

/** Реальные тарифы платформы — те же данные, что и в мастере создания. */
export function PricingSection() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 py-20">
      <Reveal>
        <SectionHeader
          eyebrow="Тарифы"
          title="Просто и без подписки"
          description="Free — бесплатно навсегда. Premium — разово за конкретный розыгрыш, не ежемесячно"
        />
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-5 mt-10">
        <Reveal>
          <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-white">Free</h3>
            </div>
            <p className="text-3xl font-bold font-mono text-white mb-5">$0</p>
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((f) => (
                <FeatureRow key={f} label={f} />
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="h-full rounded-3xl border border-neon-fuchsia/30 bg-neon-fuchsia/[0.04] p-7 relative overflow-hidden">
            <div
              className="absolute -top-16 -right-16 size-48 rounded-full blur-3xl opacity-40"
              style={{ background: "rgba(217,70,239,0.5)" }}
            />
            <div className="relative flex items-center justify-between mb-1">
              <h3 className="flex items-center gap-1.5 text-lg font-semibold text-white">
                <Crown className="size-4 text-neon-fuchsia" /> Premium
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-cta-gradient px-2 py-1 rounded-full text-white">
                Популярный
              </span>
            </div>
            <p className="relative text-3xl font-bold font-mono text-white mb-1">
              $4.99 <span className="text-sm font-normal text-white/40">/ розыгрыш</span>
            </p>
            <p className="relative text-xs text-white/35 mb-5">Разово, не ежемесячно</p>
            <ul className="relative space-y-2.5">
              {PREMIUM_FEATURES.map((f) => (
                <FeatureRow key={f} label={f} accent />
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="text-center mt-8">
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-cta-gradient text-white px-7 py-3 rounded-2xl font-medium shadow-glow hover:shadow-[0_0_45px_-5px_rgba(217,70,239,0.6)] transition-shadow"
        >
          Начать бесплатно
        </Link>
      </Reveal>
    </section>
  );
}

function FeatureRow({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <li className="flex items-start gap-2 text-sm text-white/70">
      <Check className={cn("size-4 shrink-0 mt-0.5", accent ? "text-neon-fuchsia" : "text-neon-lime")} />
      {label}
    </li>
  );
}
