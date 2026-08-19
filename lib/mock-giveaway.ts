import type { Giveaway, GiveawayDraft } from "@/types";
import { FREE_TEMPLATES } from "@/lib/templates";

/**
 * Заглушка "бэкенда" (в будущем — Supabase, см. lib/services/supabase.ts).
 * Превращает черновик мастера (GiveawayDraft) в полноценный Giveaway,
 * который можно отрендерить на публичной странице.
 */
export function draftToGiveaway(draft: GiveawayDraft): Giveaway {
  const now = new Date().toISOString();
  return {
    id: "preview",
    ownerId: "demo-user",
    title: draft.title || "Розыгрыш без названия",
    description: draft.description,
    slug: "preview",
    status: "active",
    tier: draft.tier,
    entrySource: draft.entrySource,
    instagramSource: draft.instagramSource,
    telegramSource: draft.telegramSource,
    prizes: draft.prizes,
    entryConditions: draft.entryConditions,
    customFields: draft.customFields,
    templateId: draft.templateId,
    branding: draft.branding,
    startDate: draft.startDate,
    endDate: draft.endDate,
    timezone: "Europe/Moscow",
    participantsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/** Итоговые цвета/шрифт страницы — из Premium-брендинга либо из выбранного Free-шаблона. */
export function resolveGiveawayTheme(giveaway: Giveaway) {
  if (giveaway.tier === "premium" && giveaway.branding) {
    return {
      primary: giveaway.branding.primaryColor,
      secondary: giveaway.branding.secondaryColor,
      background: giveaway.branding.backgroundColor,
      fontFamily: giveaway.branding.fontFamily || "Inter",
      logoUrl: giveaway.branding.logoUrl,
      backgroundImageUrl: giveaway.branding.backgroundImageUrl,
      hideWatermark: giveaway.branding.hideWatermark,
    };
  }

  const template =
    FREE_TEMPLATES.find((t) => t.id === giveaway.templateId) ?? FREE_TEMPLATES[0];

  return {
    primary: template.colors.primary,
    secondary: template.colors.secondary,
    background: template.colors.background,
    fontFamily: "Inter",
    logoUrl: undefined,
    backgroundImageUrl: undefined,
    hideWatermark: false,
  };
}

/**
 * Демо-розыгрыш №1 — классическая форма участия на сайте (Premium-брендинг).
 */
export const DEMO_GIVEAWAY: Giveaway = {
  id: "demo-1",
  ownerId: "demo-user",
  title: "Розыгрыш iPhone 16 Pro 🎁",
  description:
    "В честь запуска Rafflix разыгрываем новый iPhone 16 Pro среди подписчиков нашего канала. Три простых шага — и ты в игре!",
  slug: "demo-iphone",
  status: "active",
  tier: "premium",
  entrySource: "form",
  prizes: [
    {
      id: "prize-iphone",
      type: "physical",
      title: "iPhone 16 Pro 256GB",
      description: "Титановый, цвет Desert",
      estimatedValue: 1199,
      currency: "USD",
      quantity: 1,
    },
    {
      id: "prize-airpods",
      type: "physical",
      title: "AirPods Pro 2",
      description: "2-е место — сумма скрыта, чтобы не отвлекать от главного приза",
      estimatedValue: 249,
      currency: "USD",
      quantity: 1,
      showValue: false,
    },
    {
      id: "prize-money",
      type: "money",
      title: "Денежный приз",
      description: "3-е место, перевод на карту победителя",
      estimatedValue: 50,
      currency: "USD",
      quantity: 2,
      // Для денежного приза сумма всегда обязательна и видна — showValue игнорируется.
    },
  ],
  entryConditions: [
    { id: "c1", type: "instagram_follow", label: "Подписаться в Instagram", url: "#", required: true },
    { id: "c2", type: "telegram_join", label: "Вступить в Telegram-канал", url: "#", required: true },
    { id: "c3", type: "repost_share", label: "Сделать репост в Stories", url: "#", required: false },
  ],
  customFields: [{ id: "f1", label: "Ваш Telegram username", fieldType: "text", required: true }],
  branding: {
    logoUrl: undefined,
    backgroundImageUrl: undefined,
    primaryColor: "#8b5cf6",
    secondaryColor: "#d946ef",
    backgroundColor: "#0a0a0f",
    fontFamily: "Inter",
    hideWatermark: false,
  },
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
  timezone: "Europe/Moscow",
  participantsCount: 1284,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Демо-розыгрыш №2 — участники импортируются из комментариев Instagram
 * (приоритетный сценарий: "разыграть среди тех, кто оставил комментарий").
 */
export const DEMO_GIVEAWAY_INSTAGRAM: Giveaway = {
  id: "demo-2",
  ownerId: "demo-user",
  title: "Розыгрыш кроссовок Nike Air Max 👟",
  description:
    "Разыгрываем пару кроссовок среди тех, кто оставит комментарий под этим постом с хэштегом #rafflix. Просто, честно, без формы регистрации.",
  slug: "demo-nike-comments",
  status: "active",
  tier: "free",
  entrySource: "instagram_comments",
  instagramSource: {
    postUrl: "https://instagram.com/p/DEMO_NIKE_POST/",
    postId: "media_DEMO_NIKE_POST",
    accountUsername: "your_brand",
    mediaPreviewUrl: "https://picsum.photos/seed/nike-giveaway/600/600",
    caption: "Розыгрыш кроссовок! Комментируй с #rafflix, чтобы участвовать 🎁",
    requireHashtag: "#rafflix",
    requireMention: false,
    minCommentLength: 3,
    lastSyncedAt: new Date().toISOString(),
    qualifiedCount: 27,
  },
  prizes: [
    {
      id: "prize-nike",
      type: "physical",
      title: "Nike Air Max 90",
      description: "Размер по выбору победителя",
      estimatedValue: 150,
      currency: "USD",
      quantity: 1,
    },
    {
      id: "prize-case",
      type: "physical",
      title: "Чехол Nike для телефона",
      description: "2-е место — утешительный приз",
      estimatedValue: 25,
      currency: "USD",
      quantity: 1,
    },
  ],
  entryConditions: [],
  customFields: [],
  templateId: FREE_TEMPLATES[1].id,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  timezone: "Europe/Moscow",
  participantsCount: 27,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Демо-розыгрыш №3 — участники импортируются из Telegram-канала: реакция
 * (лайк) + комментарий к посту, без формы регистрации.
 */
export const DEMO_GIVEAWAY_TELEGRAM: Giveaway = {
  id: "demo-3",
  ownerId: "demo-user",
  title: "Розыгрыш подписки Premium на год ⭐",
  description:
    "Разыгрываем годовую подписку Telegram Premium среди тех, кто поставит реакцию и напишет комментарий под постом в нашем канале.",
  slug: "demo-telegram-premium",
  status: "active",
  tier: "free",
  entrySource: "telegram_channel",
  telegramSource: {
    channelUsername: "rafflix_giveaways",
    postUrl: "https://t.me/rafflix_giveaways/482",
    postId: "482",
    mediaPreviewUrl: "https://picsum.photos/seed/tg-premium-giveaway/600/600",
    caption: "Розыгрыш Telegram Premium на год! Лайк + комментарий = участие 🎁",
    requiredCriteria: ["reaction", "comment"],
    requiredReactionEmoji: "🔥",
    lastSyncedAt: new Date().toISOString(),
    qualifiedCount: 19,
  },
  prizes: [
    {
      id: "prize-tg-premium",
      type: "digital",
      title: "Telegram Premium на 12 месяцев",
      description: "Активация промокодом на ваш аккаунт",
      estimatedValue: 60,
      currency: "USD",
      digitalDeliveryMethod: "promo_code",
      quantity: 1,
    },
  ],
  entryConditions: [],
  customFields: [],
  templateId: FREE_TEMPLATES[2].id,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  timezone: "Europe/Moscow",
  participantsCount: 19,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_GIVEAWAYS: Giveaway[] = [DEMO_GIVEAWAY, DEMO_GIVEAWAY_INSTAGRAM, DEMO_GIVEAWAY_TELEGRAM];

/** Заглушка асинхронного запроса к БД по slug'у (заменить на Supabase select). */
export async function getGiveawayBySlug(slug: string): Promise<Giveaway | null> {
  return DEMO_GIVEAWAYS.find((g) => g.slug === slug) ?? null;
}

/** Заглушка запроса по ID (для страниц дашборда). */
export async function getGiveawayById(id: string): Promise<Giveaway | null> {
  return DEMO_GIVEAWAYS.find((g) => g.id === id) ?? null;
}
