import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Logo size="lg" className="mb-3" />
      <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/30 mb-6">MVP</p>
      <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-2xl leading-tight">
        Кастомные <span className="text-gradient">розыгрыши</span>, которые хочется выиграть
      </h1>
      <p className="text-white/50 mt-4 max-w-md">
        Бесплатные стильные шаблоны или полный кастомный брендинг — выбирайте, как разыграть приз.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-cta-gradient text-white px-7 py-3.5 rounded-2xl font-medium shadow-glow hover:shadow-[0_0_45px_-5px_rgba(217,70,239,0.6)] transition-shadow"
        >
          Создать розыгрыш <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/g/demo-nike-comments"
          className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-medium hover:bg-white/5 transition-colors"
        >
          Демо: розыгрыш по комментариям IG
        </Link>
        <Link
          href="/g/demo-telegram-premium"
          className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-medium hover:bg-white/5 transition-colors"
        >
          Демо: розыгрыш в Telegram
        </Link>
        <Link
          href="/g/demo-iphone"
          className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-2xl font-medium hover:bg-white/5 transition-colors"
        >
          Демо: розыгрыш по форме
        </Link>
      </div>
      <Link
        href="/dashboard"
        className="mt-4 text-sm text-white/40 hover:text-white transition-colors"
      >
        Открыть дашборд создателя →
      </Link>
    </main>
  );
}
