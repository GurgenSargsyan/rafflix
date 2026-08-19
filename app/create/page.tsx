import { GiveawayCreatorWizard } from "@/components/creator/GiveawayCreatorWizard";
import { HomeLink } from "@/components/ui/HomeLink";

export default function CreateGiveawayPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:py-16">
      <HomeLink variant="fixed" />
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          Rafflix · Создание розыгрыша
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Запустите свой <span className="text-gradient">розыгрыш</span> за пару минут
        </h1>
      </div>
      <GiveawayCreatorWizard />
    </main>
  );
}
