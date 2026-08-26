/**
 * =========================================================================
 *  RAFFLIX — Модели данных (ШАГ 1)
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
 * Видимость розыгрыша:
 * - "private" — доступен только по прямой ссылке. Для своей аудитории:
 *   ссылку даёт сам организатор (в Instagram/Telegram/где угодно), розыгрыш
 *   не светится в общем каталоге. Значение по умолчанию.
 * - "public"  — дополнительно попадает в общий каталог `/giveaways`, где
 *   его может найти и открыть любой посетитель платформы.
 */
export type GiveawayVisibility = "private" | "public";

/**
 * Способ визуального проведения розыгрыша:
 * - "list"  — последовательный "барабан" (RandomizerReveal): имена
 *   пробегают строкой и останавливаются на победителе. Подходит для любого
 *   числа участников.
 * - "wheel" — Колесо Фортуны (SpinWheelReveal): те же честные механики
 *   Fair Randomizer (см. lib/randomizer.ts), но результат раскрывается
 *   вращением колеса с именами участников — по образцу it-som.net/spin-wheel.
 */
export type DrawStyle = "list" | "wheel";

/**
 * Источник участников розыгрыша:
 * - "form"               — классическая форма участия на сайте;
 * - "instagram_comments" — участники импортируются из комментариев под постом
 *   в Instagram;
 * - "telegram_channel"   — участники импортируются из реакций/репостов/
 *   комментариев к посту в Telegram-канале;
 * - "twitter_engagement" — участники импортируются из ретвитов/ответов на твит;
 * - "youtube_comments"   — участники импортируются из комментариев под видео;
 * - "facebook_engagement"— участники импортируются из комментариев/лайков
 *   под постом на странице Facebook;
 * - "multi_platform"     — несколько постов с разных площадок объединяются
 *   в один общий пул участников одного розыгрыша;
 * - "manual_list"        — организатор просто вписывает список вариантов
 *   руками (без импорта реальной аудитории) — самый быстрый способ для
 *   Колеса Фортуны: вариант в строке = сектор колеса, без регистрации.
 */
export type EntrySourceType =
  | "form"
  | "instagram_comments"
  | "telegram_channel"
  | "twitter_engagement"
  | "youtube_comments"
  | "facebook_engagement"
  | "multi_platform"
  | "manual_list";

/**
 * Критерий участия в Telegram-розыгрыше — что должен сделать подписчик
 * с постом в канале, чтобы попасть в пул участников.
 */
export type TelegramCriteriaType = "reaction" | "forward" | "comment";

/** Критерий участия в розыгрыше на X (Twitter): ретвит и/или ответ на твит. */
export type TwitterCriteriaType = "retweet" | "reply";

/** Критерий участия в розыгрыше на Facebook: комментарий и/или лайк/реакция. */
export type FacebookCriteriaType = "comment" | "like";

/** Соцсеть-источник одного поста внутри объединённого ("multi_platform") розыгрыша. */
export type MultiPlatformKind = "instagram" | "telegram" | "twitter" | "youtube" | "facebook";

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

  /**
   * Сколько "запасных" победителей резервировать сверх quantity — если
   * основной победитель не откликнется, приз переходит по очереди к
   * запасным (Winner.isBackup). Fair Randomizer резервирует их тем же
   * атомарным розыгрышем, без пересчёта.
   */
  backupCount?: number;
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

  /** Скрыть водяной знак "Powered by Rafflix". */
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
  /** @username канала без "@", например "rafflix_giveaways". */
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
 * TWITTER / X — источник участников из ретвитов и ответов
 * ---------------------------------------------------------------------- */

export interface TwitterSource {
  /** Публичная ссылка на твит: https://x.com/{author}/status/{id}. */
  postUrl: string;
  postId: string;
  authorUsername: string;
  mediaPreviewUrl?: string;
  caption?: string;

  /** Какие действия обязательны для участия (все выбранные — AND). */
  requiredCriteria: TwitterCriteriaType[];
  /** Ответ засчитывается только если содержит эту фразу/хэштег (аналог requireHashtag). */
  requireHashtag?: string;

  lastSyncedAt?: string;
  qualifiedCount?: number;
}

/** Один пользователь X, взаимодействовавший с твитом (ретвит и/или ответ). */
export interface TwitterEngagement {
  id: string;
  username: string;
  avatarUrl?: string;
  completedCriteria: TwitterCriteriaType[];
  replyText?: string;
  actedAt: string;
  qualifies: boolean;
}

/* -------------------------------------------------------------------------
 * YOUTUBE — источник участников из комментариев под видео
 * ---------------------------------------------------------------------- */

export interface YoutubeSource {
  /** Публичная ссылка на видео. */
  videoUrl: string;
  videoId: string;
  channelUsername: string;
  mediaPreviewUrl?: string;
  caption?: string;

  /** Комментарий засчитывается только если содержит эту фразу/хэштег. */
  requireKeyword?: string;
  minCommentLength?: number;

  lastSyncedAt?: string;
  qualifiedCount?: number;
}

/** Один комментарий под видео YouTube, прошедший фильтр условий. */
export interface YoutubeComment {
  id: string;
  username: string;
  avatarUrl?: string;
  text: string;
  likeCount: number;
  commentedAt: string;
  qualifies: boolean;
}

/* -------------------------------------------------------------------------
 * FACEBOOK — источник участников из комментариев/лайков под постом страницы
 * ---------------------------------------------------------------------- */

export interface FacebookSource {
  /** Публичная ссылка на пост страницы Facebook. */
  postUrl: string;
  postId: string;
  pageUsername: string;
  mediaPreviewUrl?: string;
  caption?: string;

  requiredCriteria: FacebookCriteriaType[];

  lastSyncedAt?: string;
  qualifiedCount?: number;
}

/** Один пользователь Facebook, взаимодействовавший с постом (комментарий и/или лайк). */
export interface FacebookEngagement {
  id: string;
  username: string;
  avatarUrl?: string;
  completedCriteria: FacebookCriteriaType[];
  commentText?: string;
  actedAt: string;
  qualifies: boolean;
}

/* -------------------------------------------------------------------------
 * MULTI-PLATFORM — объединение нескольких постов/площадок в один розыгрыш
 * ---------------------------------------------------------------------- */

/** Один "источник" внутри объединённого розыгрыша — конкретный пост на конкретной площадке. */
export interface MultiPlatformEntry {
  id: string;
  platform: MultiPlatformKind;
  postUrl: string;
  label?: string;
  qualifiedCount?: number;
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
  /**
   * true — это "запасной" победитель (placeInPrize выходит за пределы
   * prize.quantity, но входит в prize.quantity + prize.backupCount).
   * Приз переходит к нему по очереди, если основной победитель не откликнулся.
   */
  isBackup?: boolean;
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

  /** "private" (по умолчанию) — только по прямой ссылке; "public" — виден в /giveaways. */
  visibility: GiveawayVisibility;

  /** "list" (по умолчанию) — последовательный барабан; "wheel" — Колесо Фортуны. */
  drawStyle: DrawStyle;

  /** Как собираются участники: форма, комментарии в Instagram или Telegram-канал. */
  entrySource: EntrySourceType;
  /** Заполнено, если entrySource === "instagram_comments". */
  instagramSource?: InstagramSource;
  /** Заполнено, если entrySource === "telegram_channel". */
  telegramSource?: TelegramSource;
  /** Заполнено, если entrySource === "twitter_engagement". */
  twitterSource?: TwitterSource;
  /** Заполнено, если entrySource === "youtube_comments". */
  youtubeSource?: YoutubeSource;
  /** Заполнено, если entrySource === "facebook_engagement". */
  facebookSource?: FacebookSource;
  /** Заполнено, если entrySource === "multi_platform" — список объединённых постов. */
  multiPlatformSources?: MultiPlatformEntry[];
  /** Заполнено, если entrySource === "manual_list" — один вариант на строку. */
  manualEntries?: string[];

  /**
   * Имена/username, которых нужно исключить из розыгрыша (например, боты,
   * сотрудники бренда, дисквалифицированные участники). Сравнение без учёта
   * регистра и "@" в начале.
   */
  blacklist?: string[];
  /**
   * "Порог справедливого участия" — максимум заявок/комментариев, которые
   * засчитываются от ОДНОГО и того же участника. Остальные его заявки
   * отбрасываются до розыгрыша, чтобы один активный комментатор не занимал
   * весь пул. Не задано/0 — без ограничения.
   */
  maxEntriesPerUser?: number;

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

  /** Откуда пришёл участник: форма, действие в одной из соцсетей или ручной список. */
  source:
    | "form"
    | "instagram_comment"
    | "telegram_action"
    | "twitter_action"
    | "youtube_comment"
    | "facebook_action"
    | "manual_entry";

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

  /** Заполнено, если source === "twitter_action". */
  twitter?: {
    actionId: string;
    username: string;
    avatarUrl?: string;
    completedCriteria: TwitterCriteriaType[];
  };

  /** Заполнено, если source === "youtube_comment". */
  youtube?: {
    commentId: string;
    username: string;
    avatarUrl?: string;
    commentText: string;
  };

  /** Заполнено, если source === "facebook_action". */
  facebook?: {
    actionId: string;
    username: string;
    avatarUrl?: string;
    completedCriteria: FacebookCriteriaType[];
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
  visibility: GiveawayVisibility;
  drawStyle: DrawStyle;
  prizes: Prize[];
  entrySource: EntrySourceType;
  instagramSource?: InstagramSource;
  telegramSource?: TelegramSource;
  twitterSource?: TwitterSource;
  youtubeSource?: YoutubeSource;
  facebookSource?: FacebookSource;
  multiPlatformSources?: MultiPlatformEntry[];
  manualEntries?: string[];
  blacklist?: string[];
  maxEntriesPerUser?: number;
  entryConditions: EntryCondition[];
  tier: PlanTier;
  templateId?: string;
  branding?: GiveawayBranding;
  customFields: CustomField[];
  startDate: string;
  endDate: string;
}
