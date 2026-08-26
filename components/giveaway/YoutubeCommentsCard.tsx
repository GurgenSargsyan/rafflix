"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube, ExternalLink, RefreshCw, MessageCircle } from "lucide-react";
import { fetchYoutubeComments, summarizeYoutubeComments } from "@/lib/services/youtube";
import { formatNumber } from "@/lib/utils";
import type { YoutubeComment, YoutubeSource } from "@/types";

interface YoutubeCommentsCardProps {
  source: YoutubeSource;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Публичная витрина розыгрыша "по видео YouTube": показывает видео и живую
 * ленту комментариев, прошедших фильтр условий. Участие не требует формы —
 * достаточно оставить комментарий под видео.
 */
export function YoutubeCommentsCard({ source, primaryColor, secondaryColor }: YoutubeCommentsCardProps) {
  const [comments, setComments] = useState<YoutubeComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    setIsLoading(true);
    const data = await fetchYoutubeComments(
      { requireKeyword: source.requireKeyword, minCommentLength: source.minCommentLength },
      source.qualifiedCount ? source.qualifiedCount + 15 : 32
    );
    setComments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.videoId]);

  const { qualified, qualifiedComments } = summarizeYoutubeComments(comments);

  return (
    <div className="rounded-3xl glass border border-white/10 shadow-glass overflow-hidden">
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <div
          className="size-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <Youtube className="size-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{source.channelUsername}</p>
          <p className="text-xs text-white/40 truncate">{source.caption}</p>
        </div>
        <a
          href={source.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs shrink-0 px-3 py-1.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
        >
          Открыть видео <ExternalLink className="size-3.5" />
        </a>
      </div>

      {source.mediaPreviewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={source.mediaPreviewUrl} alt="Видео розыгрыша" className="w-full aspect-square object-cover" />
      )}

      <div className="p-5 space-y-4">
        <div
          className="rounded-2xl p-4 border text-center"
          style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}12` }}
        >
          <p className="text-sm text-white">
            Оставь комментарий{" "}
            {source.requireKeyword && (
              <span className="font-mono font-semibold" style={{ color: primaryColor }}>
                {source.requireKeyword}
              </span>
            )}{" "}
            под видео — и ты автоматически участвуешь!
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <MessageCircle className="size-4" style={{ color: primaryColor }} />
            {isLoading ? "Загружаем..." : `${formatNumber(qualified)} участников по комментариям`}
          </div>
          <button
            type="button"
            onClick={loadComments}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Обновить
          </button>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {qualifiedComments.slice(0, 12).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-base-900/50 border border-white/5"
            >
              <div
                className="size-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {c.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">@{c.username}</p>
                <p className="text-xs text-white/45 truncate">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[11px] text-white/30 text-center">
          Список обновляется автоматически. Победитель выбирается из всех, кто прошёл условия — Fair Randomizer.
        </p>
      </div>
    </div>
  );
}
