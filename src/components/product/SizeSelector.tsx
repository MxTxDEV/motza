"use client";

import type { Product, Size } from "@/data/types";
import { cn } from "@/lib/cn";

interface SizeSelectorProps {
  product: Product;
  value: Size | null;
  onChange: (size: Size) => void;
  invalid?: boolean;
}

export function SizeSelector({ product, value, onChange, invalid }: SizeSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Tamanho" aria-invalid={invalid || undefined} className="flex flex-wrap gap-2">
      {product.sizes.map((size) => {
        const soldOut = product.soldOutSizes?.includes(size);
        const selected = value === size;
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={soldOut}
            onClick={() => onChange(size)}
            className={cn(
              "relative min-h-12 min-w-14 border px-4 text-sm font-semibold tracking-[0.1em] transition-colors duration-200",
              selected ? "border-bone bg-bone text-ink" : "border-bone/30 text-bone hover:border-bone",
              invalid && !selected && "border-signal",
              soldOut && "cursor-not-allowed border-bone/10 text-bone/30 hover:border-bone/10",
            )}
          >
            {size}
            {soldOut && (
              <>
                <span aria-hidden className="absolute inset-x-1 top-1/2 h-px -rotate-[28deg] bg-bone/40" />
                <span className="sr-only"> esgotado</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
