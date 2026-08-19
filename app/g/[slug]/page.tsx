import { notFound } from "next/navigation";
import { GiveawayLanding } from "@/components/giveaway/GiveawayLanding";
import { HomeLink } from "@/components/ui/HomeLink";
import { getGiveawayBySlug } from "@/lib/mock-giveaway";

interface GiveawayPageProps {
  params: { slug: string };
}

/**
 * Публичный роут розыгрыша: /g/[slug].
 * Сейчас данные берутся из мок-функции getGiveawayBySlug — в будущем
 * заменяется на реальный запрос к Supabase (select by slug).
 */
export default async function GiveawayPage({ params }: GiveawayPageProps) {
  const giveaway = await getGiveawayBySlug(params.slug);

  if (!giveaway) {
    notFound();
  }

  return (
    <div>
      <HomeLink variant="fixed" />
      <GiveawayLanding giveaway={giveaway} />
    </div>
  );
}
