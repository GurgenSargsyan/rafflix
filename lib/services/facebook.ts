import type { FacebookCriteriaType, FacebookEngagement, FacebookSource } from "@/types";

/**
 * =========================================================================
 *  Facebook Graph API — сервисный слой (сейчас MOCK, контракт — реальный)
 * =========================================================================
 *  Реальная интеграция — Facebook Graph API (Page Public Content Access):
 *  1. fetchPostByUrl()  → GET /{post-id}?fields=message,full_picture
 *  2. fetchEngagement() → GET /{post-id}/comments + GET /{post-id}/likes,
 *     объединяются в один пул по user id.
 * ========================================================================= */

/** Вытаскивает postId из ссылки вида facebook.com/{page}/posts/{id} или photo.php?fbid=... */
export function parsePostUrl(url: string): { pageUsername: string; postId: string } | null {
  const match = url.match(/facebook\.com\/([A-Za-z0-9.\-_]+)\/posts\/(\w+)/);
  if (match) return { pageUsername: match[1], postId: match[2] };
  const fbid = url.match(/fbid=(\d+)/);
  return fbid ? { pageUsername: "page", postId: fbid[1] } : null;
}

const MOCK_USERNAMES = [
  "Игорь Смирнов", "Мария Иванова", "Denis Petrov", "Olga Kuznetsova", "Артём Волков",
  "Анастасия Лебедева", "Сергей Морозов", "Виктория Новикова", "Максим Козлов", "Дарья Фёдорова",
];

const CRITERIA_LABELS: Record<FacebookCriteriaType, string> = {
  comment: "комментарий",
  like: "лайк",
};

export const FACEBOOK_CRITERIA_OPTIONS: { value: FacebookCriteriaType; label: string }[] = [
  { value: "comment", label: "Комментарий" },
  { value: "like", label: "Лайк / реакция" },
];

function mockEngagementPool(count: number): Omit<FacebookEngagement, "qualifies">[] {
  const comments = ["Участвую! 🎉", "Отличный конкурс, беру билет 🙌", "+1", "Поставил(а) лайк, участвую", "Удачи всем 🔥"];

  return Array.from({ length: count }, (_, i) => {
    const username = MOCK_USERNAMES[i % MOCK_USERNAMES.length];
    const completed: FacebookCriteriaType[] = [];
    if (i % 2 === 0) completed.push("like");
    if (i % 3 !== 1) completed.push("comment");

    return {
      id: `fb_action_${i}`,
      username: i >= MOCK_USERNAMES.length ? `${username} ${i}` : username,
      avatarUrl: undefined,
      completedCriteria: completed,
      commentText: completed.includes("comment") ? comments[i % comments.length] : undefined,
      actedAt: new Date(Date.now() - i * 1000 * 60 * 12).toISOString(),
    };
  });
}

function qualifies(action: Omit<FacebookEngagement, "qualifies">, required: FacebookCriteriaType[]): boolean {
  if (required.length === 0) return true;
  return required.every((c) => action.completedCriteria.includes(c));
}

/** Заглушка получения метаданных поста страницы по ссылке. */
export async function fetchFacebookPostByUrl(postUrl: string): Promise<{
  postId: string;
  pageUsername: string;
  mediaPreviewUrl: string;
  caption: string;
} | null> {
  const parsed = parsePostUrl(postUrl);
  if (!parsed) return null;

  await new Promise((r) => setTimeout(r, 800));

  return {
    postId: parsed.postId,
    pageUsername: parsed.pageUsername,
    mediaPreviewUrl: `https://picsum.photos/seed/fb-${parsed.postId}/600/600`,
    caption: "Розыгрыш! Оставь комментарий и лайк, чтобы участвовать 🎁",
  };
}

/** Заглушка сбора комментариев/лайков и фильтрации по критериям. */
export async function fetchFacebookEngagement(
  requiredCriteria: FacebookCriteriaType[],
  total = 30
): Promise<FacebookEngagement[]> {
  await new Promise((r) => setTimeout(r, 700));

  return mockEngagementPool(total).map((a) => ({
    ...a,
    qualifies: qualifies(a, requiredCriteria),
  }));
}

export function summarizeFacebookEngagement(actions: FacebookEngagement[]) {
  const qualifiedActions = actions.filter((a) => a.qualifies);
  return { total: actions.length, qualified: qualifiedActions.length, qualifiedActions };
}

export function facebookCriteriaLabel(criteria: FacebookCriteriaType): string {
  return CRITERIA_LABELS[criteria];
}
