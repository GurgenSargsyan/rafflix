import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  GiveawayDraft,
  EntryCondition,
  CustomField,
  PlanTier,
  GiveawayBranding,
  GiveawayVisibility,
  DrawStyle,
  EntrySourceType,
  InstagramSource,
  InstagramComment,
  TelegramSource,
  TelegramAction,
  TelegramCriteriaType,
  TwitterSource,
  TwitterEngagement,
  TwitterCriteriaType,
  YoutubeSource,
  YoutubeComment,
  FacebookSource,
  FacebookEngagement,
  FacebookCriteriaType,
  MultiPlatformEntry,
  MultiPlatformKind,
  Prize,
} from "@/types";
import { FREE_TEMPLATES } from "@/lib/templates";
import { fetchPostByUrl, fetchComments, summarizeComments } from "@/lib/services/instagram";
import { fetchChannelPost, fetchChannelActions, summarizeActions } from "@/lib/services/telegram";
import { fetchTweetByUrl, fetchTwitterEngagement, summarizeTwitterEngagement } from "@/lib/services/twitter";
import { fetchVideoByUrl, fetchYoutubeComments, summarizeYoutubeComments } from "@/lib/services/youtube";
import {
  fetchFacebookPostByUrl,
  fetchFacebookEngagement,
  summarizeFacebookEngagement,
} from "@/lib/services/facebook";
import { createEmptyPrize } from "@/lib/prizes";

/**
 * Шаги мастера создания розыгрыша.
 * - "branding" существует только для Premium;
 * - "conditions" скрывается, если участники импортируются из соцсетей —
 *   само действие с постом (комментарий/реакция/репост) и есть условие
 *   участия.
 */
export const WIZARD_STEPS = [
  "basics",
  "prize",
  "source",
  "conditions",
  "plan",
  "branding",
  "review",
] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

const DEFAULT_BRANDING: GiveawayBranding = {
  primaryColor: "#8b5cf6",
  secondaryColor: "#d946ef",
  backgroundColor: "#0a0a0f",
  fontFamily: "Inter",
  hideWatermark: true,
};

/** Источники, для которых участники импортируются из реальной аудитории (не форма/список). */
const AUDIENCE_SOURCES: EntrySourceType[] = [
  "instagram_comments",
  "telegram_channel",
  "twitter_engagement",
  "youtube_comments",
  "facebook_engagement",
  "multi_platform",
];

const INITIAL_DRAFT: GiveawayDraft = {
  title: "",
  description: "",
  visibility: "private",
  drawStyle: "list",
  prizes: [
    {
      id: "prize-1",
      type: "physical",
      title: "",
      description: "",
      quantity: 1,
    },
  ],
  entrySource: "form",
  instagramSource: undefined,
  telegramSource: undefined,
  twitterSource: undefined,
  youtubeSource: undefined,
  facebookSource: undefined,
  multiPlatformSources: undefined,
  manualEntries: undefined,
  blacklist: undefined,
  maxEntriesPerUser: undefined,
  entryConditions: [],
  tier: "free",
  templateId: FREE_TEMPLATES[0].id,
  branding: undefined,
  customFields: [],
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

interface GiveawayStoreState {
  draft: GiveawayDraft;
  stepIndex: number;
  isPaymentModalOpen: boolean;
  isPremiumUnlocked: boolean; // мок оплаты — становится true после "успешной оплаты"

  // Instagram: локальный превью-стейт синхронизации комментариев в мастере.
  instagramComments: InstagramComment[];
  isSyncingInstagram: boolean;
  instagramSyncError: string | null;

  // Telegram: аналогичный превью-стейт для реакций/репостов/комментариев.
  telegramActions: TelegramAction[];
  isSyncingTelegram: boolean;
  telegramSyncError: string | null;

  // X (Twitter): ретвиты/ответы.
  twitterEngagement: TwitterEngagement[];
  isSyncingTwitter: boolean;
  twitterSyncError: string | null;

  // YouTube: комментарии под видео.
  youtubeComments: YoutubeComment[];
  isSyncingYoutube: boolean;
  youtubeSyncError: string | null;

  // Facebook: комментарии/лайки под постом страницы.
  facebookEngagement: FacebookEngagement[];
  isSyncingFacebook: boolean;
  facebookSyncError: string | null;

  currentStep: () => WizardStep;
  visibleSteps: () => WizardStep[];

  goNext: () => void;
  goBack: () => void;
  goToStep: (step: WizardStep) => void;

  updateDraft: (patch: Partial<GiveawayDraft>) => void;
  setVisibility: (visibility: GiveawayVisibility) => void;
  setDrawStyle: (drawStyle: DrawStyle) => void;
  setTier: (tier: PlanTier) => void;
  selectTemplate: (templateId: string) => void;
  updateBranding: (patch: Partial<GiveawayBranding>) => void;

  addPrize: () => void;
  removePrize: (id: string) => void;
  updatePrize: (id: string, patch: Partial<Prize>) => void;
  movePrize: (id: string, direction: "up" | "down") => void;

  addCondition: (condition: Omit<EntryCondition, "id">) => void;
  removeCondition: (id: string) => void;

  addCustomField: (field: Omit<CustomField, "id">) => void;
  removeCustomField: (id: string) => void;

  setEntrySource: (source: EntrySourceType) => void;
  updateInstagramSource: (patch: Partial<InstagramSource>) => void;
  syncInstagramComments: () => Promise<void>;

  setManualEntries: (entries: string[]) => void;

  updateTelegramSource: (patch: Partial<TelegramSource>) => void;
  toggleTelegramCriterion: (criterion: TelegramCriteriaType) => void;
  syncTelegramActions: () => Promise<void>;

  updateTwitterSource: (patch: Partial<TwitterSource>) => void;
  toggleTwitterCriterion: (criterion: TwitterCriteriaType) => void;
  syncTwitterEngagement: () => Promise<void>;

  updateYoutubeSource: (patch: Partial<YoutubeSource>) => void;
  syncYoutubeComments: () => Promise<void>;

  updateFacebookSource: (patch: Partial<FacebookSource>) => void;
  toggleFacebookCriterion: (criterion: FacebookCriteriaType) => void;
  syncFacebookEngagement: () => Promise<void>;

  addMultiPlatformSource: (platform: MultiPlatformKind) => void;
  updateMultiPlatformSource: (id: string, patch: Partial<MultiPlatformEntry>) => void;
  removeMultiPlatformSource: (id: string) => void;

  setBlacklist: (blacklist: string[]) => void;
  setMaxEntriesPerUser: (max: number | undefined) => void;

  openPaymentModal: () => void;
  closePaymentModal: () => void;
  markPremiumUnlocked: () => void;

  reset: () => void;
}

export const useGiveawayStore = create<GiveawayStoreState>((set, get) => ({
  draft: INITIAL_DRAFT,
  stepIndex: 0,
  isPaymentModalOpen: false,
  isPremiumUnlocked: false,
  instagramComments: [],
  isSyncingInstagram: false,
  instagramSyncError: null,
  telegramActions: [],
  isSyncingTelegram: false,
  telegramSyncError: null,
  twitterEngagement: [],
  isSyncingTwitter: false,
  twitterSyncError: null,
  youtubeComments: [],
  isSyncingYoutube: false,
  youtubeSyncError: null,
  facebookEngagement: [],
  isSyncingFacebook: false,
  facebookSyncError: null,

  currentStep: () => get().visibleSteps()[get().stepIndex],

  visibleSteps: () => {
    const { tier, entrySource } = get().draft;
    return WIZARD_STEPS.filter((step) => {
      if (step === "branding" && tier !== "premium") return false;
      if (step === "conditions" && entrySource !== "form") return false;
      return true;
    });
  },

  goNext: () =>
    set((state) => {
      const steps = state.visibleSteps();
      return { stepIndex: Math.min(state.stepIndex + 1, steps.length - 1) };
    }),

  goBack: () =>
    set((state) => ({ stepIndex: Math.max(state.stepIndex - 1, 0) })),

  goToStep: (step) =>
    set((state) => {
      const idx = state.visibleSteps().indexOf(step);
      return idx >= 0 ? { stepIndex: idx } : {};
    }),

  updateDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),

  setVisibility: (visibility) =>
    set((state) => ({ draft: { ...state.draft, visibility } })),

  setDrawStyle: (drawStyle) =>
    set((state) => ({ draft: { ...state.draft, drawStyle } })),

  setTier: (tier) =>
    set((state) => ({
      draft: {
        ...state.draft,
        tier,
        branding: tier === "premium" ? state.draft.branding ?? DEFAULT_BRANDING : undefined,
        templateId: tier === "free" ? state.draft.templateId ?? FREE_TEMPLATES[0].id : undefined,
      },
    })),

  selectTemplate: (templateId) =>
    set((state) => ({ draft: { ...state.draft, templateId } })),

  updateBranding: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        branding: { ...(state.draft.branding ?? DEFAULT_BRANDING), ...patch },
      },
    })),

  addPrize: () =>
    set((state) => ({
      draft: { ...state.draft, prizes: [...state.draft.prizes, createEmptyPrize()] },
    })),

  removePrize: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        // Не даём удалить последний приз — розыгрыш должен разыгрывать хоть что-то.
        prizes:
          state.draft.prizes.length > 1
            ? state.draft.prizes.filter((p) => p.id !== id)
            : state.draft.prizes,
      },
    })),

  updatePrize: (id, patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        prizes: state.draft.prizes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      },
    })),

  movePrize: (id, direction) =>
    set((state) => {
      const prizes = [...state.draft.prizes];
      const index = prizes.findIndex((p) => p.id === id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || swapWith < 0 || swapWith >= prizes.length) return {};
      [prizes[index], prizes[swapWith]] = [prizes[swapWith], prizes[index]];
      return { draft: { ...state.draft, prizes } };
    }),

  addCondition: (condition) =>
    set((state) => ({
      draft: {
        ...state.draft,
        entryConditions: [
          ...state.draft.entryConditions,
          { ...condition, id: nanoid(8) },
        ],
      },
    })),

  removeCondition: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        entryConditions: state.draft.entryConditions.filter((c) => c.id !== id),
      },
    })),

  addCustomField: (field) =>
    set((state) => ({
      draft: {
        ...state.draft,
        customFields: [...state.draft.customFields, { ...field, id: nanoid(8) }],
      },
    })),

  removeCustomField: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        customFields: state.draft.customFields.filter((f) => f.id !== id),
      },
    })),

  setEntrySource: (source) =>
    set((state) => ({
      draft: {
        ...state.draft,
        entrySource: source,
        instagramSource:
          source === "instagram_comments"
            ? state.draft.instagramSource ?? {
                postUrl: "",
                postId: "",
                accountUsername: "",
                requireHashtag: "#rafflix",
                requireMention: false,
                minCommentLength: 2,
              }
            : state.draft.instagramSource,
        telegramSource:
          source === "telegram_channel"
            ? state.draft.telegramSource ?? {
                channelUsername: "",
                postUrl: "",
                postId: "",
                requiredCriteria: ["reaction", "comment"],
              }
            : state.draft.telegramSource,
        twitterSource:
          source === "twitter_engagement"
            ? state.draft.twitterSource ?? {
                postUrl: "",
                postId: "",
                authorUsername: "",
                requiredCriteria: ["retweet", "reply"],
              }
            : state.draft.twitterSource,
        youtubeSource:
          source === "youtube_comments"
            ? state.draft.youtubeSource ?? {
                videoUrl: "",
                videoId: "",
                channelUsername: "",
                minCommentLength: 2,
              }
            : state.draft.youtubeSource,
        facebookSource:
          source === "facebook_engagement"
            ? state.draft.facebookSource ?? {
                postUrl: "",
                postId: "",
                pageUsername: "",
                requiredCriteria: ["comment", "like"],
              }
            : state.draft.facebookSource,
        multiPlatformSources:
          source === "multi_platform" ? state.draft.multiPlatformSources ?? [] : state.draft.multiPlatformSources,
        manualEntries:
          source === "manual_list" ? state.draft.manualEntries ?? [] : state.draft.manualEntries,
        // Чёрный список / порог участия — только для источников с реальной аудиторией.
        blacklist: AUDIENCE_SOURCES.includes(source) ? state.draft.blacklist ?? [] : state.draft.blacklist,
      },
    })),

  setManualEntries: (entries) =>
    set((state) => ({ draft: { ...state.draft, manualEntries: entries } })),

  updateInstagramSource: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        instagramSource: state.draft.instagramSource
          ? { ...state.draft.instagramSource, ...patch }
          : (patch as InstagramSource),
      },
    })),

  syncInstagramComments: async () => {
    const { draft } = get();
    const postUrl = draft.instagramSource?.postUrl;
    if (!postUrl) return;

    set({ isSyncingInstagram: true, instagramSyncError: null });
    try {
      const post = await fetchPostByUrl(postUrl);
      if (!post) {
        set({
          isSyncingInstagram: false,
          instagramSyncError: "Не удалось распознать ссылку на пост Instagram",
        });
        return;
      }

      const rules = {
        requireHashtag: draft.instagramSource?.requireHashtag,
        requireMention: draft.instagramSource?.requireMention,
        minCommentLength: draft.instagramSource?.minCommentLength,
      };
      const comments = await fetchComments(rules);
      const { qualified } = summarizeComments(comments);

      set((state) => ({
        isSyncingInstagram: false,
        instagramComments: comments,
        draft: {
          ...state.draft,
          instagramSource: {
            ...(state.draft.instagramSource as InstagramSource),
            postId: post.postId,
            accountUsername: post.accountUsername,
            mediaPreviewUrl: post.mediaPreviewUrl,
            caption: post.caption,
            lastSyncedAt: new Date().toISOString(),
            qualifiedCount: qualified,
          },
        },
      }));
    } catch {
      set({ isSyncingInstagram: false, instagramSyncError: "Ошибка синхронизации с Instagram" });
    }
  },

  updateTelegramSource: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        telegramSource: state.draft.telegramSource
          ? { ...state.draft.telegramSource, ...patch }
          : (patch as TelegramSource),
      },
    })),

  toggleTelegramCriterion: (criterion) =>
    set((state) => {
      const current = state.draft.telegramSource?.requiredCriteria ?? [];
      const next = current.includes(criterion)
        ? current.filter((c) => c !== criterion)
        : [...current, criterion];
      return {
        draft: {
          ...state.draft,
          telegramSource: state.draft.telegramSource
            ? { ...state.draft.telegramSource, requiredCriteria: next }
            : ({ requiredCriteria: next } as TelegramSource),
        },
      };
    }),

  syncTelegramActions: async () => {
    const { draft } = get();
    const postUrl = draft.telegramSource?.postUrl;
    if (!postUrl) return;

    set({ isSyncingTelegram: true, telegramSyncError: null });
    try {
      const post = await fetchChannelPost(postUrl);
      if (!post) {
        set({
          isSyncingTelegram: false,
          telegramSyncError: "Не удалось распознать ссылку на пост Telegram (формат: t.me/канал/ID)",
        });
        return;
      }

      const required = draft.telegramSource?.requiredCriteria ?? [];
      const actions = await fetchChannelActions(required);
      const { qualified } = summarizeActions(actions);

      set((state) => ({
        isSyncingTelegram: false,
        telegramActions: actions,
        draft: {
          ...state.draft,
          telegramSource: {
            ...(state.draft.telegramSource as TelegramSource),
            postId: post.postId,
            channelUsername: post.channelUsername,
            mediaPreviewUrl: post.mediaPreviewUrl,
            caption: post.caption,
            lastSyncedAt: new Date().toISOString(),
            qualifiedCount: qualified,
          },
        },
      }));
    } catch {
      set({ isSyncingTelegram: false, telegramSyncError: "Ошибка синхронизации с Telegram" });
    }
  },

  updateTwitterSource: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        twitterSource: state.draft.twitterSource
          ? { ...state.draft.twitterSource, ...patch }
          : (patch as TwitterSource),
      },
    })),

  toggleTwitterCriterion: (criterion) =>
    set((state) => {
      const current = state.draft.twitterSource?.requiredCriteria ?? [];
      const next = current.includes(criterion) ? current.filter((c) => c !== criterion) : [...current, criterion];
      return {
        draft: {
          ...state.draft,
          twitterSource: state.draft.twitterSource
            ? { ...state.draft.twitterSource, requiredCriteria: next }
            : ({ requiredCriteria: next } as TwitterSource),
        },
      };
    }),

  syncTwitterEngagement: async () => {
    const { draft } = get();
    const postUrl = draft.twitterSource?.postUrl;
    if (!postUrl) return;

    set({ isSyncingTwitter: true, twitterSyncError: null });
    try {
      const post = await fetchTweetByUrl(postUrl);
      if (!post) {
        set({
          isSyncingTwitter: false,
          twitterSyncError: "Не удалось распознать ссылку на твит (формат: x.com/автор/status/ID)",
        });
        return;
      }

      const required = draft.twitterSource?.requiredCriteria ?? [];
      const actions = await fetchTwitterEngagement(required);
      const { qualified } = summarizeTwitterEngagement(actions);

      set((state) => ({
        isSyncingTwitter: false,
        twitterEngagement: actions,
        draft: {
          ...state.draft,
          twitterSource: {
            ...(state.draft.twitterSource as TwitterSource),
            postId: post.postId,
            authorUsername: post.authorUsername,
            mediaPreviewUrl: post.mediaPreviewUrl,
            caption: post.caption,
            lastSyncedAt: new Date().toISOString(),
            qualifiedCount: qualified,
          },
        },
      }));
    } catch {
      set({ isSyncingTwitter: false, twitterSyncError: "Ошибка синхронизации с X (Twitter)" });
    }
  },

  updateYoutubeSource: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        youtubeSource: state.draft.youtubeSource
          ? { ...state.draft.youtubeSource, ...patch }
          : (patch as YoutubeSource),
      },
    })),

  syncYoutubeComments: async () => {
    const { draft } = get();
    const videoUrl = draft.youtubeSource?.videoUrl;
    if (!videoUrl) return;

    set({ isSyncingYoutube: true, youtubeSyncError: null });
    try {
      const video = await fetchVideoByUrl(videoUrl);
      if (!video) {
        set({
          isSyncingYoutube: false,
          youtubeSyncError: "Не удалось распознать ссылку на видео YouTube",
        });
        return;
      }

      const rules = {
        requireKeyword: draft.youtubeSource?.requireKeyword,
        minCommentLength: draft.youtubeSource?.minCommentLength,
      };
      const comments = await fetchYoutubeComments(rules);
      const { qualified } = summarizeYoutubeComments(comments);

      set((state) => ({
        isSyncingYoutube: false,
        youtubeComments: comments,
        draft: {
          ...state.draft,
          youtubeSource: {
            ...(state.draft.youtubeSource as YoutubeSource),
            videoId: video.videoId,
            channelUsername: video.channelUsername,
            mediaPreviewUrl: video.mediaPreviewUrl,
            caption: video.caption,
            lastSyncedAt: new Date().toISOString(),
            qualifiedCount: qualified,
          },
        },
      }));
    } catch {
      set({ isSyncingYoutube: false, youtubeSyncError: "Ошибка синхронизации с YouTube" });
    }
  },

  updateFacebookSource: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        facebookSource: state.draft.facebookSource
          ? { ...state.draft.facebookSource, ...patch }
          : (patch as FacebookSource),
      },
    })),

  toggleFacebookCriterion: (criterion) =>
    set((state) => {
      const current = state.draft.facebookSource?.requiredCriteria ?? [];
      const next = current.includes(criterion) ? current.filter((c) => c !== criterion) : [...current, criterion];
      return {
        draft: {
          ...state.draft,
          facebookSource: state.draft.facebookSource
            ? { ...state.draft.facebookSource, requiredCriteria: next }
            : ({ requiredCriteria: next } as FacebookSource),
        },
      };
    }),

  syncFacebookEngagement: async () => {
    const { draft } = get();
    const postUrl = draft.facebookSource?.postUrl;
    if (!postUrl) return;

    set({ isSyncingFacebook: true, facebookSyncError: null });
    try {
      const post = await fetchFacebookPostByUrl(postUrl);
      if (!post) {
        set({
          isSyncingFacebook: false,
          facebookSyncError: "Не удалось распознать ссылку на пост Facebook",
        });
        return;
      }

      const required = draft.facebookSource?.requiredCriteria ?? [];
      const actions = await fetchFacebookEngagement(required);
      const { qualified } = summarizeFacebookEngagement(actions);

      set((state) => ({
        isSyncingFacebook: false,
        facebookEngagement: actions,
        draft: {
          ...state.draft,
          facebookSource: {
            ...(state.draft.facebookSource as FacebookSource),
            postId: post.postId,
            pageUsername: post.pageUsername,
            mediaPreviewUrl: post.mediaPreviewUrl,
            caption: post.caption,
            lastSyncedAt: new Date().toISOString(),
            qualifiedCount: qualified,
          },
        },
      }));
    } catch {
      set({ isSyncingFacebook: false, facebookSyncError: "Ошибка синхронизации с Facebook" });
    }
  },

  addMultiPlatformSource: (platform) =>
    set((state) => ({
      draft: {
        ...state.draft,
        multiPlatformSources: [
          ...(state.draft.multiPlatformSources ?? []),
          { id: nanoid(8), platform, postUrl: "" },
        ],
      },
    })),

  updateMultiPlatformSource: (id, patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        multiPlatformSources: (state.draft.multiPlatformSources ?? []).map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      },
    })),

  removeMultiPlatformSource: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        multiPlatformSources: (state.draft.multiPlatformSources ?? []).filter((s) => s.id !== id),
      },
    })),

  setBlacklist: (blacklist) => set((state) => ({ draft: { ...state.draft, blacklist } })),

  setMaxEntriesPerUser: (max) => set((state) => ({ draft: { ...state.draft, maxEntriesPerUser: max } })),

  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),
  markPremiumUnlocked: () =>
    set((state) => ({
      isPremiumUnlocked: true,
      isPaymentModalOpen: false,
      draft: {
        ...state.draft,
        branding: state.draft.branding ?? DEFAULT_BRANDING,
      },
    })),

  reset: () =>
    set({
      draft: INITIAL_DRAFT,
      stepIndex: 0,
      isPaymentModalOpen: false,
      instagramComments: [],
      isSyncingInstagram: false,
      instagramSyncError: null,
      telegramActions: [],
      isSyncingTelegram: false,
      telegramSyncError: null,
      twitterEngagement: [],
      isSyncingTwitter: false,
      twitterSyncError: null,
      youtubeComments: [],
      isSyncingYoutube: false,
      youtubeSyncError: null,
      facebookEngagement: [],
      isSyncingFacebook: false,
      facebookSyncError: null,
    }),
}));
