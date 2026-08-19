import { nanoid } from "nanoid";
import type { Prize } from "@/types";

/** Суммарное число победителей по всем призам розыгрыша. */
export function totalWinnerCount(prizes: Prize[]): number {
  return prizes.reduce((sum, p) => sum + Math.max(1, p.quantity), 0);
}

/** Новый пустой приз для добавления в список ("ещё одно место"). */
export function createEmptyPrize(): Prize {
  return {
    id: nanoid(8),
    type: "physical",
    title: "",
    description: "",
    quantity: 1,
    showValue: true,
  };
}

/** Человекочитаемое название места по индексу в массиве призов (0 -> "Главный приз"). */
export function placeLabel(index: number): string {
  if (index === 0) return "Главный приз";
  return `${index + 1}-е место`;
}

/** Для денежных призов сумма обязательна — она и есть приз. */
export function isValueRequired(prize: Prize): boolean {
  return prize.type === "money";
}

/**
 * Показывать ли сумму приза участникам. Для денежных призов — всегда true
 * (сумма и есть приз), для остальных — управляется Prize.showValue (по
 * умолчанию true, если явно не скрыли).
 */
export function resolveShowValue(prize: Prize): boolean {
  if (prize.type === "money") return true;
  return prize.showValue !== false;
}

/** Прошёл ли приз базовую валидацию для перехода дальше в мастере. */
export function isPrizeValid(prize: Prize): boolean {
  if (prize.title.trim().length < 2) return false;
  if (isValueRequired(prize) && !(prize.estimatedValue != null && prize.estimatedValue > 0)) {
    return false;
  }
  return true;
}
