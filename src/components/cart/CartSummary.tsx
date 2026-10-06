"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export function CartSummary() {
  const { subtotal, close } = useCart();
  return (
    <div className="border-t border-bone/20 bg-ink-2 px-6 py-6">
      <div className="flex items-baseline justify-between">
        <span className="t-eyebrow">Subtotal</span>
        <span className="font-display text-3xl tabular-nums text-paper">{formatPrice(subtotal)}</span>
      </div>
      <p className="mt-2 text-xs text-ash-lt">Frete e prazo calculados no checkout. Envio para todo o Brasil.</p>
      <Button href="/checkout" variant="solid" size="lg" arrow onClick={close} className="mt-5 w-full">
        Finalizar pedido
      </Button>
      <button type="button" onClick={close} className="link-underline t-eyebrow mx-auto mt-4 block text-bone/80">
        Continuar comprando
      </button>
    </div>
  );
}
