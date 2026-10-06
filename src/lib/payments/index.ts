import type { PaymentProvider } from "./types";
import { mercadoPago } from "./providers/mercadopago";
import { stripe } from "./providers/stripe";

const providers: Record<string, PaymentProvider> = {
  mercadopago: mercadoPago,
  stripe,
};

/** Escolhe o provedor via PAYMENT_PROVIDER ("mercadopago" | "stripe"). Sem valor → nenhum. */
export function getPaymentProvider(): PaymentProvider | null {
  const id = process.env.PAYMENT_PROVIDER;
  return id ? (providers[id] ?? null) : null;
}

export * from "./types";
export { priceOrder } from "./pricing";
