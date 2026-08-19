import type { Participant } from "@/types";

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
