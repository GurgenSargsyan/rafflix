import Link from "next/link";
import { Dice5, Coins, Hash, Disc3, ArrowUpRight } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";

const GAMES = [
  {
    href: "/games/dice",
    icon: Dice5,
    title: "Игральная кость",
    description: "Бросить один или два кубика — честный случайный результат",
    accent: "text-neon-violet",
  },
  {
    href: "/games/coin-flip",
    icon: Coins,
    title: "Флип монеты",
    description: "Орёл или решка — простое случайное решение на двоих",
    accent: "text-neon-lime",
  },
  {
    href: "/games/random-number",
    icon: Hash,
    title: "Генератор случайных чисел",
    description: "Задайте диапазон — получите честное случайное число",
    accent: "text-neon-cyan",
  },
  {
    href: "/create?draw=wheel",
    icon: Disc3,
    title: "Колесо Фортуны",
    description: "Полноценный розыгрыш с колесом — для настоящих призов",
    accent: "text-neon-pink",
  },
];

/** Хаб бесплатных мини-инструментов для случайного выбора — без регистрации. */
export default function GamesHubPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-3xl mx-auto">
      <div className="mb-6">
        <HomeLink />
      </div>

      <div className="mb-10">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          <Logo size="sm" /> · Игры
        </p>
        <h1 className="text-3xl font-bold text-white">Бесплатные инструменты случайного выбора</h1>
        <p className="text-white/50 text-sm mt-2 max-w-xl">
          Быстрые мини-игры без регистрации — для честного решения на компании друзей или команды.
          Нужен настоящий розыгрыш с призами? Загляните в Колесо Фортуны.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {GAMES.map(({ href, icon: Icon, title, description, accent }) => (
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
