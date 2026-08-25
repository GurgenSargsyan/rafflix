import Link from "next/link";
import { Instagram, Send, FormInput, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/home/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const DEMOS = [
  {
    href: "/g/demo-nike-comments",
    icon: Instagram,
    accent: "text-neon-fuchsia",
    title: "Розыгрыш кроссовок Nike",
    description: "Участники импортируются прямо из комментариев под постом — без формы регистрации",
    tag: "Instagram",
  },
  {
    href: "/g/demo-telegram-premium",
    icon: Send,
    accent: "text-neon-cyan",
    title: "Telegram Premium на год",
    description: "Лайк + комментарий к посту в канале — критерии участия настраиваются создателем",
    tag: "Telegram",
  },
  {
    href: "/g/demo-iphone",
    icon: FormInput,
    accent: "text-neon-violet",
    title: "Розыгрыш iPhone 16 Pro",
    description: "Классическая форма участия, три приза подряд и кастомный премиум-брендинг",
    tag: "Форма + Premium",
  },
];

/** Живые примеры вместо блога — у нас есть реальные работающие демо-страницы. */
export function LiveDemos() {
  return (
    <section id="demos" className="relative z-10 max-w-5xl mx-auto px-4 py-20">
      <Reveal>
        <SectionHeader
          eyebrow="Живые демо"
          title="Посмотрите, как это выглядит для участника"
          description="Три реальные публичные страницы — откройте и пройдите путь участника целиком"
        />
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {DEMOS.map((d, i) => (
          <Reveal key={d.href} delay={i * 0.08}>
            <Link href={d.href} className="block h-full">
              <SpotlightCard className="h-full p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <d.icon className={`size-5 ${d.accent}`} />
                  <span className="text-[10px] font-mono uppercase tracking-wide text-white/30">{d.tag}</span>
                </div>
                <h3 className="text-white font-semibold">{d.title}</h3>
                <p className="text-sm text-white/45 mt-1.5 leading-relaxed">{d.description}</p>
                <span className="inline-flex items-center gap-1 text-xs text-white/40 mt-4 group-hover:text-white">
                  Открыть <ArrowUpRight className="size-3.5" />
                </span>
              </SpotlightCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
