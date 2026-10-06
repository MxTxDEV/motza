import { catalog } from "@/lib/catalog";
import { MAX_QTY } from "@/lib/constants";
import type { CheckoutItemInput, PricedOrder } from "./types";

export type PricingResult = { ok: true; order: PricedOrder } | { ok: false; error: string };

/** Frete: calculado pelo gateway/transportadora na integração futura. */
const SHIPPING_CENTS = 0;

/** Reconstrói o pedido a partir do catálogo — nunca confia em preços vindos do cliente. */
export function priceOrder(items: CheckoutItemInput[]): PricingResult {
  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: "Sua sacola está vazia." };
  const priced = [];
  for (const item of items) {
    const product = catalog.byId(item.productId);
    if (!product) return { ok: false, error: "Um dos produtos não existe mais." };
    if (!product.sizes.includes(item.size) || product.soldOutSizes?.includes(item.size))
      return { ok: false, error: `${product.name}: tamanho ${item.size} indisponível.` };
    if (!product.colors.some((c) => c.name === item.color)) return { ok: false, error: `${product.name}: cor indisponível.` };
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QTY)
      return { ok: false, error: `${product.name}: quantidade inválida.` };
    priced.push({ ...item, name: product.name, unitPrice: product.price });
  }
  const subtotal = priced.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  return { ok: true, order: { items: priced, subtotal, shipping: SHIPPING_CENTS, total: subtotal + SHIPPING_CENTS, currency: "BRL" } };
}
