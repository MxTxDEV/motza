"use client";

import { ChevronDown } from "lucide-react";
import { sortOptions, type SortKey } from "./filters";

export function Sort({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="sort" className="t-eyebrow mr-3 hidden text-ash-lt sm:inline">Ordenar</label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="t-eyebrow min-h-11 cursor-pointer appearance-none border border-bone/30 bg-ink py-2 pl-3 pr-8 text-[0.66rem] tracking-[0.1em] text-paper sm:pl-4 sm:pr-10 sm:text-[0.72rem] sm:tracking-[0.22em] transition-colors hover:border-bone"
      >
        {sortOptions.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 size-4" />
    </div>
  );
}
