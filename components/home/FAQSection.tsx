"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/home/Reveal";

const FAQ = [
  {
    q: "Это бесплатно?",
    a: "Да, Free-тариф бесплатен навсегда и включает готовые шаблоны и Fair Randomizer. Premium — $19 разово за конкретный розыгрыш, без ежемесячной подписки.",
  },
  {
    q: "Как выбирается победитель честно?",
    a: "Fair Randomizer генерирует криптографический seed и считает SHA-256 хэш от него и списка участников. Оба значения публикуются — любой может пересчитать выбор и убедиться, что список не подменялся.",
  },
  {
    q: "Нужно ли программировать или устанавливать бота?",
    a: "Нет — весь розыгрыш настраивается через мастер. Для сбора участников из Instagram или Telegram нужно один раз подключить аккаунт/бота с правами администратора.",
  },
  {
    q: "Можно ли разыграть несколько призов?",
    a: "Да. Призы разыгрываются последовательно в заданном порядке — сначала главный, затем следующий, и один участник не может выиграть два приза подряд.",
  },
  {
    q: "У меня уже есть аудитория в Instagram или Telegram — это подходит?",
    a: "Да, это самый быстрый способ: участники импортируются автоматически из комментариев, реакций или репостов — без формы регистрации на сайте.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative z-10 max-w-2xl mx-auto px-4 py-20">
      <Reveal>
        <SectionHeader eyebrow="Частые вопросы" title="Всё, что нужно знать перед началом" />
      </Reveal>

      <div className="mt-10 space-y-2">
        {FAQ.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={item.q} delay={i * 0.04}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-white">{item.q}</span>
                  <ChevronDown
                    className={`size-4 text-white/40 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
