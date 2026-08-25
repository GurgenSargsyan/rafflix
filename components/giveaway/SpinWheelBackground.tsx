interface SpinWheelBackgroundProps {
  primaryColor: string;
  secondaryColor: string;
}

const SEGMENTS = 8;

/**
 * Чисто декоративное 3D-колесо на фоне лендинга — для розыгрышей с
 * drawStyle: "wheel" (см. GiveawayLanding.tsx). Наклонено "под перспективой"
 * (как настоящее колесо фортуны на столе) и медленно бесконечно крутится;
 * низкая прозрачность + z-0, чтобы не мешать читаемости контента поверх.
 * aria-hidden и pointer-events: none — исключительно атмосфера.
 */
export function SpinWheelBackground({ primaryColor, secondaryColor }: SpinWheelBackgroundProps) {
  const palette = [primaryColor, secondaryColor, `${primaryColor}55`, `${secondaryColor}55`];
  const segAngle = 360 / SEGMENTS;
  const gradient = `conic-gradient(${Array.from(
    { length: SEGMENTS },
    (_, i) => `${palette[i % palette.length]} ${i * segAngle}deg ${(i + 1) * segAngle}deg`
  ).join(", ")})`;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      <div
        className="spin3d-wheel-tilt absolute -top-[30%] left-1/2 -translate-x-1/2 size-[720px] opacity-[0.16]"
        style={{ transformOrigin: "center" }}
      >
        <div
          className="spin3d-wheel-spin size-full rounded-full border-[6px] border-white/10"
          style={{ background: gradient }}
        />
      </div>
    </div>
  );
}
