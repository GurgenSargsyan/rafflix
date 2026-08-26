import { notFound } from "next/navigation";
import { ResultsView } from "@/components/giveaway/ResultsView";
import { getGiveawayBySlug } from "@/lib/mock-giveaway";
import { buildParticipants } from "@/lib/mock-participants";

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
  const participants = buildParticipants(giveaway);

  return <ResultsView giveaway={giveaway} participants={participants} />;
}
