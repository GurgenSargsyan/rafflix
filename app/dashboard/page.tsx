import Link from "next/link";
import { ArrowRight, Crown, Instagram, Send, FormInput, ListPlus, Users, Plus } from "lucide-react";
import { DEMO_GIVEAWAYS } from "@/lib/mock-giveaway";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { formatNumber } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  draft: "Черновик",
  scheduled: "Запланирован",
  active: "Активен",
  completed: "Завершён",
  archived: "В архиве",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-4xl mx-auto">
      <div className="mb-6">
        <HomeLink />
      </div>
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
            <Logo size="sm" /> · Дашборд
          </p>
          <h1 className="text-3xl font-bold text-white">Ваши розыгрыши</h1>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-cta-gradient text-white px-5 py-2.5 rounded-xl font-medium shadow-glow hover:shadow-[0_0_35px_-5px_rgba(217,70,239,0.6)] transition-shadow"
        >
          <Plus className="size-4" /> Новый розыгрыш
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {DEMO_GIVEAWAYS.map((g) => (
          <Link
            key={g.id}
            href={`/dashboard/${g.id}`}
            className="group rounded-2xl glass border border-white/10 p-5 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                  g.status === "active"
                    ? "bg-neon-lime/15 text-neon-lime"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {STATUS_LABEL[g.status]}
              </span>
              {g.tier === "premium" ? (
                <span className="flex items-center gap-1 text-[11px] font-medium text-neon-fuchsia">
                  <Crown className="size-3.5" /> Premium
                </span>
              ) : (
                <span className="text-[11px] font-medium text-neon-cyan">Free</span>
              )}
            </div>

            <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-neon-cyan transition-colors">
              {g.title}
            </h2>
            <p className="text-sm text-white/40 line-clamp-2 mb-4">{g.description}</p>

            <div className="flex items-center justify-between text-xs text-white/45 border-t border-white/10 pt-3">
              <div className="flex items-center gap-1.5">
                {g.entrySource === "instagram_comments" ? (
                  <>
                    <Instagram className="size-3.5" /> Instagram-комментарии
                  </>
                ) : g.entrySource === "telegram_channel" ? (
                  <>
                    <Send className="size-3.5" /> Telegram-канал
                  </>
                ) : g.entrySource === "manual_list" ? (
                  <>
                    <ListPlus className="size-3.5" /> Свой список
                  </>
                ) : (
                  <>
                    <FormInput className="size-3.5" /> Форма на сайте
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5" /> {formatNumber(g.participantsCount)}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-white/30 mt-3 group-hover:text-white/60 transition-colors">
              Открыть <ArrowRight className="size-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
