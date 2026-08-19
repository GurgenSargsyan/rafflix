/**
 * =========================================================================
 *  FREESPIN — Модели данных (ШАГ 1)
 * =========================================================================
 *  Здесь описаны основные TypeScript-интерфейсы платформы: User, Giveaway,
 *  Participant, а также вспомогательные типы (Prize, Branding, Condition,
 *  Winner и т.д.). Эти типы — единый источник правды для UI-компонентов,
 *  Zustand-стора и будущих заглушек Supabase / Stripe.
 * ========================================================================= */

/* -------------------------------------------------------------------------
 * Общие enum'ы и примитивы
 * ---------------------------------------------------------------------- */

/** Тариф пользователя / конкретного розыгрыша. */
export type PlanTier = "free" | "premium";

/** Жизненный цикл розыгрыша. */
export type GiveawayStatus = "draft" | "scheduled" | "active" | "completed" | "archived";

/**
 * Тип приза.
 * "money" — денежный приз (конкретная сумма — карта, перевод, наличные).
 * Для него сумма — это и есть приз, поэтому она обязательна и всегда видна
 * участникам (в отличие от physical/digital, где сумма — необязательная
 * "оценочная стоимость", которую можно скрыть).
 */
export type PrizeType = "physical" | "digital" | "money";

/** Способ выдачи цифрового приза (актуально только для PrizeType = "digital"). */
export type DigitalDeliveryMethod =
  | "promo_code"
  | "download_link"
  | "gift_card"
  | "crypto_nft"
  | "subscription_key"
  | "custom";

/** Типы условий участия в розыгрыше. */
export type EntryConditionType =
  | "email_subscribe"
  | "instagram_follow"
  | "telegram_join"
  | "youtube_subscribe"
  | "tiktok_follow"
  | "twitter_follow"
  | "repost_share"
  | "visit_link"
  | "custom_question";

/** Алгоритм выбора победителя (Fair Randomizer). */
export type RandomizerAlgorithm = "csprng_seeded" | "external_drand_beacon";

/**
 * Источник участников розыгрыша:
 * - "form"               — классическая форма участия на сайте;
 * - "instagram_comments" — участники импортируются из комментариев под постом
 *   в Instagram;
 * - "telegram_channel"   — участники импортируются из реакций/репостов/
 *   комментариев к посту в Telegram-канале.
 */
export type EntrySourceType = "form" | "instagram_comments" | "telegram_channel";

/**
 * Критерий участия в Telegram-розыгрыше — что должен сделать подписчик
 * с постом в канале, чтобы попасть в пул участников.
 */
export type TelegramCriteriaType = "reaction" | "forward" | "comment";

/* -------------------------------------------------------------------------
 * USER
 * ---------------------------------------------------------------------- */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;

  /** Текущий тарифный план аккаунта (влияет на дефолт при создании розыгрыша). */
  plan: PlanTier;

  /** Мок-поля для будущей интеграции со Stripe. */
  billing?: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    /** Действует ли премиум-подписка сейчас. */
    isActive: boolean;
    /** ISO-дата, до которой оплачен премиум. */
    currentPeriodEnd?: string;
  };

  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

/* -------------------------------------------------------------------------
 * PRIZE — приз розыгрыша
 * ---------------------------------------------------------------------- */

export interface Prize {
  id: string;
  type: PrizeType;
  title: string;
  description?: string;
  imageUrl?: string;

  /**
   * Стоимость приза. Для type === "money" — точная сумма приза (обязательна).
   * Для physical/digital — необязательная оценочная стоимость для карточки.
   */
  estimatedValue?: number;
  currency?: string; // "USD" | "RUB" | "EUR" ...

  /**
   * Показывать ли сумму участникам на публичной странице. По умолчанию true.
   * Для type === "money" игнорируется — сумма всегда видна (это и есть приз).
   */
  showValue?: boolean;

  /** Только для цифровых призов. */
  digitalDeliveryMethod?: DigitalDeliveryMethod;

  /** Сколько победителей получат именно этот приз. */
  quantity: number;
}

/* -------------------------------------------------------------------------
 * BRANDING — кастомизация внешнего вида (доступно только Premium)
 * ---------------------------------------------------------------------- */

export interface GiveawayBranding {
  logoUrl?: string;
  backgroundImageUrl?: string;

  /** HEX-коды. */
  primaryColor: string; // основной акцент / CTA
  secondaryColor: string; // вторичный градиентный акцент
  backgroundColor: string; // фон карточки/страницы

  /** Название Google Font (например "Poppins", "Space Grotesk"). */
  fontFamily?: string;

  /** Скрыть водяной знак "Powered by Freespin". */
  hideWatermark: boolean;

  /** Кастомный домен/поддомен (заглушка на будущее). */
  customDomain?: string;
}

/** Готовый бесплатный шаблон оформления. */
export interface FreeTemplate {
  id: string;
  name: string;
  previewImageUrl: string;
  /** Предустановленные цвета шаблона (не редактируются на Free-тарифе). */
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

/* -------------------------------------------------------------------------
 * ENTRY CONDITIONS — условия участия
 * ---------------------------------------------------------------------- */

export interface EntryCondition {
  id: string;
  type: EntryConditionType;
  label: string; // человекочитаемый текст, напр. "Подпишись на Instagram"
  url?: string; // ссылка на соц. сеть / пост для репоста
  required: boolean;
}

/** Кастомное поле формы участия (доступно на Premium). */
export interface CustomField {
  id: string;
  label: string;
  placeholder?: string;
  fieldType: "text" | "number" | "email" | "phone" | "select";
  required: boolean;
  options?: string[]; // для fieldType = "select"
}

/* -------------------------------------------------------------------------
 * INSTAGRAM — источник участников из комментариев
 * ---------------------------------------------------------------------- */

/**
 * Настройка привязки розыгрыша к посту в Instagram.
 * Реальные данные тянутся через Instagram Graph API (Business/Creator-аккаунт,
 * разрешения `instagram_basic` + `instagram_manage_comments`); здесь — контракт,
 * который заполняет lib/services/instagram.ts (сейчас — мок).
 */
export interface InstagramSource {
  /** Публичная ссылка на пост, под которым собираются комментарии. */
  postUrl: string;
  /** ID медиа в Instagram Graph API (media_id). */
  postId: string;
  /** ID и username бизнес-аккаунта, к которому привязан пост. */
  accountUsername: string;
  mediaPreviewUrl?: string;
  caption?: string;

  /** Комментарий засчитывается только если содержит эту фразу/хэштег. */
  requireHashtag?: string;
  /** Комментарий засчитывается только если упомянут (@username) друг. */
  requireMention?: boolean;
  /** Минимальная длина текста комментария, чтобы отсечь пустые "+1". */
  minCommentLength?: number;

  /** Когда последний раз синхронизировали комментарии (заглушка real-time вебхука). */
  lastSyncedAt?: string;
  /** Сколько комментариев прошло фильтр на момент последней синхронизации. */
  qualifiedCount?: number;
}

/** Один комментарий из Instagram, прошедший фильтр условий. */
export interface InstagramComment {
  id: string;
  username: string;
  avatarUrl?: string;
  text: string;
  likeCount: number;
  commentedAt: string;
  /** Прошёл ли фильтр requireHashtag/requireMention/minCommentLength. */
  qualifies: boolean;
}

/* -------------------------------------------------------------------------
 * TELEGRAM — источник участников из канала
 * ---------------------------------------------------------------------- */

/**
 * Настройка привязки розыгрыша к посту в Telegram-канале.
 *
 * Важная техническая оговорка (в отличие от Instagram, где один Graph API
 * закрывает все три критерия): в Telegram Bot API нативно доступны только
 * реакции на пост (обновление `message_reaction` для каналов, где бот —
 * админ). Репосты и комментарии Bot API "своими" не считает:
 *  - "comment"  — по факту это отдельное сообщение в привязанной группе
 *    обсуждений поста; бот-админ группы получает их как обычные апдейты
 *    и сопоставляет по `message_thread_id` / `reply_to_message`;
 *  - "forward"  — Bot API не уведомляет автора о репостах его поста. Нужен
 *    либо MTProto-клиент (напр. gramjs/telethon) с правами администратора
 *    канала, который читает `getMessagesViews`/статистику пересылок,
 *    либо (самый частый способ у реальных гивевей-ботов) — самопроверка:
 *    участник жмёт «Я выполнил(а) условия» после репоста, а бот делает
 *    выборочную проверку через MTProto.
 * lib/services/telegram.ts сейчас мокает результат всех трёх источников
 * одним и тем же контрактом, чтобы UI не менялся при переходе на реальные
 * интеграции.
 */
export interface TelegramSource {
  /** @username канала без "@", например "freespin_giveaways". */
  channelUsername: string;
  /** Публичная ссылка на пост: https://t.me/{channel}/{messageId}. */
  postUrl: string;
  /** ID сообщения в канале. */
  postId: string;
  mediaPreviewUrl?: string;
  caption?: string;

  /** Какие действия обязательны для участия (одно или несколько, все сразу — AND). */
  requiredCriteria: TelegramCriteriaType[];
  /** Если задано — засчитывается только конкретная реакция, напр. "🔥". Иначе любая. */
  requiredReactionEmoji?: string;

  lastSyncedAt?: string;
  qualifiedCount?: number;
}

/** Один подписчик, взаимодействовавший с постом в Telegram. */
export interface TelegramAction {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  /** Какие из критериев (reaction/forward/comment) участник выполнил. */
  completedCriteria: TelegramCriteriaType[];
  /** Текст комментария, если completedCriteria включает "comment". */
  commentText?: string;
  actedAt: string;
  /** Выполнены ли ВСЕ требуемые TelegramSource.requiredCriteria. */
  qualifies: boolean;
}

/* -------------------------------------------------------------------------
 * WINNER / RANDOMIZER — честный выбор победителя
 * ---------------------------------------------------------------------- */

export interface Winner {
  participantId: string;
  /** Ссылка на конкретный приз из Giveaway.prizes — какой именно приз выиграл. */
  prizeId: string;
  /** Порядковый номер внутри квоты этого приза (0, если приз даётся одному победителю). */
  placeInPrize: number;
  selectedAt: string; // ISO date
}

export interface RandomizerResult {
  algorithm: RandomizerAlgorithm;
  /** Сид, использованный для генерации — публикуется для верифицируемости. */
  seed: string;
  /** Хэш (например SHA-256) от seed + список участников — доказательство честности. */
  verificationHash: string;
  winners: Winner[];
  executedAt: string; // ISO date
}

/* -------------------------------------------------------------------------
 * GIVEAWAY — центральная сущность платформы
 * ---------------------------------------------------------------------- */

export interface Giveaway {
  id: string;
  ownerId: string; // User.id

  title: string;
  description: string;
  slug: string; // человекочитаемый URL: /g/[slug]

  status: GiveawayStatus;
  tier: PlanTier; // "free" | "premium" — выбранный тариф для ЭТОГО розыгрыша

  /** Как собираются участники: форма, комментарии в Instagram или Telegram-канал. */
  entrySource: EntrySourceType;
  /** Заполнено, если entrySource === "instagram_comments". */
  instagramSource?: InstagramSource;
  /** Заполнено, если entrySource === "telegram_channel". */
  telegramSource?: TelegramSource;

  /**
   * Призы розыгрыша, ПО ПОРЯДКУ РОЗЫГРЫША: индекс 0 — приз, который
   * разыгрывается первым (обычно главный), далее по убыванию. Fair Randomizer
   * проводит выбор последовательно по этому порядку, не пересекая победителей.
   */
  prizes: Prize[];
  entryConditions: EntryCondition[];
  customFields: CustomField[]; // непусто только при tier === "premium"

  /** Если tier === "free" — ссылается на один из готовых шаблонов. */
  templateId?: string;
  /** Если tier === "premium" — полная кастомизация брендинга. */
  branding?: GiveawayBranding;

  startDate: string; // ISO date — начало приёма заявок
  endDate: string; // ISO date — дедлайн / момент розыгрыша
  timezone: string; // напр. "Europe/Moscow"

  participantsCount: number;
  randomizerResult?: RandomizerResult;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------
 * PARTICIPANT — заявка на участие
 * ---------------------------------------------------------------------- */

export interface Participant {
  id: string;
  giveawayId: string; // Giveaway.id

  /** Откуда пришёл участник: форма, комментарий в IG или действие в Telegram. */
  source: "form" | "instagram_comment" | "telegram_action";

  name: string;
  email: string;
  socialHandle?: string;

  /** Заполнено, если source === "instagram_comment". */
  instagram?: {
    commentId: string;
    username: string;
    avatarUrl?: string;
    commentText: string;
  };

  /** Заполнено, если source === "telegram_action". */
  telegram?: {
    actionId: string;
    username: string;
    avatarUrl?: string;
    completedCriteria: TelegramCriteriaType[];
  };

  /** Значения кастомных полей: customFieldId -> value. */
  customAnswers: Record<string, string>;

  /** ID выполненных условий (EntryCondition.id). */
  completedConditionIds: string[];

  /** Порядковый номер заявки в рамках розыгрыша (для отображения "Ты #128"). */
  entryNumber: number;

  isWinner: boolean;

  /** Технические поля для защиты от накруток (не выводятся в UI). */
  ipHash?: string;
  userAgentHash?: string;

  createdAt: string;
}

/* -------------------------------------------------------------------------
 * Вспомогательные DTO для форм / шагов wizard'а
 * ---------------------------------------------------------------------- */

/** Данные, собираемые мастером создания розыгрыша по шагам. */
export interface GiveawayDraft {
  title: string;
  description: string;
  prizes: Prize[];
  entrySource: EntrySourceType;
  instagramSource?: InstagramSource;
  telegramSource?: TelegramSource;
  entryConditions: EntryCondition[];
  tier: PlanTier;
  templateId?: string;
  branding?: GiveawayBranding;
  customFields: CustomField[];
  startDate: string;
  endDate: string;
}
