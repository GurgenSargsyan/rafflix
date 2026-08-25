import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

/** Единообразная шапка секции лендинга: моно-эйброу → заголовок → подпись. */
export function SectionHeader({ eyebrow, title, description, align = "center", className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neon-violet/70 mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">{title}</h2>
      {description && <p className="mt-3 text-white/50 text-balance leading-relaxed">{description}</p>}
    </div>
  );
}
