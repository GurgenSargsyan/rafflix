"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Lock, X, ShieldCheck, PartyPopper, Crown } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { createPremiumCheckout, confirmMockPayment } from "@/lib/services/stripe";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Заглушка (stub) экрана оплаты Premium-тарифа — вызовы идут через
 * lib/services/stripe.ts, где описан контракт реальной интеграции
 * (Checkout Session / PaymentIntent + webhook подтверждения).
 */
export function PaymentModal() {
  const { isPaymentModalOpen, closePaymentModal, markPremiumUnlocked, setTier } = useGiveawayStore();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");

    const { clientSecret } = await createPremiumCheckout();
    const { status } = await confirmMockPayment(clientSecret);

    if (status !== "succeeded") {
      setStep("form");
      return;
    }

    setStep("success");
    setTimeout(() => {
      markPremiumUnlocked();
      setTier("premium");
      setStep("form");
    }, 1200);
  };

  const handleClose = () => {
    if (step === "processing") return;
    closePaymentModal();
    setStep("form");
  };

  return (
    <AnimatePresence>
      {isPaymentModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl glass border border-white/10 shadow-glass p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 size-56 bg-neon-fuchsia/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 size-56 bg-neon-violet/20 rounded-full blur-3xl" />

            {step !== "processing" && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            )}

            <AnimatePresence mode="wait">
              {step === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="size-5 text-neon-fuchsia" />
                    <h3 className="text-xl font-semibold text-white">Freespin Premium</h3>
                  </div>
                  <p className="text-white/50 text-sm mb-6">
                    Разблокируйте кастомный брендинг для этого розыгрыша
                  </p>

                  <div className="rounded-2xl glass-light border border-white/10 p-4 mb-6 flex items-center justify-between">
                    <span className="text-sm text-white/70">Единоразовый платёж</span>
                    <span className="text-2xl font-bold text-gradient font-mono">$19</span>
                  </div>

                  <form onSubmit={handlePay} className="space-y-4">
                    <Input
                      label="Номер карты"
                      placeholder="4242 4242 4242 4242"
                      required
                      leftIcon={<CreditCard className="size-4" />}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Срок действия" placeholder="MM/YY" required />
                      <Input label="CVC" placeholder="123" required />
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                      <Lock className="size-4" />
                      Оплатить $19
                    </Button>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/35 pt-1">
                      <ShieldCheck className="size-3.5" />
                      Демо-режим — оплата не выполняется реально (заглушка Stripe)
                    </p>
                  </form>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-14 flex flex-col items-center gap-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="size-12 rounded-full border-2 border-white/10 border-t-neon-fuchsia"
                  />
                  <p className="text-white/60 text-sm">Обрабатываем платёж...</p>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-14 flex flex-col items-center gap-3 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="size-16 rounded-full bg-cta-gradient flex items-center justify-center shadow-glow"
                  >
                    <PartyPopper className="size-8 text-white" />
                  </motion.div>
                  <p className="text-white font-semibold text-lg">Premium активирован!</p>
                  <p className="text-white/50 text-sm">Открываем панель брендинга...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
