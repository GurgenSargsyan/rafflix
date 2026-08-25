import Link from "next/link";
import { ArrowRight, Compass, LayoutDashboard } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

export function FinalCTA() {
  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 py-20 pb-28">
      <Reveal>
        <div className="relative rounded-3xl border border-white/10 overflow-hidden p-10 sm:p-14 text-center">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, rgba(139,92,246,0.35), transparent 70%), radial-gradient(40% 60% at 90% 100%, rgba(34,211,238,0.25), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">
              Готовы запустить свой розыгрыш?
            </h2>
            <p className="text-white/50 mt-3 max-w-md mx-auto">
              Настройка занимает пару минут — начните с шаблона или подключите свою аудиторию из соцсетей.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-cta-gradient text-white px-7 py-3.5 rounded-2xl font-medium shadow-glow hover:shadow-[0_0_45px_-5px_rgba(217,70,239,0.6)] transition-shadow"
              >
                Создать розыгрыш <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-medium hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard className="size-4" /> Дашборд создателя
              </Link>
              <Link
                href="/giveaways"
                className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-medium hover:bg-white/5 transition-colors"
              >
                <Compass className="size-4" /> Найти розыгрыш
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
