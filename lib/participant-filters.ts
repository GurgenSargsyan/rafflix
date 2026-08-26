import type { Giveaway, Participant } from "@/types";

/** "Публичный хэндл" участника для сравнений — username без "@", либо просто имя. */
function participantHandle(p: Participant): string {
  const handle =
    p.instagram?.username ??
    p.telegram?.username ??
    p.twitter?.username ??
    p.youtube?.username ??
    p.facebook?.username ??
    p.name;
  return handle.replace(/^@/, "").trim().toLowerCase();
}

/**
 * Убирает из пула участников, чьё имя/username есть в чёрном списке
 * розыгрыша (без учёта регистра и "@" в начале) — например ботов,
 * сотрудников бренда или уже дисквалифицированных участников.
 */
export function applyBlacklist(participants: Participant[], blacklist: string[] | undefined): Participant[] {
  if (!blacklist || blacklist.length === 0) return participants;
  const banned = new Set(
    blacklist
      .map((b) => b.replace(/^@/, "").trim().toLowerCase())
      .filter(Boolean)
  );
  if (banned.size === 0) return participants;
  return participants.filter((p) => !banned.has(participantHandle(p)));
}

/**
 * "Порог справедливого участия" — засчитывает не более `max` заявок от
 * одного и того же участника (по хэндлу); остальные его заявки отбрасываются
 * ДО розыгрыша, чтобы самый активный комментатор не занимал весь пул.
 */
export function applyFairParticipationThreshold(
  participants: Participant[],
  max: number | undefined
): Participant[] {
  if (!max || max <= 0) return participants;
  const seenCounts = new Map<string, number>();
  return participants.filter((p) => {
    const handle = participantHandle(p);
    const count = seenCounts.get(handle) ?? 0;
    if (count >= max) return false;
    seenCounts.set(handle, count + 1);
    return true;
  });
}

/** Применяет оба фильтра честности по порядку: сначала чёрный список, затем порог участия. */
export function applyFairnessFilters(
  participants: Participant[],
  giveaway: Pick<Giveaway, "blacklist" | "maxEntriesPerUser">
): Participant[] {
  return applyFairParticipationThreshold(
    applyBlacklist(participants, giveaway.blacklist),
    giveaway.maxEntriesPerUser
  );
}
