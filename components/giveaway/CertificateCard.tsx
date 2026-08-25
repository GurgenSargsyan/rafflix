import { ShieldCheck, Trophy } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { placeLabel } from "@/lib/prizes";
import type { Participant, Prize, RandomizerResult } from "@/types";

interface CertificateCardProps {
  giveawayTitle: string;
  prizes: Prize[];
  result: RandomizerResult;
  participants: Participant[];
  primaryColor: string;
  secondaryColor: string;
}

function participantLabel(p: Participant) {
  if (p.source === "instagram_comment") return `@${p.instagram?.username ?? p.name}`;
  if (p.source === "telegram_action") return `@${p.telegram?.username ?? p.name}`;
  return p.name;
}

/**
 * "Сертификат прозрачности" — карточка формата Stories (9:16), которую можно
 * скачать и опубликовать: победители + криптографическое доказательство
 * честности выбора (seed + hash). См. CertificateDownloadButton — рендерит
 * этот же компонент в PNG через html-to-image.
 */
export function CertificateCard({
  giveawayTitle,
  prizes,
  result,
  participants,
  primaryColor,
  secondaryColor,
}: CertificateCardProps) {
  // Порядок призов в розыгрыше (главный приз первым), а не алфавитный по prizeId.
  const prizeOrder = new Map(prizes.map((p, i) => [p.id, i]));
  const winners = [...result.winners].sort(
    (a, b) => (prizeOrder.get(a.prizeId) ?? 0) - (prizeOrder.get(b.prizeId) ?? 0) || a.placeInPrize - b.placeInPrize
  );

  return (
    <div
      className="relative w-full aspect-[9/16] max-w-[340px] mx-auto overflow-hidden rounded-3xl border border-white/10"
      style={{ backgroundColor: "#06050b" }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(60% 45% at 50% 15%, ${primaryColor}33, transparent 70%), radial-gradient(45% 35% at 15% 85%, ${secondaryColor}26, transparent 70%)`,
        }}
      />

      <div className="relative h-full flex flex-col px-6 py-8 text-center">
        <Logo size="sm" className="mx-auto" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 mt-3">
          Результаты честного розыгрыша
        </p>

        <h2 className="text-white font-semibold text-lg mt-5 leading-snug text-balance">{giveawayTitle}</h2>

        <div className="flex-1 flex flex-col justify-center gap-3 mt-4">
          {winners.map((w) => {
            const prizeIndex = prizes.findIndex((p) => p.id === w.prizeId);
            const prize = prizes[prizeIndex];
            const participant = participants.find((p) => p.id === w.participantId);
            if (!prize || !participant) return null;
            return (
              <div
                key={`${w.prizeId}-${w.placeInPrize}`}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-wide text-white/35">
                  <Trophy className="size-3" style={{ color: primaryColor }} />
                  {placeLabel(prizeIndex)}
                </p>
                <p className="text-white font-semibold mt-1">{participantLabel(participant)}</p>
                <p className="text-xs text-white/40 mt-0.5">{prize.title}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 mt-4">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-neon-lime">
            <ShieldCheck className="size-3.5" /> Проверено криптографически
          </p>
          <p className="font-mono text-[9px] text-white/30 mt-2 break-all leading-relaxed">
            seed: {result.seed.slice(0, 20)}…
          </p>
          <p className="font-mono text-[9px] text-white/30 break-all leading-relaxed">
            hash: {result.verificationHash.slice(0, 20)}…
          </p>
        </div>

        <p className="text-[10px] text-white/25 mt-4">rafflix.app · Fair Randomizer</p>
      </div>
    </div>
  );
}
