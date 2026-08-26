/**
 * Генератор подписей для розыгрышей — честная шаблонная сборка текста из
 * того, что ввёл пользователь (бренд, призы, правила, срок, тон). Никакого
 * "ИИ"-вызова и никакого обращения к реальным чужим аккаунтам — по образцу
 * generator-podpisey у конкурента, но без выдуманного backend'а: то, что
 * видно в коде, то и есть вся логика генерации.
 */

export type CaptionPlatform = "instagram" | "twitter" | "tiktok" | "facebook" | "youtube";
export type CaptionTone = "fun" | "professional" | "friendly" | "excited" | "minimal" | "emoji";

export interface CaptionPrize {
  name: string;
  winners: number;
}

export interface CaptionRules {
  mustFollow: boolean;
  followAccounts: string[];
  mustLike: boolean;
  mustTagFriends: boolean;
  tagCount: number;
}

export interface CaptionInput {
  platform: CaptionPlatform;
  brand: string;
  prizes: CaptionPrize[];
  rules: CaptionRules;
  deadlineLabel: string; // уже отформатированная дата/фраза, напр. "1 октября"
  tone: CaptionTone;
}

export const TONE_OPTIONS: { value: CaptionTone; label: string }[] = [
  { value: "fun", label: "Весело и игриво" },
  { value: "professional", label: "Профессиональный" },
  { value: "friendly", label: "Дружелюбный" },
  { value: "excited", label: "Восторженный и энергичный" },
  { value: "minimal", label: "Кратко и по делу" },
  { value: "emoji", label: "Много эмодзи" },
];

export const PLATFORM_OPTIONS: { value: CaptionPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
];

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function formatPrizeList(prizes: CaptionPrize[]): string {
  return prizes
    .filter((p) => p.name.trim())
    .map((p) => (p.winners > 1 ? `${p.name.trim()} (×${p.winners})` : p.name.trim()))
    .join(", ");
}

function ruleLines(rules: CaptionRules, tone: CaptionTone): string[] {
  const check = tone === "minimal" ? "—" : tone === "professional" ? "•" : "✅";
  const lines: string[] = [];

  if (rules.mustFollow) {
    const accounts = rules.followAccounts.filter(Boolean).map((a) => `@${a.replace(/^@/, "")}`);
    lines.push(
      accounts.length
        ? `${check} Подпишись на ${accounts.join(", ")}`
        : `${check} Подпишись на наш аккаунт`
    );
  }
  if (rules.mustLike) {
    lines.push(`${check} Поставь лайк этому посту`);
  }
  if (rules.mustTagFriends) {
    // "друга" для одного, "друзей" для остальных — стандартная разговорная
    // форма в подписях к розыгрышам (не строгая числительная грамматика).
    const word = rules.tagCount === 1 ? "друга" : "друзей";
    lines.push(`${check} Отметь ${rules.tagCount} ${word} в комментариях`);
  }

  return lines;
}

function hashtags(brand: string, platform: CaptionPlatform): string {
  const brandTag = brand
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "");
  const base = ["#розыгрыш", "#giveaway", "#конкурс"];
  if (brandTag) base.unshift(`#${brandTag}`);
  if (platform === "tiktok") base.push("#giveawaytiktok");
  return base.join(" ");
}

/**
 * seed — не про "случайность результата розыгрыша" (для этого есть
 * Fair Randomizer), а просто чтобы повторный клик "Сгенерировать" по тем
 * же данным показывал другую формулировку из банка фраз для выбранного тона.
 */
export function generateCaption(input: CaptionInput, seed = 0): string {
  // Пустое название бренда — не превращаем в "от МЫ"/"от НАС": у каждого тона
  // отдельный, грамматически нормальный вариант фразы без бренда вообще.
  const brand = input.brand.trim();
  const prizeList = formatPrizeList(input.prizes) || "крутой приз";
  const rules = ruleLines(input.rules, input.tone);
  const tags = hashtags(input.brand, input.platform);

  const OPENERS: Record<CaptionTone, (b: string) => string[]> = {
    fun: (b) =>
      b
        ? [`🎉 ВНИМАНИЕ, РОЗЫГРЫШ ОТ ${b.toUpperCase()}!`, `Кто хочет приз? Тогда это для тебя 👇`, `Барабанная дробь... у нас розыгрыш! 🥁`]
        : [`🎉 ВНИМАНИЕ, РОЗЫГРЫШ!`, `Кто хочет приз? Тогда это для тебя 👇`, `Барабанная дробь... у нас розыгрыш! 🥁`],
    professional: (b) => (b ? [`${b} объявляет о розыгрыше.`, `Розыгрыш от ${b}.`] : [`Объявляем розыгрыш.`, `У нас стартует розыгрыш.`]),
    friendly: (b) =>
      b
        ? [`Привет! У нас для вас кое-что приятное 💛`, `Друзья, у ${b} новый розыгрыш!`]
        : [`Привет! У нас для вас кое-что приятное 💛`, `Друзья, у нас новый розыгрыш!`],
    excited: (b) =>
      b
        ? [`🔥 ЭТО НЕ ШУТКА — ${b.toUpperCase()} ЗАПУСКАЕТ РОЗЫГРЫШ!`, `ВАУ! Такого приза вы не ждали 😱`]
        : [`🔥 ЭТО НЕ ШУТКА — У НАС РОЗЫГРЫШ!`, `ВАУ! Такого приза вы не ждали 😱`],
    minimal: (b) => (b ? [`${b}: розыгрыш.`, `Розыгрыш от ${b}.`] : [`Розыгрыш.`]),
    emoji: (b) =>
      b
        ? [`🎁✨ РОЗЫГРЫШ ОТ ${b.toUpperCase()} ✨🎁`, `🚨 ВНИМАНИЕ 🚨 подарки от ${b} 🎉🎉`]
        : [`🎁✨ РОЗЫГРЫШ ✨🎁`, `🚨 ВНИМАНИЕ 🚨 подарки для вас 🎉🎉`],
  };

  const PRIZE_LINES: Record<CaptionTone, (list: string) => string> = {
    fun: (list) => `Разыгрываем: ${list} 🏆`,
    professional: (list) => `Приз: ${list}.`,
    friendly: (list) => `На кону: ${list} 🎁`,
    excited: (list) => `ГЛАВНЫЙ ПРИЗ: ${list}!!! 🤩`,
    minimal: (list) => `Приз: ${list}.`,
    emoji: (list) => `🏆 Приз: ${list} 🏆`,
  };

  const CLOSINGS: Record<CaptionTone, string[]> = {
    fun: ["Удачи, а победителя выберет честный алгоритм! 🍀", "Погнали! 🚀"],
    professional: ["Победитель определяется случайным образом и объявляется публично.", "Удачи всем участникам."],
    friendly: ["Очень хочется, чтобы выиграли именно вы 💛", "Спасибо, что вы с нами!"],
    excited: ["ПОЕХАЛИ! 🚀🚀🚀", "Не пропустите свой шанс!!!"],
    minimal: ["Итоги — после окончания приёма заявок.", "Участвуйте."],
    emoji: ["🍀 Удачи! 🍀", "🙏✨ Пусть повезёт именно тебе ✨🙏"],
  };

  const deadlineLine =
    input.tone === "minimal"
      ? `Приём заявок до ${input.deadlineLabel}.`
      : input.tone === "professional"
        ? `Приём заявок открыт до ${input.deadlineLabel}.`
        : `⏰ Итоги подведём ${input.deadlineLabel}`;

  const lines = [
    pick(OPENERS[input.tone](brand), seed),
    "",
    PRIZE_LINES[input.tone](prizeList),
    ...(rules.length ? ["", "Условия участия:", ...rules] : []),
    "",
    deadlineLine,
    "",
    pick(CLOSINGS[input.tone], seed + 1),
    "",
    tags,
  ];

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
