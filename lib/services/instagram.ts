import type { InstagramComment, InstagramSource } from "@/types";

/**
 * =========================================================================
 *  Instagram Graph API — сервисный слой (сейчас MOCK, контракт — реальный)
 * =========================================================================
 *  Реальная интеграция (когда будет готов OAuth-флоу):
 *
 *  1. Владелец подключает Business/Creator-аккаунт через Facebook Login for
 *     Business, выдавая права `instagram_basic`, `instagram_manage_comments`,
 *     `pages_show_list`. Токен обмена → долгоживущий access_token сохраняется
 *     в БД (зашифрованным) на User.instagramAccount.
 *
 *  2. parsePostUrl() остаётся как есть — просто вытаскивает media shortcode.
 *
 *  3. fetchPostByUrl() заменяется на реальный вызов:
 *       GET https://graph.instagram.com/v21.0/{media_id}
 *         ?fields=id,caption,media_url,permalink,username
 *         &access_token={token}
 *
 *  4. fetchComments() заменяется на:
 *       GET https://graph.instagram.com/v21.0/{media_id}/comments
 *         ?fields=id,username,text,like_count,timestamp
 *         &access_token={token}
 *     с пагинацией по `paging.next`.
 *
 *  5. Для live-синхронизации без поллинга — подписка на вебхук `comments`
 *     через Meta App Webhooks (topic: instagram, field: comments).
 * ========================================================================= */

/** Вытаскивает "shortcode" поста из ссылки вида instagram.com/p/{shortcode}/. */
export function parsePostUrl(url: string): { shortcode: string } | null {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  return match ? { shortcode: match[1] } : null;
}

const MOCK_USERNAMES = [
  "anna_travel", "dmitry.codes", "kate_style22", "max_gymlife", "olesya_art",
  "ivan_photo", "nastya.b", "sergey_moto", "vika_beauty", "artem_music",
  "liza_food", "roman_fit", "dasha_kz", "pavel_travel", "yulia.designs",
];

/** Генерирует псевдослучайный, но воспроизводимый по seed набор мок-комментариев. */
function mockCommentPool(count: number): Omit<InstagramComment, "qualifies">[] {
  const templates = [
    "Участвую! 🔥",
    "+1 хочу выиграть 🙏",
    "Отметила подругу @{mention}, участвуем вместе!",
    "Круто, давно мечтала о таком призе #rafflix",
    "🔥🔥🔥",
    "Я в игре, удачи всем!",
    "@{mention} смотри какой розыгрыш!",
    "Подписан, жду результатов",
    "#rafflix участвую с этого аккаунта",
    "Вот бы выиграть именно мне 😄",
  ];

  return Array.from({ length: count }, (_, i) => {
    const username = MOCK_USERNAMES[i % MOCK_USERNAMES.length] + (i >= MOCK_USERNAMES.length ? i : "");
    const text = templates[i % templates.length].replace("{mention}", MOCK_USERNAMES[(i + 3) % MOCK_USERNAMES.length]);
    return {
      id: `ig_comment_${i}`,
      username,
      avatarUrl: undefined,
      text,
      likeCount: (i * 7) % 40,
      commentedAt: new Date(Date.now() - i * 1000 * 60 * 13).toISOString(),
    };
  });
}

/** Применяет фильтры розыгрыша (хэштег / упоминание / мин. длина) к комментарию. */
function applyQualificationRules(
  comment: Omit<InstagramComment, "qualifies">,
  rules: Pick<InstagramSource, "requireHashtag" | "requireMention" | "minCommentLength">
): boolean {
  const text = comment.text.toLowerCase();
  if (rules.requireHashtag && !text.includes(rules.requireHashtag.replace("#", "").toLowerCase())) {
    return false;
  }
  if (rules.requireMention && !text.includes("@")) {
    return false;
  }
  if (rules.minCommentLength && comment.text.trim().length < rules.minCommentLength) {
    return false;
  }
  return true;
}

/**
 * Заглушка запроса метаданных поста по ссылке (аналог GET /{media-id}).
 * В реальной интеграции — запрос к Graph API с access_token владельца аккаунта.
 */
export async function fetchPostByUrl(postUrl: string): Promise<{
  postId: string;
  accountUsername: string;
  mediaPreviewUrl: string;
  caption: string;
} | null> {
  const parsed = parsePostUrl(postUrl);
  if (!parsed) return null;

  // Симулируем задержку сетевого запроса.
  await new Promise((r) => setTimeout(r, 900));

  return {
    postId: `media_${parsed.shortcode}`,
    accountUsername: "your_brand",
    mediaPreviewUrl: `https://picsum.photos/seed/${parsed.shortcode}/600/600`,
    caption: "Розыгрыш! Оставь комментарий, чтобы принять участие 🎁",
  };
}

/**
 * Заглушка получения и фильтрации комментариев (аналог GET /{media-id}/comments).
 * total — сколько "реальных" комментариев под постом, из них считаем, сколько
 * прошли фильтр условий розыгрыша.
 */
export async function fetchComments(
  source: Pick<InstagramSource, "requireHashtag" | "requireMention" | "minCommentLength">,
  total = 42
): Promise<InstagramComment[]> {
  await new Promise((r) => setTimeout(r, 700));

  return mockCommentPool(total).map((c) => ({
    ...c,
    qualifies: applyQualificationRules(c, source),
  }));
}

/** Удобный агрегат для UI: сколько всего / сколько прошло фильтр. */
export function summarizeComments(comments: InstagramComment[]) {
  const qualified = comments.filter((c) => c.qualifies);
  return { total: comments.length, qualified: qualified.length, qualifiedComments: qualified };
}
