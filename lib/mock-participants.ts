import type { Giveaway, MultiPlatformEntry, Participant } from "@/types";
import { applyFairnessFilters } from "@/lib/participant-filters";

const NAMES = [
  "Анна Иванова", "Дмитрий Соколов", "Екатерина Смирнова", "Максим Кузнецов",
  "Олеся Попова", "Иван Волков", "Анастасия Лебедева", "Сергей Морозов",
  "Виктория Новикова", "Артём Козлов", "Лиза Фёдорова", "Роман Егоров",
  "Дарья Николаева", "Павел Орлов", "Юлия Захарова",
];

/** Мок-участники, оставившие заявку через форму на сайте. */
export function generateMockFormParticipants(giveawayId: string, count: number): Participant[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p_form_${giveawayId}_${i}`,
    giveawayId,
    source: "form",
    name: NAMES[i % NAMES.length],
    email: `user${i}@example.com`,
    socialHandle: undefined,
    customAnswers: {},
    completedConditionIds: [],
    entryNumber: i + 1,
    isWinner: false,
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60 * 25).toISOString(),
  }));
}

/** Мок-участники, импортированные из комментариев Instagram. */
export function generateMockInstagramParticipants(giveawayId: string, count: number): Participant[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p_ig_${giveawayId}_${i}`,
    giveawayId,
    source: "instagram_comment",
    name: `@ig_user_${i}`,
    email: "",
    instagram: {
      commentId: `ig_comment_${i}`,
      username: `ig_user_${i}`,
      avatarUrl: undefined,
      commentText: "Участвую! 🔥",
    },
    customAnswers: {},
    completedConditionIds: [],
    entryNumber: i + 1,
    isWinner: false,
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60 * 9).toISOString(),
  }));
}

/**
 * Не "мок" в строгом смысле — реальные варианты, вписанные организатором
 * руками (entrySource: "manual_list"). Никакого импорта аудитории: строка
 * из GiveawayDraft.manualEntries/Giveaway.manualEntries = один участник/сектор.
 */
export function manualEntriesToParticipants(giveawayId: string, entries: string[]): Participant[] {
  return entries.map((entry, i) => ({
    id: `p_manual_${giveawayId}_${i}`,
    giveawayId,
    source: "manual_entry",
    name: entry,
    email: "",
    customAnswers: {},
    completedConditionIds: [],
    entryNumber: i + 1,
    isWinner: false,
    createdAt: new Date().toISOString(),
  }));
}

/** Мок-участники, выполнившие условия (лайк/репост/комментарий) в Telegram-канале. */
export function generateMockTelegramParticipants(giveawayId: string, count: number): Participant[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p_tg_${giveawayId}_${i}`,
    giveawayId,
    source: "telegram_action",
    name: `@tg_user_${i}`,
    email: "",
    telegram: {
      actionId: `tg_action_${i}`,
      username: `tg_user_${i}`,
      avatarUrl: undefined,
      completedCriteria: ["reaction", "comment"],
    },
    customAnswers: {},
    completedConditionIds: [],
    entryNumber: i + 1,
    isWinner: false,
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60 * 7).toISOString(),
  }));
}

/** Мок-участники, импортированные из ретвитов/ответов на твит (X). */
export function generateMockTwitterParticipants(giveawayId: string, count: number): Participant[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p_tw_${giveawayId}_${i}`,
    giveawayId,
    source: "twitter_action",
    name: `@tw_user_${i}`,
    email: "",
    twitter: {
      actionId: `tw_action_${i}`,
      username: `tw_user_${i}`,
      avatarUrl: undefined,
      completedCriteria: ["retweet", "reply"],
    },
    customAnswers: {},
    completedConditionIds: [],
    entryNumber: i + 1,
    isWinner: false,
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60 * 8).toISOString(),
  }));
}

/** Мок-участники, импортированные из комментариев под видео YouTube. */
export function generateMockYoutubeParticipants(giveawayId: string, count: number): Participant[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p_yt_${giveawayId}_${i}`,
    giveawayId,
    source: "youtube_comment",
    name: `@yt_user_${i}`,
    email: "",
    youtube: {
      commentId: `yt_comment_${i}`,
      username: `yt_user_${i}`,
      avatarUrl: undefined,
      commentText: "Участвую! 🎉",
    },
    customAnswers: {},
    completedConditionIds: [],
    entryNumber: i + 1,
    isWinner: false,
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60 * 10).toISOString(),
  }));
}

/** Мок-участники, импортированные из комментариев/лайков под постом Facebook. */
export function generateMockFacebookParticipants(giveawayId: string, count: number): Participant[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p_fb_${giveawayId}_${i}`,
    giveawayId,
    source: "facebook_action",
    name: `FB User ${i}`,
    email: "",
    facebook: {
      actionId: `fb_action_${i}`,
      username: `fb_user_${i}`,
      avatarUrl: undefined,
      completedCriteria: ["comment", "like"],
    },
    customAnswers: {},
    completedConditionIds: [],
    entryNumber: i + 1,
    isWinner: false,
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60 * 12).toISOString(),
  }));
}

const DEFAULT_MULTI_PLATFORM_COUNT = 12;

/**
 * Объединяет несколько источников (разные посты/площадки, entrySource:
 * "multi_platform") в один общий пул участников. Каждый источник даёт
 * mock-участников через "свой" генератор — namespace по source.id, чтобы
 * id не пересекались между источниками при объединении.
 */
export function generateMockMultiPlatformParticipants(
  giveawayId: string,
  sources: MultiPlatformEntry[]
): Participant[] {
  return sources.flatMap((source) => {
    const count = source.qualifiedCount ?? DEFAULT_MULTI_PLATFORM_COUNT;
    const namespace = `${giveawayId}_${source.id}`;
    switch (source.platform) {
      case "instagram":
        return generateMockInstagramParticipants(namespace, count);
      case "telegram":
        return generateMockTelegramParticipants(namespace, count);
      case "twitter":
        return generateMockTwitterParticipants(namespace, count);
      case "youtube":
        return generateMockYoutubeParticipants(namespace, count);
      case "facebook":
        return generateMockFacebookParticipants(namespace, count);
      default:
        return [];
    }
  });
}

/**
 * Единая точка сборки участников розыгрыша по giveaway.entrySource — плюс
 * фильтры честности (чёрный список, порог участия). Используется и в
 * дашборде организатора, и на публичной странице результатов, чтобы участники
 * и победители всегда совпадали между этими двумя местами.
 */
export function buildParticipants(giveaway: Giveaway): Participant[] {
  const raw = (() => {
    switch (giveaway.entrySource) {
      case "instagram_comments":
        return generateMockInstagramParticipants(giveaway.id, giveaway.participantsCount);
      case "telegram_channel":
        return generateMockTelegramParticipants(giveaway.id, giveaway.participantsCount);
      case "twitter_engagement":
        return generateMockTwitterParticipants(giveaway.id, giveaway.participantsCount);
      case "youtube_comments":
        return generateMockYoutubeParticipants(giveaway.id, giveaway.participantsCount);
      case "facebook_engagement":
        return generateMockFacebookParticipants(giveaway.id, giveaway.participantsCount);
      case "multi_platform":
        return generateMockMultiPlatformParticipants(giveaway.id, giveaway.multiPlatformSources ?? []);
      case "manual_list":
        return manualEntriesToParticipants(giveaway.id, giveaway.manualEntries ?? []);
      default:
        return generateMockFormParticipants(giveaway.id, giveaway.participantsCount);
    }
  })();

  return applyFairnessFilters(raw, giveaway);
}
