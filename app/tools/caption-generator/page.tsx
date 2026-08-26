"use client";

import { useMemo, useState } from "react";
import {
  MessageSquareText,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Music2,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCw,
} from "lucide-react";
import { HomeLink } from "@/components/ui/HomeLink";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  generateCaption,
  PLATFORM_OPTIONS,
  TONE_OPTIONS,
  type CaptionPlatform,
  type CaptionPrize,
  type CaptionTone,
} from "@/lib/caption-generator";

const PLATFORM_ICONS: Record<CaptionPlatform, typeof Instagram> = {
  instagram: Instagram,
  twitter: Twitter,
  tiktok: Music2,
  facebook: Facebook,
  youtube: Youtube,
};

function defaultDeadline(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function formatDeadline(iso: string): string {
  if (!iso) return "окончания срока";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "окончания срока";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

/**
 * Генератор подписей для розыгрышей — честная шаблонная сборка (см.
 * lib/caption-generator.ts), без обращения к чужим аккаунтам и без
 * "ИИ"-заглушки: результат строится из того, что ввёл сам пользователь.
 */
export default function CaptionGeneratorPage() {
  const [platform, setPlatform] = useState<CaptionPlatform>("instagram");
  const [brand, setBrand] = useState("");
  const [prizes, setPrizes] = useState<CaptionPrize[]>([{ name: "", winners: 1 }]);
  const [mustFollow, setMustFollow] = useState(true);
  const [followAccounts, setFollowAccounts] = useState("");
  const [mustLike, setMustLike] = useState(true);
  const [mustTagFriends, setMustTagFriends] = useState(true);
  const [tagCount, setTagCount] = useState(2);
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [tone, setTone] = useState<CaptionTone>("fun");
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const caption = useMemo(
    () =>
      generateCaption(
        {
          platform,
          brand,
          prizes,
          rules: {
            mustFollow,
            followAccounts: followAccounts.split(",").map((a) => a.trim()).filter(Boolean),
            mustLike,
            mustTagFriends,
            tagCount,
          },
          deadlineLabel: formatDeadline(deadline),
          tone,
        },
        seed
      ),
    [platform, brand, prizes, mustFollow, followAccounts, mustLike, mustTagFriends, tagCount, deadline, tone, seed]
  );

  const updatePrize = (i: number, patch: Partial<CaptionPrize>) =>
    setPrizes((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API недоступен — молча игнорируем
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
          <MessageSquareText className="size-7 text-neon-violet" /> Генератор подписей
        </h1>
        <p className="text-white/50 text-sm mt-2">
          Готовая подпись для розыгрыша за несколько секунд — приз, правила, срок и тон.
        </p>
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-6 sm:p-8 space-y-7">
        {/* Платформа */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">Платформа</p>
          <div className="grid grid-cols-5 gap-2">
            {PLATFORM_OPTIONS.map(({ value, label }) => {
              const Icon = PLATFORM_ICONS[value];
              const isActive = platform === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPlatform(value)}
                  title={label}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-colors",
                    isActive
                      ? "border-neon-violet/60 bg-neon-violet/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  <Icon className="size-4" />
                  <span className="text-[9px] font-medium leading-none">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="Название бренда / аккаунта"
          placeholder="Например: Rafflix"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        {/* Призы */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">Призы</p>
          <div className="space-y-2">
            {prizes.map((prize, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={prize.name}
                  onChange={(e) => updatePrize(i, { name: e.target.value })}
                  placeholder="Название приза"
                  className="flex-1 min-w-0 rounded-xl bg-base-900/50 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-neon-violet/50"
                />
                <input
                  type="number"
                  min={1}
                  value={prize.winners}
                  onChange={(e) => updatePrize(i, { winners: Math.max(1, Number(e.target.value) || 1) })}
                  className="w-16 shrink-0 rounded-xl bg-base-900/50 border border-white/10 px-2 py-2.5 text-sm text-white text-center focus:outline-none focus:border-neon-violet/50"
                  title="Количество победителей"
                />
                <button
                  type="button"
                  onClick={() => setPrizes((prev) => prev.filter((_, idx) => idx !== i))}
                  disabled={prizes.length === 1}
                  className="size-9 shrink-0 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPrizes((prev) => [...prev, { name: "", winners: 1 }])}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
          >
            <Plus className="size-3.5" /> Добавить приз
          </button>
        </div>

        {/* Правила */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">Условия участия</p>
          <div className="p-3 rounded-xl glass border border-white/10 space-y-3">
            <Switch
              checked={mustFollow}
              onChange={setMustFollow}
              label="Подписаться на аккаунт"
              description="Участники должны подписаться, чтобы участвовать"
            />
            {mustFollow && (
              <input
                type="text"
                value={followAccounts}
                onChange={(e) => setFollowAccounts(e.target.value)}
                placeholder="username через запятую"
                className="w-full rounded-lg bg-base-900/50 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-neon-violet/50"
              />
            )}
          </div>
          <div className="p-3 rounded-xl glass border border-white/10">
            <Switch checked={mustLike} onChange={setMustLike} label="Поставить лайк" description="Лайк на пост о розыгрыше" />
          </div>
          <div className="p-3 rounded-xl glass border border-white/10 space-y-3">
            <Switch
              checked={mustTagFriends}
              onChange={setMustTagFriends}
              label="Отметить друзей"
              description="В комментариях под постом"
            />
            {mustTagFriends && (
              <input
                type="number"
                min={1}
                value={tagCount}
                onChange={(e) => setTagCount(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 rounded-lg bg-base-900/50 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-violet/50"
              />
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="Срок (до какой даты)"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* Тон */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">Тон подписи</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TONE_OPTIONS.map(({ value, label }) => {
              const isActive = tone === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTone(value)}
                  className={cn(
                    "px-3 py-2 rounded-xl border text-xs font-medium transition-colors",
                    isActive
                      ? "border-neon-violet/60 bg-neon-violet/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={() => setSeed((s) => s + 1)}>
          <RotateCw className="size-4" />
          {seed === 0 ? "Сгенерировать подпись" : "Сгенерировать другой вариант"}
        </Button>

        {/* Результат */}
        <div className="rounded-2xl bg-base-900/50 border border-white/10 p-4 space-y-3">
          <pre className="whitespace-pre-wrap text-sm text-white/90 font-sans leading-relaxed">{caption}</pre>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
          >
            {copied ? <Check className="size-3.5 text-neon-lime" /> : <Copy className="size-3.5" />}
            {copied ? "Скопировано" : "Скопировать подпись"}
          </button>
        </div>
      </div>
    </main>
  );
}
