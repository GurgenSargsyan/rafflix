"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="relative z-10 px-4 pt-16 sm:pt-24 pb-8 flex flex-col items-center text-center"
    >
      <motion.div variants={rise}>
        <Logo size="lg" className="mb-3" />
      </motion.div>
      <motion.p variants={rise} className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/30 mb-6">
        MVP · Платформа розыгрышей
      </motion.p>

      <motion.h1
        variants={rise}
        className="text-4xl sm:text-6xl font-bold text-white max-w-3xl leading-[1.05] text-balance"
      >
        Кастомные{" "}
        <span className="bg-gradient-to-r from-neon-violet via-neon-fuchsia to-neon-cyan bg-clip-text text-transparent">
          розыгрыши
        </span>
        , которые хочется выиграть
      </motion.h1>

      <motion.p variants={rise} className="text-white/50 mt-5 max-w-lg text-lg leading-relaxed">
        Собирайте участников прямо из Instagram и Telegram, разыгрывайте несколько призов подряд и
        выбирайте победителя честно — с публичным криптографическим доказательством.
      </motion.p>

      <motion.div variants={rise} className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-cta-gradient text-white px-7 py-3.5 rounded-2xl font-medium shadow-glow hover:shadow-[0_0_45px_-5px_rgba(217,70,239,0.6)] transition-shadow"
        >
          Создать розыгрыш <ArrowRight className="size-4" />
        </Link>
        <a
          href="#demos"
          className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-medium hover:bg-white/5 transition-colors"
        >
          <PlayCircle className="size-4" /> Смотреть демо
        </a>
      </motion.div>
    </motion.section>
  );
}
