import type { FreeTemplate } from "@/types";

/**
 * Готовые бесплатные шаблоны оформления (Free-тариф).
 * Пользователь может выбрать один из них, но не может менять цвета/лого —
 * это разблокируется только на Premium (см. GiveawayBranding).
 */
export const FREE_TEMPLATES: FreeTemplate[] = [
  {
    id: "template-nebula",
    name: "Nebula",
    previewImageUrl: "/templates/nebula.jpg",
    colors: { primary: "#8b5cf6", secondary: "#d946ef", background: "#0a0a0f" },
  },
  {
    id: "template-aurora",
    name: "Aurora",
    previewImageUrl: "/templates/aurora.jpg",
    colors: { primary: "#22d3ee", secondary: "#8b5cf6", background: "#08131a" },
  },
  {
    id: "template-ember",
    name: "Ember",
    previewImageUrl: "/templates/ember.jpg",
    colors: { primary: "#ec4899", secondary: "#f97316", background: "#140a0a" },
  },
  {
    id: "template-mono",
    name: "Mono",
    previewImageUrl: "/templates/mono.jpg",
    colors: { primary: "#a3e635", secondary: "#22d3ee", background: "#0b0b0b" },
  },
];
