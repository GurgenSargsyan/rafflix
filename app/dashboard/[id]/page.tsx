import { notFound } from "next/navigation";
import { DashboardGiveawayDetail } from "@/components/creator/DashboardGiveawayDetail";
import { getGiveawayById } from "@/lib/mock-giveaway";

interface DashboardGiveawayPageProps {
  params: { id: string };
}

export default async function DashboardGiveawayPage({ params }: DashboardGiveawayPageProps) {
  const giveaway = await getGiveawayById(params.id);

  if (!giveaway) {
    notFound();
  }

  return <DashboardGiveawayDetail giveaway={giveaway} />;
}
