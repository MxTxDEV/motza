import { PaymentNotConfiguredError, type PaymentProvider } from "../types";

/**
 * Stripe (cartão + Pix).
 * TODO: instalar `stripe`, ler STRIPE_SECRET_KEY e criar uma Checkout Session
 * a partir de `request.order`, retornando `{ status: "redirect", url }`.
 */
export const stripe: PaymentProvider = {
  id: "stripe",
  label: "Stripe",
  methods: ["pix", "card"],
  async createPayment() {
    if (!process.env.STRIPE_SECRET_KEY) throw new PaymentNotConfiguredError("stripe");
    throw new Error("Integração Stripe ainda não implementada.");
  },
};
