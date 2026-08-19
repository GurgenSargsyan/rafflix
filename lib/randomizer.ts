import type { Participant, Prize, RandomizerResult, Winner } from "@/types";

/**
 * =========================================================================
 *  Fair Randomizer — честный выбор победителя
 * =========================================================================
 *  Принцип прозрачности: сид генерируется криптографически стойким ГПСЧ
 *  (crypto.getRandomValues), публикуется вместе с результатом, а хэш
 *  SHA-256 от (seed + отсортированный список ID участников) позволяет
 *  любому наблюдателю пересчитать выбор и убедиться, что список участников
 *  не подменялся после розыгрыша.
 *
 *  Для юридически значимых розыгрышей сид можно брать из внешнего публичного
 *  источника случайности — например, drand-беacon (https://drand.love) —
 *  тогда организатор физически не может подобрать выгодный сид заранее
 *  (algorithm: "external_drand_beacon").
 * ========================================================================= */

/** Криптографически стойкий hex-сид. */
export function generateSeed(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Схлопывает произвольную строку в 32-битное целое (для инициализации PRNG). */
function stringToSeedInt(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

/** mulberry32 — быстрый, детерминированный, воспроизводимый по сиду ГПСЧ. */
function mulberry32(seedInt: number) {
  let a = seedInt;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates шаффл на детерминированном ГПСЧ. */
function seededShuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** SHA-256(seed + отсортированные ID участников) в hex — доказательство честности. */
export async function computeVerificationHash(seed: string, participantIds: string[]): Promise<string> {
  const payload = `${seed}:${[...participantIds].sort().join(",")}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Разбивает один общий перетасованный пул участников на непересекающиеся
 * "порции" — по порядку призов (prizes[0] получает первую порцию длиной
 * quantity, prizes[1] — следующую, и т.д.). Один и тот же участник не может
 * выиграть дважды. Порядок призов = порядок последовательного розыгрыша.
 */
function assignSequentially(shuffled: Participant[], prizes: Prize[]): Winner[] {
  const winners: Winner[] = [];
  let cursor = 0;

  for (const prize of prizes) {
    const quantity = Math.max(1, prize.quantity);
    const slice = shuffled.slice(cursor, cursor + quantity);
    slice.forEach((p, i) => {
      winners.push({
        participantId: p.id,
        prizeId: prize.id,
        placeInPrize: i,
        selectedAt: new Date().toISOString(),
      });
    });
    cursor += quantity;
  }

  return winners;
}

/**
 * Запускает честный розыгрыш среди участников и возвращает результат
 * (сид + хэш публикуются, чтобы участники могли проверить честность выбора).
 *
 * При нескольких призах выбор проводится ПОСЛЕДОВАТЕЛЬНО и без пересечений:
 * сначала один общий перетасованный по сиду список участников, затем от него
 * последовательно "отрезаются" порции под каждый приз в порядке prizes[] —
 * так первый приз (обычно главный) разыгрывается первым, и один участник
 * не может выиграть два приза одновременно.
 */
export async function runFairRandomizer(
  participants: Participant[],
  prizes: Prize[]
): Promise<RandomizerResult> {
  if (participants.length === 0) {
    throw new Error("Нет участников для розыгрыша");
  }
  if (prizes.length === 0) {
    throw new Error("Нет призов для розыгрыша");
  }

  const seed = generateSeed();
  const rng = mulberry32(stringToSeedInt(seed));
  const shuffled = seededShuffle(participants, rng);

  const verificationHash = await computeVerificationHash(seed, participants.map((p) => p.id));
  const winners = assignSequentially(shuffled, prizes);

  return {
    algorithm: "csprng_seeded",
    seed,
    verificationHash,
    winners,
    executedAt: new Date().toISOString(),
  };
}

/**
 * Пересчитывает выбор по опубликованным seed + списку участников/призов — так
 * любой может убедиться, что результат не был подменён постфактум.
 */
export async function verifyRandomizerResult(
  participants: Participant[],
  prizes: Prize[],
  result: RandomizerResult
): Promise<boolean> {
  const recomputedHash = await computeVerificationHash(result.seed, participants.map((p) => p.id));
  if (recomputedHash !== result.verificationHash) return false;

  const rng = mulberry32(stringToSeedInt(result.seed));
  const shuffled = seededShuffle(participants, rng);
  const expected = assignSequentially(shuffled, prizes);

  const normalize = (winners: Winner[]) =>
    JSON.stringify(
      [...winners]
        .sort((a, b) => a.prizeId.localeCompare(b.prizeId) || a.placeInPrize - b.placeInPrize)
        .map((w) => [w.prizeId, w.placeInPrize, w.participantId])
    );

  return normalize(expected) === normalize(result.winners);
}
