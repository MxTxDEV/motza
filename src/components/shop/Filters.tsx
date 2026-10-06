"use client";

import type { Size } from "@/data/types";
import { catalog } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { categoryTabs, priceRanges, type ShopFilters } from "./filters";

interface FiltersProps {
  value: ShopFilters;
  onChange: (next: ShopFilters) => void;
  onClear: () => void;
  showClear: boolean;
}

const SIZES: Size[] = ["P", "M", "G", "GG"];
const COLORS = Array.from(new Map(catalog.all.flatMap((p) => p.colors).map((c) => [c.name, c])).values());

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-bone/15 py-6">
      <legend className="t-eyebrow float-left mb-4 w-full text-paper">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export function Filters({ value, onChange, onClear, showClear }: FiltersProps) {
  const chip = (active: boolean) =>
    cn(
      "min-h-11 min-w-12 border px-4 text-sm font-semibold tracking-wider transition-colors",
      active ? "border-bone bg-bone text-ink" : "border-bone/30 text-bone hover:border-bone",
    );

  return (
    <div>
      <Group title="Categoria">
        <div className="flex flex-col gap-1">
          {categoryTabs.map((c) => (
            <label key={c.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="categoria"
                checked={value.category === c.id}
                onChange={() => onChange({ ...value, category: c.id })}
                className="size-4 accent-[var(--color-red)]"
              />
              {c.label}
            </label>
          ))}
        </div>
      </Group>

      <Group title="Tamanho">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button key={s} type="button" aria-pressed={value.sizes.includes(s)} onClick={() => onChange({ ...value, sizes: toggle(value.sizes, s) })} className={chip(value.sizes.includes(s))}>
              {s}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Cor">
        <div className="flex flex-col gap-1">
          {COLORS.map((c) => (
            <label key={c.name} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={value.colors.includes(c.name)}
                onChange={() => onChange({ ...value, colors: toggle(value.colors, c.name) })}
                className="size-4 accent-[var(--color-red)]"
              />
              <span aria-hidden className="size-3.5 rounded-full border border-bone/40" style={{ backgroundColor: c.hex }} />
              {c.name}
            </label>
          ))}
        </div>
      </Group>

      <Group title="Preço">
        <div className="flex flex-col gap-1">
          {priceRanges.map((r) => (
            <label key={r.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="preco"
                checked={value.price === r.id}
                onChange={() => onChange({ ...value, price: r.id })}
                className="size-4 accent-[var(--color-red)]"
              />
              {r.label}
            </label>
          ))}
        </div>
      </Group>

      {showClear && (
        <button type="button" onClick={onClear} className="link-underline t-eyebrow mt-2 text-signal">
          Limpar filtros
        </button>
      )}
    </div>
  );
}
