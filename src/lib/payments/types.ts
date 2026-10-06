/**
 * Contratos da camada de pagamento.
 *
 * O frontend NUNCA fala direto com um gateway: ele envia o carrinho para
 * `POST /api/checkout`, que revalida preços no servidor (catálogo) e delega
 * ao `PaymentProvider` configurado. Para integrar Mercado Pago, Stripe, Pix ou
 * cartão basta implementar `createPayment` no provedor correspondente.
 */
import type { Size } from "@/data/types";

export type PaymentMethod = "pix" | "card";

export interface CheckoutItemInput {
  productId: string;
  size: Size;
  color: string;
  quantity: number;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  /** CPF (somente dígitos). */
  document: string;
}

export interface ShippingAddressInput {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CheckoutPayload {
  items: CheckoutItemInput[];
  customer: CustomerInput;
  shipping: ShippingAddressInput;
  paymentMethod: PaymentMethod;
}

export interface PricedItem extends CheckoutItemInput {
  name: string;
  /** centavos */
  unitPrice: number;
}

export interface PricedOrder {
  items: PricedItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: "BRL";
}

export interface PaymentRequest {
  order: PricedOrder;
  customer: CustomerInput;
  shipping: ShippingAddressInput;
  method: PaymentMethod;
}

export type PaymentResult =
  | { status: "redirect"; url: string }
  | { status: "pix"; qrCode: string; copyPaste: string; expiresAt: string }
  | { status: "approved" | "pending"; reference: string };

export interface PaymentProvider {
  id: string;
  label: string;
  methods: PaymentMethod[];
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
}

export class PaymentNotConfiguredError extends Error {
  constructor(provider: string) {
    super(`O provedor de pagamento "${provider}" ainda não foi configurado.`);
    this.name = "PaymentNotConfiguredError";
  }
}
