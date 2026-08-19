import type { TelegramAction, TelegramCriteriaType, TelegramSource } from "@/types";

/**
 * =========================================================================
 *  Telegram — сервисный слой (сейчас MOCK, контракт — реальный)
 * =========================================================================
 *  В отличие от Instagram, где один Graph API закрывает все критерии, в
 *  Telegram каждый критерий технически устроен по-разному:
 *
 *  1. "reaction" (лайк) — Bot API отдаёт апдейт `message_reaction`, если бот
 *     добавлен в канал администратором с правом видеть реакции. Один запрос
 *     на подписку вебхука — и реакции приходят в реальном времени.
 *
 *  2. "comment" — комментарии к посту канала на самом деле пишутся в
 *     привязанной группе обсуждений (discussion group). Бот должен быть
 *     админом этой группы; апдейты обычных сообщений сопоставляются с постом
 *     через `reply_to_message.message_id` / `message_thread_id`.
 *
 *  3. "forward" (репост) — самый сложный случай: Bot API НЕ уведомляет
 *     автора канала о репостах его постов. Два рабочих подхода:
 *       a) MTProto-клиент от имени владельца (gramjs/telethon) с правами
 *          администратора канала, читающий статистику пересылок поста;
 *       b) самопроверка — участник жмёт inline-кнопку "Я сделал репост"
 *          после реального шеринга, а бот выборочно верифицирует через (a).
 *     Большинство существующих гивевей-ботов в Telegram используют (b).
 *
 *  lib здесь мокает результат всех трёх источников единым контрактом
 *  (TelegramAction[]), чтобы при подключении реальных интеграций компоненты
 *  выше по дереву не менялись — меняется только тело функций ниже.
 * ========================================================================= */

/** Разбирает ссылку вида https://t.me/{channel}/{messageId}. */
export function parseChannelPostUrl(url: string): { channelUsername: string; messageId: string } | null {
  const match = url.match(/t\.me\/([A-Za-z0-9_]+)\/(\d+)/);
  return match ? { channelUsername: match[1], messageId: match[2] } : null;
}

const MOCK_USERNAMES = [
  "alex_dev", "marina.k", "denis_travel", "sveta_art", "kirill.fit",
  "olga_style", "nikita_music", "elena.photo", "vlad_moto", "tatiana_beauty",
  "igor_code", "anya_food", "stas_gamer", "julia_kz", "andrey.biz",
];

const CRITERIA_LABELS: Record<TelegramCriteriaType, string> = {
  reaction: "лайк",
  forward: "репост",
  comment: "комментарий",
};

export const TELEGRAM_CRITERIA_OPTIONS: { value: TelegramCriteriaType; label: string }[] = [
  { value: "reaction", label: "Лайк (реакция)" },
  { value: "forward", label: "Репост" },
  { value: "comment", label: "Комментарий" },
];

function mockActionPool(count: number): Omit<TelegramAction, "qualifies">[] {
  const commentTemplates = [
    "Участвую! 🎉",
    "Классный приз, беру билет 🙌",
    "Уже сделал(а) всё по условиям",
    "+1",
    "Отличный розыгрыш, удачи всем 🔥",
  ];

  return Array.from({ length: count }, (_, i) => {
    const username = MOCK_USERNAMES[i % MOCK_USERNAMES.length] + (i >= MOCK_USERNAMES.length ? i : "");
    // Псевдослучайный, но детерминированный по индексу набор выполненных критериев.
    const completed: TelegramCriteriaType[] = [];
    if (i % 2 === 0) completed.push("reaction");
    if (i % 3 === 0) completed.push("forward");
    if (i % 4 !== 1) completed.push("comment");

    return {
      id: `tg_action_${i}`,
      userId: `${100000 + i}`,
      username,
      avatarUrl: undefined,
      completedCriteria: completed,
      commentText: completed.includes("comment") ? commentTemplates[i % commentTemplates.length] : undefined,
      actedAt: new Date(Date.now() - i * 1000 * 60 * 11).toISOString(),
    };
  });
}

function qualifies(action: Omit<TelegramAction, "qualifies">, required: TelegramCriteriaType[]): boolean {
  if (required.length === 0) return true;
  return required.every((c) => action.completedCriteria.includes(c));
}

/** Заглушка получения метаданных поста канала (аналог getChat + getMessage). */
export async function fetchChannelPost(postUrl: string): Promise<{
  postId: string;
  channelUsername: string;
  mediaPreviewUrl: string;
  caption: string;
} | null> {
  const parsed = parseChannelPostUrl(postUrl);
  if (!parsed) return null;

  await new Promise((r) => setTimeout(r, 800));

  return {
    postId: parsed.messageId,
    channelUsername: parsed.channelUsername,
    mediaPreviewUrl: `https://picsum.photos/seed/tg-${parsed.messageId}/600/600`,
    caption: "Розыгрыш в нашем канале! Ставь реакцию, делай репост и пиши комментарий 🎁",
  };
}

/** Заглушка сбора реакций/репостов/комментариев к посту и фильтрации по критериям. */
export async function fetchChannelActions(
  requiredCriteria: TelegramCriteriaType[],
  total = 48
): Promise<TelegramAction[]> {
  await new Promise((r) => setTimeout(r, 750));

  return mockActionPool(total).map((a) => ({
    ...a,
    qualifies: qualifies(a, requiredCriteria),
  }));
}

export function summarizeActions(actions: TelegramAction[]) {
  const qualifiedActions = actions.filter((a) => a.qualifies);
  return { total: actions.length, qualified: qualifiedActions.length, qualifiedActions };
}

export function criteriaLabel(criteria: TelegramCriteriaType): string {
  return CRITERIA_LABELS[criteria];
}
