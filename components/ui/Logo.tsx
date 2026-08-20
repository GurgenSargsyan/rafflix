import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl sm:text-7xl",
} as const;

export interface LogoProps {
  size?: keyof typeof SIZE_CLASSES;
  /** "gradient" — фирменный градиент (по умолчанию); "flat" — сплошной цвет (наследует color/currentColor). */
  variant?: "gradient" | "flat";
  className?: string;
}

/**
 * Логотип Rafflix — Unbounded ExtraBold с фирменным градиентом
 * (violet → fuchsia → cyan). См. дизайн: docs/rafflix-wordmark (Artifact).
 */
export function Logo({ size = "md", variant = "gradient", className }: LogoProps) {
  return (
    <span
      className={cn(
        "font-display font-extrabold tracking-tight leading-none select-none",
        SIZE_CLASSES[size],
        variant === "gradient" ? "text-gradient" : "text-current",
        className
      )}
    >
      RAFFLIX
    </span>
  );
}
