"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGiveawayStore, type WizardStep } from "@/store/useGiveawayStore";
import { StepIndicator } from "@/components/creator/StepIndicator";
import { PaymentModal } from "@/components/creator/PaymentModal";
import { Button } from "@/components/ui/Button";
import { StepBasics } from "@/components/creator/steps/StepBasics";
import { StepPrize } from "@/components/creator/steps/StepPrize";
import { StepSource } from "@/components/creator/steps/StepSource";
import { StepConditions } from "@/components/creator/steps/StepConditions";
import { StepPlan } from "@/components/creator/steps/StepPlan";
import { StepBranding } from "@/components/creator/steps/StepBranding";
import { StepReview } from "@/components/creator/steps/StepReview";
import { isPrizeValid } from "@/lib/prizes";

const STEP_COMPONENTS: Record<WizardStep, React.ComponentType> = {
  basics: StepBasics,
  prize: StepPrize,
  source: StepSource,
  conditions: StepConditions,
  plan: StepPlan,
  branding: StepBranding,
  review: StepReview,
};

/** Валидация возможности перехода "Далее" на каждом шаге. */
function canGoNext(step: WizardStep, draft: ReturnType<typeof useGiveawayStore.getState>["draft"]) {
  switch (step) {
    case "basics":
      return draft.title.trim().length >= 3 && draft.description.trim().length >= 10;
    case "prize":
      return draft.prizes.length > 0 && draft.prizes.every(isPrizeValid);
    case "source":
      if (draft.entrySource === "instagram_comments") return !!draft.instagramSource?.postUrl?.trim();
      if (draft.entrySource === "telegram_channel") {
        return (
          !!draft.telegramSource?.postUrl?.trim() &&
          (draft.telegramSource?.requiredCriteria?.length ?? 0) > 0
        );
      }
      return true;
    case "plan":
      return draft.tier === "free" ? !!draft.templateId : !!draft.branding;
    default:
      return true;
  }
}

export function GiveawayCreatorWizard() {
  const { draft, stepIndex, visibleSteps, goNext, goBack, goToStep } = useGiveawayStore();
  const steps = visibleSteps();
  const currentStep = steps[stepIndex];
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = stepIndex === steps.length - 1;
  const nextEnabled = canGoNext(currentStep, draft);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <StepIndicator steps={steps} currentIndex={stepIndex} onStepClick={goToStep} />
      </div>

      <div className="rounded-3xl glass border border-white/10 shadow-glass p-6 sm:p-9 min-h-[480px] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 size-72 bg-neon-violet/10 rounded-full blur-3xl pointer-events-none" />
        {/*
          Без mode="wait": новый шаг монтируется сразу же, не дожидаясь завершения
          exit-анимации предыдущего (та идёт параллельно, поверх). Так переключение
          шагов не подвисает, если анимация не докручивается (фоновая вкладка,
          reduced-motion, медленное устройство) — контент всегда синхронен с стейтом.
        */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24, position: "absolute" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="relative"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0}>
          <ArrowLeft className="size-4" /> Назад
        </Button>
        {!isLastStep && (
          <Button onClick={goNext} disabled={!nextEnabled}>
            Далее <ArrowRight className="size-4" />
          </Button>
        )}
      </div>

      <PaymentModal />
    </div>
  );
}
