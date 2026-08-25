import { ListPlus, ShieldCheck } from "lucide-react";
import { WheelPreview } from "@/components/creator/WheelPreview";
import type { DrawStyle } from "@/types";

interface ManualListCardProps {
  entries: string[];
  drawStyle: DrawStyle;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Публичная витрина розыгрыша "свой список" (entrySource: "manual_list") —
 * организатор уже вписал варианты сам, регистрация не нужна. Показывает
 * сами варианты — как колесо (если drawStyle: "wheel") или просто список.
 */
export function ManualListCard({ entries, drawStyle, primaryColor, secondaryColor }: ManualListCardProps) {
  return (
    <div className="rounded-3xl glass border border-white/10 shadow-glass overflow-hidden p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
          <ListPlus className="size-4" style={{ color: primaryColor }} />
          Варианты розыгрыша
        </div>
        <span className="text-xs text-white/40">{entries.length} вариантов</span>
      </div>

      {drawStyle === "wheel" ? (
        <WheelPreview labels={entries} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      ) : (
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {entries.map((entry, i) => (
            <div
              key={`${i}-${entry}`}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-base-900/50 border border-white/5"
            >
              <span
                className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {i + 1}
              </span>
              <p className="text-sm text-white truncate">{entry}</p>
            </div>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[11px] text-white/30 justify-center">
        <ShieldCheck className="size-3.5 text-neon-lime" />
        Участие не требуется — победитель выбирается из этого списка Fair Randomizer
      </p>
    </div>
  );
}
