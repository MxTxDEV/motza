"use client";

import type { ProductColor } from "@/data/types";
import { cn } from "@/lib/cn";

interface ColorSelectorProps {
  colors: ProductColor[];
  value: string;
  onChange: (name: string) => void;
}

export function ColorSelector({ colors, value, onChange }: ColorSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Cor" className="flex flex-wrap gap-3">
      {colors.map((c) => {
        const selected = c.name === value;
        return (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(c.name)}
            className={cn(
              "inline-flex min-h-12 items-center gap-3 border px-4 text-sm transition-colors",
              selected ? "border-bone" : "border-bone/20 hover:border-bone/60",
            )}
          >
            <span aria-hidden className="size-4 rounded-full border border-bone/40" style={{ backgroundColor: c.hex }} />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
