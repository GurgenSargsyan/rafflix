"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, RefreshCw, AlertCircle, CheckCircle2, Hash } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

/** Панель настройки источника "youtube_comments" — ссылка на видео + фильтр комментариев. */
export function YoutubeSourcePanel() {
  const {
    draft,
    updateYoutubeSource,
    syncYoutubeComments,
    isSyncingYoutube,
    youtubeSyncError,
    youtubeComments,
  } = useGiveawayStore();

  const [videoUrl, setVideoUrl] = useState(draft.youtubeSource?.videoUrl ?? "");
  const yt = draft.youtubeSource;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 rounded-2xl border border-white/10 glass-light p-5"
    >
      <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
        <Youtube className="size-4 text-red-400" />
        Подключение видео YouTube
      </div>

      <Input
        label="Ссылка на видео"
        placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx"
        value={videoUrl}
        onChange={(e) => {
          setVideoUrl(e.target.value);
          updateYoutubeSource({ videoUrl: e.target.value });
        }}
        hint="Поддерживаются ссылки youtube.com/watch и youtu.be"
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <Input
          label="Обязательное слово в комментарии (необязательно)"
          placeholder="#rafflix"
          leftIcon={<Hash className="size-4" />}
          value={yt?.requireKeyword ?? ""}
          onChange={(e) => updateYoutubeSource({ requireKeyword: e.target.value })}
        />
        <Input
          label="Мин. длина комментария"
          type="number"
          value={yt?.minCommentLength ?? 0}
          onChange={(e) => updateYoutubeSource({ minCommentLength: Number(e.target.value) })}
        />
      </div>

      <button
        type="button"
        disabled={isSyncingYoutube || !videoUrl.trim()}
        onClick={syncYoutubeComments}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <RefreshCw className={cn("size-4", isSyncingYoutube && "animate-spin")} />
        Синхронизировать комментарии
      </button>

      {youtubeSyncError && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="size-3.5" /> {youtubeSyncError}
        </p>
      )}

      {youtubeComments.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs text-neon-lime font-medium">
            <CheckCircle2 className="size-3.5" />
            {yt?.qualifiedCount ?? 0} из {youtubeComments.length} комментариев прошли фильтр
          </p>
          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
            {youtubeComments
              .filter((c) => c.qualifies)
              .slice(0, 8)
              .map((c) => (
                <div key={c.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-base-900/50 border border-white/5">
                  <div className="size-7 rounded-full bg-cta-gradient flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {c.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium truncate">@{c.username}</p>
                    <p className="text-xs text-white/40 truncate">{c.text}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
