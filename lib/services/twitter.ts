import type { TwitterCriteriaType, TwitterEngagement, TwitterSource } from "@/types";

/**
 * =========================================================================
 *  X (Twitter) API — сервисный слой (сейчас MOCK, контракт — реальный)
 * =========================================================================
 *  Реальная интеграция — X API v2 (уровень доступа "Elevated"/"Pro"):
 *  1. fetchPostByUrl()  → GET /2/tweets/{id}?expansions=author_id
 *  2. fetchEngagement()  → GET /2/tweets/{id}/retweeted_by (ретвиты) +
 *     GET /2/tweets/search/recent?query=conversation_id:{id} (ответы),
 *     объединяются в один пул по user_id.
 *  Здесь оба критерия мокаются единым контрактом TwitterEngagement[].
 * ========================================================================= */

/** Разбирает ссылку вида https://x.com/{author}/status/{id} (домен twitter.com тоже валиден). */
export function parseTweetUrl(url: string): { author: string; tweetId: string } | null {
  const match = url.match(/(?:x|twitter)\.com\/([A-Za-z0-9_]+)\/status\/(\d+)/);
  return match ? { author: match[1], tweetId: match[2] } : null;
}

const MOCK_USERNAMES = [
  "dev_maxim", "kate_writes", "ilya.tech", "anna_crypto", "denis_x",
  "olga_news", "stas.build", "vika_media", "roman_now", "julia_web3",
];

const CRITERIA_LABELS: Record<TwitterCriteriaType, string> = {
  retweet: "ретвит",
  reply: "ответ",
};

export const TWITTER_CRITERIA_OPTIONS: { value: TwitterCriteriaType; label: string }[] = [
  { value: "retweet", label: "Ретвит" },
  { value: "reply", label: "Ответ" },
];

function mockEngagementPool(count: number): Omit<TwitterEngagement, "qualifies">[] {
  const replies = ["Участвую! 🚀", "В игре, удачи всем 🔥", "Ретвитнул(а), жду результатов", "+1", "Отличный розыгрыш!"];

  return Array.from({ length: count }, (_, i) => {
    const username = MOCK_USERNAMES[i % MOCK_USERNAMES.length] + (i >= MOCK_USERNAMES.length ? i : "");
    const completed: TwitterCriteriaType[] = [];
    if (i % 2 === 0) completed.push("retweet");
    if (i % 3 !== 1) completed.push("reply");

    return {
      id: `tw_action_${i}`,
      username,
      avatarUrl: undefined,
      completedCriteria: completed,
      replyText: completed.includes("reply") ? replies[i % replies.length] : undefined,
      actedAt: new Date(Date.now() - i * 1000 * 60 * 8).toISOString(),
    };
  });
}

function qualifies(action: Omit<TwitterEngagement, "qualifies">, required: TwitterCriteriaType[]): boolean {
  if (required.length === 0) return true;
  return required.every((c) => action.completedCriteria.includes(c));
}

/** Заглушка получения метаданных твита по ссылке. */
export async function fetchTweetByUrl(postUrl: string): Promise<{
  postId: string;
  authorUsername: string;
  mediaPreviewUrl: string;
  caption: string;
} | null> {
  const parsed = parseTweetUrl(postUrl);
  if (!parsed) return null;

  await new Promise((r) => setTimeout(r, 800));

  return {
    postId: parsed.tweetId,
    authorUsername: parsed.author,
    mediaPreviewUrl: `https://picsum.photos/seed/tw-${parsed.tweetId}/600/600`,
    caption: "Розыгрыш! Сделай ретвит и напиши ответ, чтобы участвовать 🎁",
  };
}

/** Заглушка сбора ретвитов/ответов и фильтрации по критериям. */
export async function fetchTwitterEngagement(
  requiredCriteria: TwitterCriteriaType[],
  total = 34
): Promise<TwitterEngagement[]> {
  await new Promise((r) => setTimeout(r, 700));

  return mockEngagementPool(total).map((a) => ({
    ...a,
    qualifies: qualifies(a, requiredCriteria),
  }));
}

export function summarizeTwitterEngagement(actions: TwitterEngagement[]) {
  const qualifiedActions = actions.filter((a) => a.qualifies);
  return { total: actions.length, qualified: qualifiedActions.length, qualifiedActions };
}

export function twitterCriteriaLabel(criteria: TwitterCriteriaType): string {
  return CRITERIA_LABELS[criteria];
}
