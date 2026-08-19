import { z } from "zod";

/**
 * Zod-схемы для валидации форм мастера создания розыгрыша.
 * Используются вместе с react-hook-form (zodResolver) на каждом шаге,
 * где есть реальный пользовательский ввод.
 */

/** Шаг 1 — основная информация. */
export const basicsSchema = z.object({
  title: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(80, "Максимум 80 символов"),
  description: z
    .string()
    .min(10, "Расскажите чуть подробнее (мин. 10 символов)")
    .max(500, "Максимум 500 символов"),
});
export type BasicsFormValues = z.infer<typeof basicsSchema>;

/** Шаг 2 — приз. */
export const prizeSchema = z.object({
  type: z.enum(["physical", "digital"]),
  title: z.string().min(2, "Укажите название приза").max(80),
  description: z.string().max(300).optional().default(""),
  estimatedValue: z
    .number({ invalid_type_error: "Введите число" })
    .min(0, "Не может быть отрицательным")
    .optional(),
  quantity: z
    .number({ invalid_type_error: "Введите число" })
    .min(1, "Минимум 1 победитель")
    .max(1000, "Слишком много"),
});
export type PrizeFormValues = z.infer<typeof prizeSchema>;

/** Шаг 5 (Premium) — брендинг. */
export const brandingSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Неверный HEX-формат"),
  secondaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Неверный HEX-формат"),
  backgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Неверный HEX-формат"),
  fontFamily: z.string().optional(),
  hideWatermark: z.boolean().default(true),
});
export type BrandingFormValues = z.infer<typeof brandingSchema>;

/** Форма участника на публичной странице розыгрыша (используется в ШАГЕ 3). */
export const participantSchema = z.object({
  name: z.string().min(2, "Введите имя").max(60),
  email: z.string().email("Введите корректный email"),
  socialHandle: z.string().max(60).optional(),
  agreeToRules: z.literal(true, {
    errorMap: () => ({ message: "Нужно согласиться с правилами" }),
  }),
});
export type ParticipantFormValues = z.infer<typeof participantSchema>;
