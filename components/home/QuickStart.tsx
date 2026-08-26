"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wand2,
  LayoutTemplate,
  Instagram,
  Send,
  Twitter,
  Youtube,
  Facebook,
  Layers,
  FormInput,
  ListPlus,
  Disc3,
  ArrowUpRight,
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/utils";

const ACCENTS = {
  violet: { text: "text-neon-violet", border: "hover:border-neon-violet/40", glow: "rgba(139,92,246,0.5)", wash: "from-neon-violet/15" },
  lime: { text: "text-neon-lime", border: "hover:border-neon-lime/40", glow: "rgba(163,230,53,0.45)", wash: "from-neon-lime/15" },
  fuchsia: { text: "text-neon-fuchsia", border: "hover:border-neon-fuchsia/40", glow: "rgba(217,70,239,0.5)", wash: "from-neon-fuchsia/15" },
  cyan: { text: "text-neon-cyan", border: "hover:border-neon-cyan/40", glow: "rgba(34,211,238,0.5)", wash: "from-neon-cyan/15" },
  pink: { text: "text-neon-pink", border: "hover:border-neon-pink/40", glow: "rgba(236,72,153,0.5)", wash: "from-neon-pink/15" },
} as const;

interface OptionCardProps {
  href: string;
  icon: typeof Wand2;
  title: string;
  description: string;
  accent: keyof typeof ACCENTS;
  featured?: boolean;
}

function OptionCard({ href, icon: Icon, title, description, accent, featured }: OptionCardProps) {
  const a = ACCENTS[accent];
  return (
    <Link href={href} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className={`relative h-full rounded-3xl border border-white/10 ${a.border} bg-white/[0.03] overflow-hidden transition-colors duration-300 ${
          featured ? "p-7 sm:p-8" : "p-6"
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${a.wash} to-transparent transition-opacity duration-300 ${
            featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
        <div
          className={`absolute -top-10 -right-10 size-32 rounded-full blur-3xl transition-opacity duration-500 ${
            featured ? "opacity-40 group-hover:opacity-70" : "opacity-0 group-hover:opacity-60"
          }`}
          style={{ background: a.glow }}
        />

        <div className={featured ? "relative flex items-center gap-5 flex-wrap sm:flex-nowrap text-left" : "relative flex flex-col"}>
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`inline-flex items-center justify-center shrink-0 rounded-2xl bg-white/5 border border-white/10 ${a.text} ${
              featured ? "size-14" : "size-11"
            }`}
          >
            <Icon className={featured ? "size-6" : "size-5"} />
          </motion.div>

          <div className="flex-1">
            <h3 className={`font-semibold text-white ${featured ? "text-xl sm:text-2xl" : "text-lg mt-4"}`}>{title}</h3>
            <p className="text-white/45 leading-relaxed text-sm mt-1.5">{description}</p>
          </div>

          <ArrowUpRight
            className={`text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ${
              featured ? "size-5 shrink-0" : "size-4 absolute top-0 right-0"
            }`}
          />
        </div>
      </motion.div>
    </Link>
  );
}

/** Когорта "через соцсети" — участники импортируются автоматически, без формы. */
const SOCIAL_COHORT: OptionCardProps[] = [
  {
    href: "/create?source=instagram_comments",
    icon: Instagram,
    title: "Instagram",
    description: "Участники — все, кто оставил комментарий",
    accent: "fuchsia",
  },
  {
    href: "/create?source=telegram_channel",
    icon: Send,
    title: "Telegram",
    description: "Лайк, репост или комментарий в канале",
    accent: "cyan",
  },
  {
    href: "/create?source=twitter_engagement",
    icon: Twitter,
    title: "X (Twitter)",
    description: "Ретвит и/или ответ на твит",
    accent: "violet",
  },
  {
    href: "/create?source=youtube_comments",
    icon: Youtube,
    title: "YouTube",
    description: "Комментарии под видео на канале",
    accent: "pink",
  },
  {
    href: "/create?source=facebook_engagement",
    icon: Facebook,
    title: "Facebook",
    description: "Комментарий и/или лайк под постом страницы",
    accent: "lime",
  },
  {
    href: "/create?source=multi_platform",
    icon: Layers,
    title: "Несколько площадок",
    description: "Объединить посты с разных соцсетей в один пул",
    accent: "cyan",
  },
];

/** Когорта "без соцсетей" — своя аудитория или мгновенный случайный выбор. */
const NO_SOCIAL_COHORT: OptionCardProps[] = [
  {
    href: "/create?source=form",
    icon: FormInput,
    title: "Форма на сайте",
    description: "Классическая регистрация: имя, email, соц. сети",
    accent: "cyan",
  },
  {
    href: "/create?source=manual_list",
    icon: ListPlus,
    title: "Свой список",
    description: "Впишите варианты вручную — без регистрации",
    accent: "fuchsia",
  },
  {
    href: "/create?draw=wheel",
    icon: Disc3,
    title: "Колесо Фортуны",
    description: "Эффектное колесо вместо обычного барабана",
    accent: "pink",
  },
];

const COHORTS = [
  { id: "social", label: "Через соцсети", items: SOCIAL_COHORT },
  { id: "no-social", label: "Без соцсетей", items: NO_SOCIAL_COHORT },
] as const;

/**
 * Главные пути входа на главной, сгруппированные по когортам: сверху —
 * "как начать" (с нуля / готовый шаблон), ниже — переключатель "откуда
 * участники" с двумя вкладками, чтобы длинный список видов розыгрыша не
 * превращался в стену карточек.
 */
export function QuickStart() {
  const [activeCohort, setActiveCohort] = useState<(typeof COHORTS)[number]["id"]>("social");
  const active = COHORTS.find((c) => c.id === activeCohort) ?? COHORTS[0];

  return (
    <Reveal className="relative z-10 max-w-3xl mx-auto px-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <OptionCard
          href="/create"
          icon={Wand2}
          title="Создать с нуля"
          description="Приз, условия участия и дизайн — под ваш бренд"
          accent="violet"
          featured
        />
        <OptionCard
          href="/create"
          icon={LayoutTemplate}
          title="Готовый шаблон"
          description="Готовый дизайн — добавьте только приз и текст"
          accent="lime"
          featured
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Откуда берём участников
          </p>
          <div className="flex items-center gap-2">
            {COHORTS.map((cohort) => {
              const isActive = cohort.id === activeCohort;
              return (
                <button
                  key={cohort.id}
                  type="button"
                  onClick={() => setActiveCohort(cohort.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                    isActive
                      ? "bg-neon-violet/15 border-neon-violet/50 text-white shadow-glow"
                      : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
                  )}
                >
                  {cohort.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Без mode="wait" и без AnimatePresence: смена key просто монтирует
            новую вкладку заново — без риска "зависнуть" на старой, если
            анимация не докручивается (фоновая вкладка/reduced-motion). */}
        <motion.div
          key={activeCohort}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {active.items.map((item) => (
            <OptionCard key={item.href + item.title} {...item} />
          ))}
        </motion.div>
      </div>
    </Reveal>
  );
}
