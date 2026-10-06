import { NextResponse } from "next/server";
import {
  PaymentNotConfiguredError,
  getPaymentProvider,
  priceOrder,
  type CheckoutPayload,
  type PaymentMethod,
} from "@/lib/payments";

export const dynamic = "force-dynamic";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function parsePayload(body: unknown): { ok: true; payload: CheckoutPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Requisição inválida." };
  const b = body as Record<string, any>;
  const customer = {
    name: str(b.customer?.name),
    email: str(b.customer?.email),
    phone: str(b.customer?.phone, 30).replace(/\D/g, ""),
    document: str(b.customer?.document, 20).replace(/\D/g, ""),
  };
  const shipping = {
    cep: str(b.shipping?.cep, 12).replace(/\D/g, ""),
    street: str(b.shipping?.street),
    number: str(b.shipping?.number, 20),
    complement: str(b.shipping?.complement),
    neighborhood: str(b.shipping?.neighborhood),
    city: str(b.shipping?.city),
    state: str(b.shipping?.state, 2).toUpperCase(),
  };
  const paymentMethod = b.paymentMethod as PaymentMethod;
  if (!customer.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return { ok: false, error: "Dados do cliente inválidos." };
  if (customer.document.length !== 11) return { ok: false, error: "CPF inválido." };
  if (shipping.cep.length !== 8 || !shipping.street || !shipping.number || !shipping.city || shipping.state.length !== 2)
    return { ok: false, error: "Endereço de entrega incompleto." };
  if (paymentMethod !== "pix" && paymentMethod !== "card") return { ok: false, error: "Forma de pagamento inválida." };
  return { ok: true, payload: { items: Array.isArray(b.items) ? b.items : [], customer, shipping, paymentMethod } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "JSON inválido." }, { status: 400 });
  }

  const parsed = parsePayload(body);
  if (!parsed.ok) return NextResponse.json({ status: "error", message: parsed.error }, { status: 400 });

  const priced = priceOrder(parsed.payload.items);
  if (!priced.ok) return NextResponse.json({ status: "error", message: priced.error }, { status: 422 });

  const provider = getPaymentProvider();
  if (!provider) {
    // Pedido validado, mas nenhum gateway conectado ainda.
    return NextResponse.json(
      { status: "not_configured", message: "O pagamento online ainda não está habilitado nesta loja.", total: priced.order.total },
      { status: 501 },
    );
  }

  try {
    const result = await provider.createPayment({
      order: priced.order,
      customer: parsed.payload.customer,
      shipping: parsed.payload.shipping,
      method: parsed.payload.paymentMethod,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PaymentNotConfiguredError) {
      return NextResponse.json({ status: "not_configured", message: err.message, total: priced.order.total }, { status: 501 });
    }
    console.error("[checkout] erro no provedor de pagamento", err);
    return NextResponse.json({ status: "error", message: "Não foi possível processar o pagamento." }, { status: 502 });
  }
}
