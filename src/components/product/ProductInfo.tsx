"use client";

import { useRef, useState } from "react";
import { Check, Heart, Minus, Plus, Share2 } from "lucide-react";
import type { Product, Size } from "@/data/types";
import { MAX_QTY, useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { ColorSelector } from "./ColorSelector";
import { SizeSelector } from "./SizeSelector";
import { SizeGuideButton } from "./SizeGuide";

export function ProductInfo({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const sizeRef = useRef<HTMLDivElement>(null);
  const wished = has(product.id);

  const handleAdd = () => {
    if (!size) {
      setError(true);
      sizeRef.current?.querySelector<HTMLElement>("button:not([disabled])")?.focus();
      return;
    }
    add({ productId: product.id, size, color, quantity }, { openDrawer: true });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${product.name} — MOTZA`, text: product.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copiado");
    } catch {
      setShareMsg("Não foi possível compartilhar");
    }
    window.setTimeout(() => setShareMsg(""), 2400);
  };

  const qtyBtn = "touch-target inline-flex min-h-12 min-w-12 items-center justify-center transition-colors hover:bg-bone hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit";

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="t-eyebrow text-ash-lt">DROP 01</p>
        <h1 className="t-display mt-3 text-paper">{product.name}</h1>
        <p className="mt-5 font-display text-3xl tabular-nums text-paper">{formatPrice(product.price)}</p>
        <Stars value={product.rating} className="mt-3 inline-flex gap-0.5 text-bone" />
      </header>

      <p className="max-w-[48ch] text-base leading-relaxed text-bone/85">
        {product.description} Modelagem oversized, ombro caído e caimento pensado para o movimento.
      </p>

      <div>
        <p className="t-eyebrow mb-3">Cor — <span className="text-ash-lt">{color}</span></p>
        <ColorSelector colors={product.colors} value={color} onChange={setColor} />
      </div>

      <div ref={sizeRef}>
        <div className="mb-3 flex items-center justify-between">
          <p className="t-eyebrow">Tamanho{size && <span className="text-ash-lt"> — {size}</span>}</p>
          <SizeGuideButton />
        </div>
        <SizeSelector
          product={product}
          value={size}
          invalid={error}
          onChange={(s) => {
            setSize(s);
            setError(false);
          }}
        />
        <p role="alert" className={cn("mt-3 text-sm text-signal", !error && "sr-only")}>
          {error ? "Selecione um tamanho para continuar." : ""}
        </p>
      </div>

      <div>
        <p className="t-eyebrow mb-3">Quantidade</p>
        <div className="inline-flex items-center border border-bone/30" role="group" aria-label="Quantidade">
          <button type="button" className={qtyBtn} disabled={quantity <= 1} onClick={() => setQuantity((q) => q - 1)} aria-label="Diminuir quantidade">
            <Minus aria-hidden className="size-4" />
          </button>
          <span className="min-w-12 text-center tabular-nums" aria-live="polite">{quantity}</span>
          <button type="button" className={qtyBtn} disabled={quantity >= MAX_QTY} onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">
            <Plus aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={handleAdd} variant="solid" size="lg" className="w-full">
          {added ? (
            <span className="inline-flex items-center gap-2"><Check aria-hidden className="size-4" /> Adicionado</span>
          ) : (
            "Adicionar ao carrinho"
          )}
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-pressed={wished}
            className="t-eyebrow inline-flex min-h-12 items-center justify-center gap-2 border border-bone/30 transition-colors hover:border-bone"
          >
            <Heart aria-hidden className={cn("size-4", wished && "fill-red text-red")} />
            {wished ? "Favoritado" : "Favoritar"}
          </button>
          <button type="button" onClick={handleShare} className="t-eyebrow inline-flex min-h-12 items-center justify-center gap-2 border border-bone/30 transition-colors hover:border-bone">
            <Share2 aria-hidden className="size-4" />
            Compartilhar
          </button>
        </div>
        <p role="status" className="min-h-5 text-center text-sm text-bone/70">{shareMsg}</p>
      </div>
    </div>
  );
}
