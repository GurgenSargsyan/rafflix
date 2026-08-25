import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/home/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

/**
 * ЗАГЛУШКА: у платформы пока нет реальных клиентов. Роли вместо вымышленных
 * имён и фото — чтобы не выдавать плейсхолдер за настоящий отзыв. Замените
 * на реальные цитаты, как только появятся первые пользователи.
 */
const TESTIMONIALS = [
  {
    role: "Организатор конкурсов в Instagram",
    quote:
      "Больше не нужно вручную листать комментарии и объяснять подписчикам, что выбор был честным — теперь это видно по самой ссылке.",
  },
  {
    role: "Администратор Telegram-канала",
    quote:
      "Настроил критерии участия один раз — реакция и комментарий — и просто жду, пока список наберётся сам.",
  },
  {
    role: "Маркетолог небольшого бренда",
    quote:
      "Кастомный брендинг дал ощущение, что это наша собственная страница, а не шаблон с чужим логотипом.",
  },
];

export function Testimonials() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 py-20">
      <Reveal>
        <SectionHeader eyebrow="Отзывы" title="Что говорят организаторы" />
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.role} delay={i * 0.08}>
            <SpotlightCard className="h-full p-6">
              <p className="text-white/70 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs text-white/35 mt-4 font-mono">{t.role}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
