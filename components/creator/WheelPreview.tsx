import { Disc3 } from "lucide-react";

interface WheelPreviewProps {
  labels: string[];
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
}

function conicGradient(count: number, primaryColor: string, secondaryColor: string): string {
  if (count === 0) return "rgba(255,255,255,0.06)";
  const palette = [primaryColor, secondaryColor, `${primaryColor}99`, `${secondaryColor}99`];
  const segAngle = 360 / count;
  const stops = Array.from(
    { length: count },
    (_, i) => `${palette[i % palette.length]} ${i * segAngle}deg ${(i + 1) * segAngle}deg`
  ).join(", ");
  return `conic-gradient(${stops})`;
}

/**
 * Чисто визуальный превью-виджет колеса — без анимации вращения и без
 * привязки к Fair Randomizer. Реагирует на список labels мгновенно: с
 * каждой новой строкой в StepSource появляется новый сектор. Используется
 * там, где нужно "увидеть колесо, пока набираешь варианты" — сам розыгрыш
 * (с реальным честным выбором) проводит SpinWheelReveal.
 */
export function WheelPreview({
  labels,
  primaryColor = "#8b5cf6",
  secondaryColor = "#d946ef",
  className,
}: WheelPreviewProps) {
  const segAngle = labels.length > 0 ? 360 / labels.length : 0;

  return (
    <div className={`relative mx-auto aspect-square w-52 sm:w-60 ${className ?? ""}`}>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg">
        <div
          className="size-0 border-l-[8px] border-r-[8px] border-t-[14px] border-l-transparent border-r-transparent"
          style={{ borderTopColor: secondaryColor }}
        />
      </div>

      <div
        className="absolute inset-0 rounded-full border-[3px] border-white/15 shadow-glow overflow-hidden transition-[background] duration-300"
        style={{ background: conicGradient(labels.length, primaryColor, secondaryColor) }}
      >
        {labels.map((label, i) => {
          const angle = i * segAngle + segAngle / 2;
          return (
            <div key={`${i}-${label}`} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
              <span className="absolute left-1/2 top-2 -translate-x-1/2 max-w-[56px] truncate text-center text-[9px] font-semibold text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-9 rounded-full glass border border-white/20 flex items-center justify-center shadow-glow">
          <Disc3 className="size-4 text-white/70" />
        </div>
      </div>

      {labels.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-center text-[11px] text-white/30 px-8">
          Впишите варианты слева
        </p>
      )}
    </div>
  );
}
