import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/home/Reveal";

const STEPS = [
  {
    title: "Выберите источник и приз",
    description: "Форма на сайте, комментарии в Instagram или действия в Telegram-канале — и один или несколько призов подряд.",
  },
  {
    title: "Настройте условия и дизайн",
    description: "Готовый шаблон бесплатно, либо полный кастомный брендинг — логотип, цвета, шрифт, свой домен.",
  },
  {
    title: "Опубликуйте и запустите Fair Randomizer",
    description: "Ссылка готова сразу. Когда время выйдет — честный алгоритм выбирает победителя, а seed и хэш публикуются для проверки.",
  },
];

/** Три шага — это не декоративная нумерация, это буквально шаги мастера создания. */
export function HowItWorks() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 py-20">
      <Reveal>
        <SectionHeader eyebrow="Как это работает" title="От идеи до розыгрыша — три шага" />
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-6 mt-10">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div className="relative pl-0">
              <span className="font-mono text-4xl font-bold text-white/10">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-white font-semibold mt-3">{step.title}</h3>
              <p className="text-sm text-white/45 mt-2 leading-relaxed">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
