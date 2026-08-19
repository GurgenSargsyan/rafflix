import type { Giveaway, Participant } from "@/types";

/**
 * =========================================================================
 *  Supabase — сервисный слой (сейчас MOCK, контракт — реальный)
 * =========================================================================
 *  Подключение реального клиента:
 *
 *    import { createClient } from "@supabase/supabase-js";
 *    const supabase = createClient(
 *      process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *    );
 *
 *  Таблицы (минимальная схема):
 *    giveaways(id uuid pk, owner_id uuid, slug text unique, tier text,
 *              entry_source text, payload jsonb, status text, created_at, ...)
 *    participants(id uuid pk, giveaway_id uuid fk, source text,
 *                 payload jsonb, entry_number int, is_winner bool, created_at)
 *
 *  jsonb-колонка `payload` хранит остальные поля из типов Giveaway/Participant —
 *  это упрощает миграции на старте MVP; при росте — вынести в нормализованные
 *  колонки + RLS-политики по owner_id / giveaway_id.
 * ========================================================================= */

const NETWORK_DELAY = 900;

/** Сохранить (создать/обновить) розыгрыш. Аналог `supabase.from("giveaways").upsert(...)`. */
export async function saveGiveaway(giveaway: Giveaway): Promise<{ ok: true; id: string }> {
  await new Promise((r) => setTimeout(r, NETWORK_DELAY));
  console.info("[mock:supabase] saveGiveaway", giveaway.slug);
  return { ok: true, id: giveaway.id };
}

/** Получить розыгрыш по slug. Аналог `supabase.from("giveaways").select().eq("slug", slug).single()`. */
export async function fetchGiveawayBySlug(slug: string): Promise<Giveaway | null> {
  await new Promise((r) => setTimeout(r, 300));
  console.info("[mock:supabase] fetchGiveawayBySlug", slug);
  return null; // реальная логика подключается в lib/mock-giveaway.ts
}

/** Сохранить заявку участника. Аналог `supabase.from("participants").insert(...)`. */
export async function saveParticipant(participant: Participant): Promise<{ ok: true; id: string }> {
  await new Promise((r) => setTimeout(r, NETWORK_DELAY));
  console.info("[mock:supabase] saveParticipant", participant.giveawayId, participant.entryNumber);
  return { ok: true, id: participant.id };
}

/** Сохранить результат честного розыгрыша (для аудита/публичной верификации). */
export async function saveRandomizerResult(giveawayId: string, seed: string, hash: string) {
  await new Promise((r) => setTimeout(r, 400));
  console.info("[mock:supabase] saveRandomizerResult", giveawayId, { seed, hash });
  return { ok: true as const };
}
