"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wand2,
  LayoutTemplate,
  Instagram,
  Send,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-4 py-14 sm:py-20">
      {/* Атмосферное свечение фона */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 38% at 50% 8%, rgba(139,92,246,0.16), transparent 70%), radial-gradient(40% 30% at 85% 75%, rgba(34,211,238,0.10), transparent 70%)",
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center"
      >
        <motion.div variants={rise}>
          <Logo size="lg" className="mb-3" />
        </motion.div>
        <motion.p variants={rise} className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/30 mb-6">
          MVP
        </motion.p>

        <motion.h1 variants={rise} className="text-4xl sm:text-5xl font-bold text-white max-w-2xl leading-tight">
          Кастомные <span className="text-gradient">розыгрыши</span>, которые хочется выиграть
        </motion.h1>
        <motion.p variants={rise} className="text-white/50 mt-4 max-w-md">
          Выберите, с чего начать — готовый шаблон, чистый лист или аудитория, которая уже есть у вас
          в соцсетях.
        </motion.p>

        {/* Главные опции: один основной путь сверху, три вспомогательных — рядом ниже */}
        <motion.div variants={rise} className="w-full mt-11">
          <OptionCard
            href="/create"
            icon={Wand2}
            title="Создать розыгрыш"
            description="С нуля: приз, условия участия и дизайн — под ваш бренд"
            accent="violet"
            featured
          />
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <OptionCard
              href="/create"
              icon={LayoutTemplate}
              title="Выбрать шаблон"
              description="Готовый дизайн — добавьте только приз и текст"
              accent="lime"
            />
            <OptionCard
              href="/create?source=instagram_comments"
              icon={Instagram}
              title="Розыгрыш в Instagram"
              description="Участники — все, кто оставил комментарий"
              accent="fuchsia"
            />
            <OptionCard
              href="/create?source=telegram_channel"
              icon={Send}
              title="Розыгрыш в Telegram"
              description="Лайк, репост или комментарий в канале"
              accent="cyan"
            />
          </div>
        </motion.div>

        {/* Демо и дашборд — второстепенные ссылки */}
        <motion.div variants={rise} className="w-full mt-10 pt-8 border-t border-white/10">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/25 mb-3">
            Или посмотрите живые примеры
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <DemoLink href="/g/demo-nike-comments" label="Instagram-комментарии" />
            <DemoLink href="/g/demo-telegram-premium" label="Telegram-канал" />
            <DemoLink href="/g/demo-iphone" label="Форма участия" />
          </div>
        </motion.div>

        <motion.div variants={rise}>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            <LayoutDashboard className="size-3.5" />
            Открыть дашборд создателя
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

const ACCENTS = {
  violet: {
    text: "text-neon-violet",
    border: "hover:border-neon-violet/50",
    glow: "rgba(139,92,246,0.5)",
    wash: "from-neon-violet/15",
  },
  lime: {
    text: "text-neon-lime",
    border: "hover:border-neon-lime/50",
    glow: "rgba(163,230,53,0.45)",
    wash: "from-neon-lime/15",
  },
  fuchsia: {
    text: "text-neon-fuchsia",
    border: "hover:border-neon-fuchsia/50",
    glow: "rgba(217,70,239,0.5)",
    wash: "from-neon-fuchsia/15",
  },
  cyan: {
    text: "text-neon-cyan",
    border: "hover:border-neon-cyan/50",
    glow: "rgba(34,211,238,0.5)",
    wash: "from-neon-cyan/15",
  },
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
    <Link href={href} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className={`relative h-full rounded-3xl border ${
          featured ? "border-neon-violet/30" : "border-white/10"
        } ${a.border} bg-white/[0.03] overflow-hidden transition-colors duration-300 ${
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

        <div
          className={
            featured
              ? "relative flex items-center gap-5 flex-wrap sm:flex-nowrap text-left"
              : "relative flex flex-col"
          }
        >
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
            <h3 className={`font-semibold text-white ${featured ? "text-xl sm:text-2xl" : "text-lg mt-4"}`}>
              {title}
            </h3>
            <p className={`text-white/45 leading-relaxed ${featured ? "text-sm mt-1.5" : "text-sm mt-1.5"}`}>
              {description}
            </p>
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

function DemoLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-full px-3.5 py-1.5 transition-colors"
    >
      {label}
    </Link>
  );
}
