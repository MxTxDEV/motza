"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, X } from "lucide-react";
import type { Product } from "@/data/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

interface ProductCardProps {
  product: Product;
  /** Classes de proporção do contêiner da imagem, ex.: "aspect-[4/5]". */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  /** Tema do bloco: "dark" (padrão) ou "light" quando sobre fundo off-white. */
  tone?: "dark" | "light";
  className?: string;
}

export function ProductCard({ product, aspect = "aspect-[4/5]", sizes = "(min-width:1024px) 33vw, 50vw", priority, tone = "dark", className }: ProductCardProps) {
  const [quickOpen, setQuickOpen] = useState(false);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const [first, second] = product.images;
  const color = product.colors[0];
  const light = tone === "light";

  return (
    <article className={cn("group relative", className)}>
      <div className={cn("relative overflow-hidden", aspect, light ? "bg-ink" : "bg-ink-2")}>
        <Link href={`/produto/${product.slug}`} aria-label={`${product.name} — ${formatPrice(product.price)}`} className="absolute inset-0 z-10">
          <Image
            src={first.src}
            alt={first.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:opacity-0 group-focus-within:opacity-0"
          />
          <Image
            src={second.src}
            alt=""
            fill
            sizes={sizes}
            className="scale-[1.08] object-cover opacity-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100 group-focus-within:opacity-100"
          />
        </Link>

        {product.bestseller && (
          <span className="t-eyebrow pointer-events-none absolute left-0 top-4 z-20 bg-red px-3 py-1.5 text-[0.62rem] text-paper">Best seller</span>
        )}

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
          className="touch-target absolute right-1 top-1 z-20 inline-flex items-center justify-center text-paper transition-colors hover:text-signal"
        >
          <Heart aria-hidden className={cn("size-5 drop-shadow", wished && "fill-red text-red")} strokeWidth={1.6} />
        </button>

        {/* Adicionar rápido */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-2.5 md:p-3">
          {quickOpen ? (
            <div role="group" aria-label={`Escolha o tamanho de ${product.name}`} className="flex items-center gap-1.5 bg-ink/95 p-2 backdrop-blur">
              {product.sizes.map((size) => {
                const out = product.soldOutSizes?.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={out}
                    onClick={() => {
                      add({ productId: product.id, size, color: color.name, quantity: 1 });
                      setQuickOpen(false);
                    }}
                    aria-label={`Adicionar tamanho ${size}${out ? " (esgotado)" : ""}`}
                    className="min-h-11 flex-1 border border-bone/30 text-xs font-semibold tracking-wider text-bone transition-colors hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:text-bone/25 disabled:line-through disabled:hover:bg-transparent"
                  >
                    {size}
                  </button>
                );
              })}
              <button type="button" onClick={() => setQuickOpen(false)} aria-label="Fechar seleção de tamanho" className="touch-target inline-flex items-center justify-center text-bone/70 hover:text-signal">
                <X aria-hidden className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              aria-label={`Adicionar ${product.name} à sacola`}
              className="t-eyebrow ml-auto flex min-h-11 items-center gap-2 bg-bone px-3.5 text-[0.65rem] text-ink transition-all duration-300 hover:bg-red hover:text-paper md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
            >
              <Plus aria-hidden className="size-4" strokeWidth={2.2} />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          )}
        </div>
      </div>

      <div className={cn("mt-3.5 flex items-start justify-between gap-4", light ? "text-ink" : "text-bone")}>
        <div className="min-w-0">
          <h3 className="font-display text-[clamp(1.05rem,1.8vw,1.5rem)] uppercase leading-none tracking-[0.03em]">
            <Link href={`/produto/${product.slug}`} className="link-underline">{product.name}</Link>
          </h3>
          <p className={cn("mt-2 flex items-center gap-2 text-xs", light ? "text-ink/60" : "text-ash-lt")}>
            <span aria-hidden className="size-2.5 rounded-full border border-current/40" style={{ backgroundColor: color.hex }} />
            {color.name}
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
