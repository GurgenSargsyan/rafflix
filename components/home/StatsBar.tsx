import { Reveal } from "@/components/home/Reveal";

/**
 * Честные факты о платформе, а не выдуманные метрики использования —
 * у нас пока нет реальных пользователей, чтобы показывать "500k+ users".
 * Каждая цифра здесь буквально верна по устройству продукта.
 */
const STATS = [
  { value: "3", label: "источника участников", sub: "Instagram, Telegram, форма" },
  { value: "100%", label: "честный алгоритм", sub: "seed + SHA-256, проверяемо" },
  { value: "< 5 мин", label: "от идеи до публикации", sub: "мастер из пары шагов" },
  { value: "$4.99", label: "Premium разово", sub: "без подписки, за розыгрыш" },
];

export function StatsBar() {
  return (
    <Reveal className="relative z-10 max-w-4xl mx-auto px-4 py-14">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center sm:border-l sm:border-white/10 sm:first:border-l-0 sm:px-4">
            <p className="font-mono text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neon-violet via-neon-fuchsia to-neon-cyan bg-clip-text text-transparent">
              {s.value}
            </p>
            <p className="text-sm text-white/70 mt-1">{s.label}</p>
            <p className="text-xs text-white/35 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
