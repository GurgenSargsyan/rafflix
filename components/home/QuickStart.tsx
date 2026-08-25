"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wand2, LayoutTemplate, Instagram, Send, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

const ACCENTS = {
  violet: { text: "text-neon-violet", border: "hover:border-neon-violet/40", glow: "rgba(139,92,246,0.5)", wash: "from-neon-violet/15" },
  lime: { text: "text-neon-lime", border: "hover:border-neon-lime/40", glow: "rgba(163,230,53,0.45)", wash: "from-neon-lime/15" },
  fuchsia: { text: "text-neon-fuchsia", border: "hover:border-neon-fuchsia/40", glow: "rgba(217,70,239,0.5)", wash: "from-neon-fuchsia/15" },
  cyan: { text: "text-neon-cyan", border: "hover:border-neon-cyan/40", glow: "rgba(34,211,238,0.5)", wash: "from-neon-cyan/15" },
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

/** Четыре главных пути входа: создать с нуля / шаблон / Instagram / Telegram. */
export function QuickStart() {
  return (
    <Reveal className="relative z-10 max-w-3xl mx-auto px-4">
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
    </Reveal>
  );
}
