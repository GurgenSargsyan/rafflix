import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeLinkProps {
  /** "fixed" — плавающая кнопка поверх контента (для публичных/полноэкранных страниц). */
  variant?: "fixed" | "inline";
  className?: string;
}

/** Ссылка "На главную" — единообразная навигация назад к app/page.tsx. */
export function HomeLink({ variant = "inline", className }: HomeLinkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-black/30 backdrop-blur px-3 py-2 rounded-full border border-white/10 transition-colors",
        variant === "fixed" && "fixed top-4 left-4 z-20",
        className
      )}
    >
      <Home className="size-3.5" /> На главную
    </Link>
  );
}
