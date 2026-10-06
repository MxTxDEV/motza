import { PaymentNotConfiguredError, type PaymentProvider } from "../types";

/**
 * Mercado Pago (Pix + cartão).
 * TODO: instalar o SDK `mercadopago`, ler MERCADOPAGO_ACCESS_TOKEN e criar a
 * preferência/pagamento a partir de `request.order`.
 */
export const mercadoPago: PaymentProvider = {
  id: "mercadopago",
  label: "Mercado Pago",
  methods: ["pix", "card"],
  async createPayment() {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) throw new PaymentNotConfiguredError("mercadopago");
    throw new Error("Integração Mercado Pago ainda não implementada.");
  },
};
