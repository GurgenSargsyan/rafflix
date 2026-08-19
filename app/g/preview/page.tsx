"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { GiveawayLanding } from "@/components/giveaway/GiveawayLanding";
import { HomeLink } from "@/components/ui/HomeLink";
import { draftToGiveaway } from "@/lib/mock-giveaway";

/**
 * Превью страницы розыгрыша прямо из текущего черновика мастера (Zustand).
 * В реальном приложении здесь будет запрос к БД по slug'у — см. app/g/[slug]/page.tsx.
 */
export default function GiveawayPreviewPage() {
  const draft = useGiveawayStore((s) => s.draft);
  const giveaway = draftToGiveaway(draft);

  return (
    <div>
      <div className="fixed top-4 left-4 z-20 flex items-center gap-2">
        <Link
          href="/create"
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-black/40 backdrop-blur px-3 py-2 rounded-full border border-white/10 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Назад в мастер
        </Link>
        <HomeLink />
      </div>
      <GiveawayLanding giveaway={giveaway} />
    </div>
  );
}
