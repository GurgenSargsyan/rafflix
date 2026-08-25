import { GiveawayCreatorWizard } from "@/components/creator/GiveawayCreatorWizard";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";

interface CreateGiveawayPageProps {
  searchParams: { source?: string; draw?: string };
}

export default function CreateGiveawayPage({ searchParams }: CreateGiveawayPageProps) {
  return (
    <main className="min-h-screen px-4 py-10 sm:py-16">
      <HomeLink variant="fixed" />
      <div className="text-center mb-10">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          <Logo size="sm" /> · Создание розыгрыша
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Запустите свой <span className="text-gradient">розыгрыш</span> за пару минут
        </h1>
      </div>
      <GiveawayCreatorWizard initialSource={searchParams.source} initialDrawStyle={searchParams.draw} />
    </main>
  );
}
