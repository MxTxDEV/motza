"use client";

import { useState } from "react";
import { Banknote, CreditCard, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { CheckoutPayload, PaymentMethod } from "@/lib/payments/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { CartItem } from "@/components/cart/CartItem";

type Errors = Record<string, string>;
type Outcome =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "not_configured"; message: string; total: number };

const maskCep = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
const maskCpf = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11).replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2");
const maskPhone = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");

function validate(f: FormData): Errors {
  const e: Errors = {};
  const v = (k: string) => String(f.get(k) ?? "").trim();
  const digits = (k: string) => v(k).replace(/\D/g, "");
  if (!v("name")) e.name = "Informe seu nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) e.email = "Informe um e-mail válido.";
  if (digits("phone").length < 10) e.phone = "Informe um telefone com DDD.";
  if (digits("document").length !== 11) e.document = "Informe um CPF com 11 dígitos.";
  if (digits("cep").length !== 8) e.cep = "CEP deve ter 8 dígitos.";
  if (!v("street")) e.street = "Informe a rua.";
  if (!v("number")) e.number = "Informe o número.";
  if (!v("neighborhood")) e.neighborhood = "Informe o bairro.";
  if (!v("city")) e.city = "Informe a cidade.";
  if (!/^[A-Za-z]{2}$/.test(v("state"))) e.state = "UF com 2 letras.";
  return e;
}

export function CheckoutView() {
  const { lines, subtotal, count } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>({ kind: "idle" });

  if (count === 0) {
    return (
      <div className="flex flex-col items-start gap-6 py-10">
        <h1 className="t-display text-paper">Sacola vazia</h1>
        <p className="max-w-[44ch] text-bone/75">Adicione peças do DROP 01 para finalizar seu pedido.</p>
        <Button href="/shop" variant="solid" size="lg" arrow>Ir para o shop</Button>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const payload: CheckoutPayload = {
      items: lines.map((l) => ({ productId: l.productId, size: l.size, color: l.color, quantity: l.quantity })),
      customer: { name: get("name"), email: get("email"), phone: get("phone"), document: get("document") },
      shipping: {
        cep: get("cep"),
        street: get("street"),
        number: get("number"),
        complement: get("complement"),
        neighborhood: get("neighborhood"),
        city: get("city"),
        state: get("state"),
      },
      paymentMethod: method,
    };
    setLoading(true);
    setOutcome({ kind: "idle" });
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.status === "redirect" && typeof json.url === "string") {
        window.location.assign(json.url);
        return;
      }
      if (json.status === "not_configured") setOutcome({ kind: "not_configured", message: json.message, total: json.total });
      else if (json.status === "error") setOutcome({ kind: "error", message: json.message });
      else setOutcome({ kind: "error", message: "Resposta inesperada do servidor." });
    } catch {
      setOutcome({ kind: "error", message: "Sem conexão. Tente novamente em instantes." });
    } finally {
      setLoading(false);
    }
  };

  const methodCls = (active: boolean) =>
    cn("flex min-h-16 cursor-pointer items-center gap-4 border px-5 transition-colors", active ? "border-bone bg-bone/5" : "border-bone/25 hover:border-bone/60");

  return (
    <div>
      <h1 className="t-display mb-12 text-paper">Finalizar pedido</h1>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_420px] xl:gap-24">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-12">
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="font-display mb-6 text-2xl uppercase text-paper">01 — Contato</legend>
            <Field label="Nome completo" name="name" autoComplete="name" required error={errors.name} className="sm:col-span-2" />
            <Field label="E-mail" name="email" type="email" autoComplete="email" required error={errors.email} />
            <Field label="Telefone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required error={errors.phone} onChange={(e) => (e.target.value = maskPhone(e.target.value))} />
            <Field label="CPF" name="document" inputMode="numeric" autoComplete="off" required error={errors.document} onChange={(e) => (e.target.value = maskCpf(e.target.value))} />
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-6">
            <legend className="font-display mb-6 text-2xl uppercase text-paper">02 — Entrega</legend>
            <Field label="CEP" name="cep" inputMode="numeric" autoComplete="postal-code" required error={errors.cep} className="sm:col-span-2" onChange={(e) => (e.target.value = maskCep(e.target.value))} />
            <Field label="Rua" name="street" autoComplete="address-line1" required error={errors.street} className="sm:col-span-4" />
            <Field label="Número" name="number" autoComplete="off" required error={errors.number} className="sm:col-span-2" />
            <Field label="Complemento" name="complement" autoComplete="address-line2" className="sm:col-span-4" />
            <Field label="Bairro" name="neighborhood" autoComplete="off" required error={errors.neighborhood} className="sm:col-span-3" />
            <Field label="Cidade" name="city" autoComplete="address-level2" required error={errors.city} className="sm:col-span-2" />
            <Field label="UF" name="state" maxLength={2} autoComplete="address-level1" required error={errors.state} className="sm:col-span-1" />
          </fieldset>

          <fieldset>
            <legend className="font-display mb-6 text-2xl uppercase text-paper">03 — Pagamento</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={methodCls(method === "pix")}>
                <input type="radio" name="payment" value="pix" checked={method === "pix"} onChange={() => setMethod("pix")} className="size-4 accent-[var(--color-red)]" />
                <Banknote aria-hidden className="size-5" strokeWidth={1.5} />
                <span className="t-eyebrow">Pix</span>
              </label>
              <label className={methodCls(method === "card")}>
                <input type="radio" name="payment" value="card" checked={method === "card"} onChange={() => setMethod("card")} className="size-4 accent-[var(--color-red)]" />
                <CreditCard aria-hidden className="size-5" strokeWidth={1.5} />
                <span className="t-eyebrow">Cartão de crédito</span>
              </label>
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm text-ash-lt">
              <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
              Os dados de pagamento serão coletados diretamente pelo gateway seguro, nunca por este formulário.
            </p>
          </fieldset>

          <div>
            <Button type="submit" variant="solid" size="lg" arrow disabled={loading} className="w-full sm:w-auto">
              {loading ? "Processando…" : "Confirmar pedido"}
            </Button>
            <div role="status" aria-live="polite" className="mt-6">
              {outcome.kind === "not_configured" && (
                <div className="border border-bone/30 p-6">
                  <p className="font-display text-2xl uppercase text-paper">Pedido validado</p>
                  <p className="mt-2 text-bone/80">
                    {outcome.message} Seu pedido de <strong className="text-paper">{formatPrice(outcome.total)}</strong> foi conferido, mas nenhuma cobrança foi realizada. Sua sacola continua salva.
                  </p>
                </div>
              )}
              {outcome.kind === "error" && <p role="alert" className="border border-signal p-4 text-signal">{outcome.message}</p>}
            </div>
          </div>
        </form>

        <aside aria-labelledby="resumo" className="h-fit border border-bone/15 bg-ink-2 p-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <h2 id="resumo" className="font-display text-2xl uppercase text-paper">Resumo ({count})</h2>
          <ul>
            {lines.map((l) => (
              <CartItem key={l.key} line={l} />
            ))}
          </ul>
          <dl className="mt-6 flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-bone/70">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-bone/70">Frete</dt><dd className="text-bone/70">Calculado na integração</dd></div>
            <div className="mt-3 flex items-baseline justify-between border-t border-bone/20 pt-4">
              <dt className="t-eyebrow">Total</dt>
              <dd className="font-display text-3xl tabular-nums text-paper">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
