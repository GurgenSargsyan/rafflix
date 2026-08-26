import Link from "next/link";
import { Type, Gauge, ArrowUpRight } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";

const TOOLS = [
  {
    href: "/tools/font-generator",
    icon: Type,
    title: "Генератор шрифтов",
    description: "Стильные Unicode-шрифты для био, комментариев и историй",
    accent: "text-neon-violet",
  },
  {
    href: "/tools/engagement-calculator",
    icon: Gauge,
    title: "Калькулятор вовлечённости",
    description: "Engagement Rate по вашим цифрам — подписчики, лайки, комментарии",
    accent: "text-neon-cyan",
  },
];

/**
 * Хаб бесплатных инструментов для соцсетей. Сознательно не включает
 * "просмотр историй анонимно" / "скачать аватар" / "экспорт комментариев" —
 * без официального доступа к API Instagram такие инструменты либо не
 * работают на самом деле, либо подсовывают выдуманные данные вместо чужого
 * реального профиля. Оба инструмента ниже считают честно — без обращения к
 * чужим аккаунтам.
 */
export default function ToolsHubPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-3xl mx-auto">
      <div className="mb-6">
        <HomeLink />
      </div>

      <div className="mb-10">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          <Logo size="sm" /> · Инструменты
        </p>
        <h1 className="text-3xl font-bold text-white">Бесплатные инструменты для соцсетей</h1>
        <p className="text-white/50 text-sm mt-2 max-w-xl">
          Честные инструменты, которые действительно считают/генерируют результат в браузере — без
          доступа к чужим аккаунтам и без выдуманных данных.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {TOOLS.map(({ href, icon: Icon, title, description, accent }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl glass border border-white/10 p-5 hover:border-white/20 transition-colors"
          >
            <div className={`inline-flex items-center justify-center size-11 rounded-2xl bg-white/5 border border-white/10 ${accent} mb-4`}>
              <Icon className="size-5" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-1.5">
              {title}
              <ArrowUpRight className="size-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </h2>
            <p className="text-sm text-white/45">{description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
