"use client";

import { useMemo, useState } from "react";
import { Type, Copy, Check } from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { applyFontStyle, getFontStyles } from "@/lib/font-styles";

const STYLES = getFontStyles();

/**
 * Генератор стильных шрифтов для био/комментариев Instagram — честная
 * client-side Unicode-трансформация, без API и без задержек. Работает и
 * без интернета: результат считается прямо в браузере.
 */
export default function FontGeneratorPage() {
  const [text, setText] = useState("Rafflix");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const results = useMemo(
    () => STYLES.map((s) => ({ ...s, value: applyFontStyle(text, s.id) })),
    [text]
  );

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    } catch {
      // clipboard API недоступен (напр. без HTTPS/разрешения) — молча игнорируем
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16 max-w-2xl mx-auto">
      <div className="mb-6">
        <HomeLink />
      </div>

      <div className="text-center mb-8">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan mb-2">
          <Logo size="sm" /> · Инструмент
        </p>
        <h1 className="flex items-center justify-center gap-2.5 text-3xl font-bold text-white">
          <Type className="size-7 text-neon-violet" /> Генератор шрифтов
        </h1>
        <p className="text-white/50 text-sm mt-2">
          Стильные Unicode-шрифты для био, комментариев и историй — копируй и вставляй.
        </p>
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-6 sm:p-8 space-y-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите текст..."
          maxLength={100}
          className="w-full rounded-xl bg-base-900/50 border border-white/10 px-4 py-3 text-base text-white placeholder:text-white/25 focus:outline-none focus:border-neon-violet/50"
        />

        <div className="space-y-2">
          {results.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-base-900/40 border border-white/5"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-white/30 mb-0.5">{r.label}</p>
                <p className="text-white text-lg truncate">{r.value || "—"}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(r.id, r.value)}
                disabled={!r.value}
                className="shrink-0 size-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
                title="Скопировать"
              >
                {copiedId === r.id ? (
                  <Check className="size-4 text-neon-lime" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/25 text-center">
          Работает только с латиницей и цифрами (A–Z, a–z, 0–9) — так устроены сами Unicode-блоки.
        </p>
      </div>
    </main>
  );
}
