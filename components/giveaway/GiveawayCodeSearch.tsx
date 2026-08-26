"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, AlertCircle } from "lucide-react";
import { getGiveawayBySlug } from "@/lib/mock-giveaway";

/**
 * Поиск розыгрыша по коду (= slug) — по образцу "Найти конкурс по коду" у
 * конкурентов. Организатор делится коротким кодом отдельно от полной ссылки;
 * здесь просто проверяем, что такой розыгрыш существует, и ведём на него.
 */
export function GiveawayCodeSearch() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = code.trim().replace(/^\/?g\//, "").replace(/^https?:\/\/[^/]+\/g\//, "");
    if (!slug) return;

    setIsChecking(true);
    setError(null);
    const giveaway = await getGiveawayBySlug(slug);
    setIsChecking(false);

    if (!giveaway) {
      setError("Розыгрыш с таким кодом не найден — проверьте написание");
      return;
    }
    router.push(`/g/${giveaway.slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl glass border border-white/10 p-4 sm:p-5">
      <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/50 mb-2.5">
        <Search className="size-3.5" /> Знаете код розыгрыша?
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Например: demo-coffee-wheel"
          className="flex-1 min-w-0 rounded-xl bg-base-900/50 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-neon-violet/50"
        />
        <button
          type="submit"
          disabled={!code.trim() || isChecking}
          className="inline-flex items-center gap-1.5 shrink-0 bg-cta-gradient text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-glow hover:shadow-[0_0_35px_-5px_rgba(217,70,239,0.6)] transition-shadow disabled:opacity-40 disabled:pointer-events-none"
        >
          Найти <ArrowRight className="size-4" />
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400 mt-2.5">
          <AlertCircle className="size-3.5" /> {error}
        </p>
      )}
    </form>
  );
}
