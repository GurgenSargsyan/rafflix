import { Compass } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { PublicGiveawaysDirectory } from "@/components/giveaway/PublicGiveawaysDirectory";
import { getPublicActiveGiveaways } from "@/lib/mock-giveaway";

/**
 * Публичная страница-каталог (/giveaways): все активные розыгрыши с
 * visibility: "public" — любой посетитель может открыть условия и принять
 * участие. Приватные розыгрыши (для целевой аудитории, только по ссылке)
 * сюда не попадают — см. lib/mock-giveaway.getPublicActiveGiveaways.
 */
export default async function GiveawaysDirectoryPage() {
  const giveaways = await getPublicActiveGiveaways();

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-4xl mx-auto">
      <div className="mb-6">
        <HomeLink />
      </div>

      <div className="mb-10">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          <Logo size="sm" /> · Каталог
        </p>
        <h1 className="flex items-center gap-2.5 text-3xl font-bold text-white">
          <Compass className="size-7 text-neon-violet" /> Публичные розыгрыши
        </h1>
        <p className="text-white/50 text-sm mt-2 max-w-xl">
          Открытые розыгрыши, в которых может поучаствовать любой желающий. Выберите соцсеть и
          следуйте условиям — победителей выбирает честный алгоритм Rafflix.
        </p>
      </div>

      <PublicGiveawaysDirectory giveaways={giveaways} />
    </main>
  );
}
