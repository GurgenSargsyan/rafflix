import { notFound } from "next/navigation";
import { ResultsView } from "@/components/giveaway/ResultsView";
import { getGiveawayBySlug } from "@/lib/mock-giveaway";
import {
  generateMockFormParticipants,
  generateMockInstagramParticipants,
  generateMockTelegramParticipants,
} from "@/lib/mock-participants";

interface ResultsPageProps {
  params: { slug: string };
}

/**
 * Публичная страница результатов розыгрыша: /g/[slug]/results.
 * Победители + seed/hash Fair Randomizer + скачиваемый сертификат для Stories.
 */
export default async function ResultsPage({ params }: ResultsPageProps) {
  const giveaway = await getGiveawayBySlug(params.slug);

  if (!giveaway) {
    notFound();
  }

  // В реальном приложении — запрос участников из БД по giveaway.id (см. DashboardGiveawayDetail).
  const participants =
    giveaway.entrySource === "instagram_comments"
      ? generateMockInstagramParticipants(giveaway.id, giveaway.participantsCount)
      : giveaway.entrySource === "telegram_channel"
        ? generateMockTelegramParticipants(giveaway.id, giveaway.participantsCount)
        : generateMockFormParticipants(giveaway.id, giveaway.participantsCount);

  return <ResultsView giveaway={giveaway} participants={participants} />;
}
