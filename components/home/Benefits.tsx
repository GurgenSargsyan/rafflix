import { Clock, Eye, Users2, SlidersHorizontal } from "lucide-react";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/home/Reveal";

const BENEFITS = [
  {
    icon: Clock,
    title: "Экономит время",
    description: "Не нужно вручную собирать участников в таблицу и вытягивать победителя из шапки",
  },
  {
    icon: Eye,
    title: "Прозрачно для всех",
    description: "Seed и хэш результата видны публично — участники сами могут проверить честность выбора",
  },
  {
    icon: Users2,
    title: "Работает с вашей аудиторией",
    description: "Не нужно переводить подписчиков куда-то ещё — участие прямо в Instagram или Telegram",
  },
  {
    icon: SlidersHorizontal,
    title: "Растёт вместе с вами",
    description: "Начните бесплатно с шаблона, переходите на кастомный брендинг когда понадобится",
  },
];

export function Benefits() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 py-20">
      <Reveal>
        <SectionHeader eyebrow="Преимущества" title="Почему выбирают Rafflix" align="left" />
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.06} className="flex gap-4">
            <div className="shrink-0 size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-violet">
              <b.icon className="size-5" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{b.title}</h3>
              <p className="text-sm text-white/45 mt-1 leading-relaxed">{b.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
