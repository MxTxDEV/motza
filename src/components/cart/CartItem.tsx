"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { MAX_QTY, useCart, type CartLine } from "@/context/CartContext";
import { catalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function CartItem({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const { setQuantity, remove, close } = useCart();
  const product = catalog.byId(line.productId);
  if (!product) return null;
  const btn = "touch-target inline-flex items-center justify-center transition-colors hover:bg-bone hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit";

  return (
    <li className="flex gap-4 border-b border-bone/10 py-5">
      <Link href={`/produto/${product.slug}`} onClick={close} className="relative block aspect-[4/5] w-24 shrink-0 overflow-hidden bg-ink-2 sm:w-28">
        <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="112px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/produto/${product.slug}`} onClick={close} className="t-eyebrow text-paper hover:text-signal">
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-ash-lt">
              {line.size} / {line.color}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(line.key)}
            aria-label={`Remover ${product.name} tamanho ${line.size} da sacola`}
            className="touch-target -mr-3 -mt-3 inline-flex items-center justify-center text-ash-lt hover:text-signal"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-sm tabular-nums text-bone">{formatPrice(product.price)}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="inline-flex items-center border border-bone/30" role="group" aria-label={`Quantidade de ${product.name}`}>
            <button type="button" className={btn} onClick={() => setQuantity(line.key, line.quantity - 1)} aria-label="Diminuir quantidade">
              <Minus aria-hidden className="size-3.5" />
            </button>
            <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">{line.quantity}</span>
            <button type="button" className={btn} disabled={line.quantity >= MAX_QTY} onClick={() => setQuantity(line.key, line.quantity + 1)} aria-label="Aumentar quantidade">
              <Plus aria-hidden className="size-3.5" />
            </button>
          </div>
          {!compact && <p className="text-sm font-semibold tabular-nums text-paper">{formatPrice(product.price * line.quantity)}</p>}
        </div>
      </div>
    </li>
  );
}
