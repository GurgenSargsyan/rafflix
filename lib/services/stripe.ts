/**
 * =========================================================================
 *  Stripe — сервисный слой (сейчас MOCK, контракт — реальный)
 * =========================================================================
 *  Реальная интеграция:
 *
 *    // app/api/checkout/route.ts (Route Handler, серверная сторона)
 *    import Stripe from "stripe";
 *    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 *    const session = await stripe.checkout.sessions.create({
 *      mode: "payment",
 *      line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID!, quantity: 1 }],
 *      success_url: `${origin}/create?premium=success`,
 *      cancel_url: `${origin}/create?premium=cancelled`,
 *      metadata: { giveawayDraftId },
 *    });
 *    // клиент редиректит на session.url либо использует Stripe Elements
 *    // (как в PaymentModal.tsx) через clientSecret из PaymentIntent.
 *
 *  Подтверждение оплаты — через webhook `checkout.session.completed`
 *  (app/api/webhooks/stripe/route.ts), который помечает Giveaway.tier = "premium"
 *  в БД. Так фронтенд не может сам "притвориться" оплатившим.
 * ========================================================================= */

export interface CreateCheckoutResult {
  clientSecret: string;
  amount: number;
  currency: string;
}

const PREMIUM_PRICE_USD = 4.99;

/** Заглушка создания checkout-сессии/PaymentIntent на $4.99 за Premium-розыгрыш. */
export async function createPremiumCheckout(): Promise<CreateCheckoutResult> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    clientSecret: `mock_pi_${Math.random().toString(36).slice(2)}_secret`,
    amount: Math.round(PREMIUM_PRICE_USD * 100), // Stripe считает в центах
    currency: "usd",
  };
}

/** Заглушка подтверждения оплаты картой (заменяется на stripe.confirmPayment()). */
export async function confirmMockPayment(clientSecret: string): Promise<{ status: "succeeded" | "failed" }> {
  await new Promise((r) => setTimeout(r, 1600));
  return { status: "succeeded" };
}
