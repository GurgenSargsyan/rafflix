import { ShieldCheck, Instagram, Send, Layers, Palette, Gauge } from "lucide-react";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/home/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

/** Асимметричная bento-сетка: главная фича (Fair Randomizer) шире остальных. */
export function FeaturesBento() {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
      <Reveal>
        <SectionHeader
          eyebrow="Возможности"
          title="Всё нужное для честного розыгрыша"
          description="Не набор галочек ради галочек — каждая фича решает конкретную проблему организатора"
        />
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <Reveal className="sm:col-span-2">
          <SpotlightCard className="h-full p-7">
            <ShieldCheck className="size-6 text-neon-lime mb-4" />
            <h3 className="text-xl font-semibold text-white">Fair Randomizer — честность, которую можно проверить</h3>
            <p className="text-white/50 mt-2 leading-relaxed max-w-md">
              Криптографический seed и SHA-256 хэш публикуются вместе с результатом. Любой участник может
              пересчитать выбор победителя и убедиться, что список не подменялся после розыгрыша.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.05}>
          <SpotlightCard className="h-full p-6">
            <Instagram className="size-5 text-neon-fuchsia mb-4" />
            <h3 className="font-semibold text-white">Комментарии в Instagram</h3>
            <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
              Участники импортируются автоматически — без формы регистрации.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.1}>
          <SpotlightCard className="h-full p-6">
            <Send className="size-5 text-neon-cyan mb-4" />
            <h3 className="font-semibold text-white">Telegram-канал</h3>
            <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
              Лайк, репост или комментарий — критерии участия на ваш выбор.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.15}>
          <SpotlightCard className="h-full p-6">
            <Layers className="size-5 text-neon-violet mb-4" />
            <h3 className="font-semibold text-white">Несколько призов подряд</h3>
            <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
              Последовательный розыгрыш: главный приз, затем следующий — без повторов победителей.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.2} className="sm:col-span-2 lg:col-span-1">
          <SpotlightCard className="h-full p-6">
            <Palette className="size-5 text-neon-pink mb-4" />
            <h3 className="font-semibold text-white">Кастомный брендинг</h3>
            <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
              Логотип, цвета, шрифт и без водяного знака — на Premium-тарифе.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.25} className="lg:col-span-2">
          <SpotlightCard className="h-full p-6">
            <Gauge className="size-5 text-neon-cyan mb-4" />
            <h3 className="font-semibold text-white">Дашборд создателя в реальном времени</h3>
            <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
              Живой список участников из любого источника и запуск честного розыгрыша в один клик.
            </p>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
