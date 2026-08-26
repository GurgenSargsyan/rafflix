import type { YoutubeComment, YoutubeSource } from "@/types";

/**
 * =========================================================================
 *  YouTube Data API — сервисный слой (сейчас MOCK, контракт — реальный)
 * =========================================================================
 *  Реальная интеграция — YouTube Data API v3:
 *  1. fetchVideoByUrl()  → GET /videos?id={videoId}&part=snippet
 *  2. fetchComments()    → GET /commentThreads?videoId={videoId}&part=snippet
 *     с пагинацией по `nextPageToken`.
 * ========================================================================= */

/** Вытаскивает videoId из ссылки youtube.com/watch?v=... или youtu.be/... */
export function parseVideoUrl(url: string): { videoId: string } | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match ? { videoId: match[1] } : null;
}

const MOCK_USERNAMES = [
  "watcher_ivan", "kate_reviews", "maxplay", "olesya.tv", "dmitry_cinema",
  "nastya_vlog", "sergey.unbox", "vika_gaming", "artem_tech", "liza_music",
];

function mockCommentPool(count: number): Omit<YoutubeComment, "qualifies">[] {
  const templates = [
    "Участвую! 🎉",
    "Отличное видео, беру билет в розыгрыше 🙌",
    "+1",
    "Досмотрел до конца, участвую!",
    "Подписан, жду результатов 🔥",
  ];

  return Array.from({ length: count }, (_, i) => {
    const username = MOCK_USERNAMES[i % MOCK_USERNAMES.length] + (i >= MOCK_USERNAMES.length ? i : "");
    return {
      id: `yt_comment_${i}`,
      username,
      avatarUrl: undefined,
      text: templates[i % templates.length],
      likeCount: (i * 5) % 30,
      commentedAt: new Date(Date.now() - i * 1000 * 60 * 10).toISOString(),
    };
  });
}

function applyQualificationRules(
  comment: Omit<YoutubeComment, "qualifies">,
  rules: Pick<YoutubeSource, "requireKeyword" | "minCommentLength">
): boolean {
  const text = comment.text.toLowerCase();
  if (rules.requireKeyword && !text.includes(rules.requireKeyword.replace("#", "").toLowerCase())) {
    return false;
  }
  if (rules.minCommentLength && comment.text.trim().length < rules.minCommentLength) {
    return false;
  }
  return true;
}

/** Заглушка получения метаданных видео по ссылке. */
export async function fetchVideoByUrl(videoUrl: string): Promise<{
  videoId: string;
  channelUsername: string;
  mediaPreviewUrl: string;
  caption: string;
} | null> {
  const parsed = parseVideoUrl(videoUrl);
  if (!parsed) return null;

  await new Promise((r) => setTimeout(r, 900));

  return {
    videoId: parsed.videoId,
    channelUsername: "your_channel",
    mediaPreviewUrl: `https://picsum.photos/seed/yt-${parsed.videoId}/600/600`,
    caption: "Розыгрыш! Напиши комментарий под видео, чтобы участвовать 🎁",
  };
}

/** Заглушка сбора и фильтрации комментариев под видео. */
export async function fetchYoutubeComments(
  source: Pick<YoutubeSource, "requireKeyword" | "minCommentLength">,
  total = 38
): Promise<YoutubeComment[]> {
  await new Promise((r) => setTimeout(r, 700));

  return mockCommentPool(total).map((c) => ({
    ...c,
    qualifies: applyQualificationRules(c, source),
  }));
}

export function summarizeYoutubeComments(comments: YoutubeComment[]) {
  const qualified = comments.filter((c) => c.qualifies);
  return { total: comments.length, qualified: qualified.length, qualifiedComments: qualified };
}
