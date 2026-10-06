"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { useDialog } from "@/lib/useDialog";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Filters } from "./Filters";
import { Sort } from "./Sort";
import { ProductGrid } from "./ProductGrid";
import { activeFilterCount, applyFilters, categoryTabs, defaultFilters, type CategoryTab, type ShopFilters } from "./filters";

export function ShopView({ initialCategory = "todos" }: { initialCategory?: CategoryTab }) {
  const [filters, setFilters] = useState<ShopFilters>({ ...defaultFilters, category: initialCategory });
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(panelOpen, () => setPanelOpen(false), panelRef);

  const results = useMemo(() => applyFilters(catalog.all, filters), [filters]);
  const active = activeFilterCount(filters) + (filters.category !== "todos" ? 1 : 0);

  const update = (next: ShopFilters) => {
    setFilters(next);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (next.category === "todos") url.searchParams.delete("cat");
      else url.searchParams.set("cat", next.category);
      window.history.replaceState(null, "", url);
    }
  };
  const clear = () => update({ ...defaultFilters, sort: filters.sort });

  return (
    <div>
      {/* Abas de categoria */}
      <nav aria-label="Categorias" className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <ul className="flex gap-2 md:gap-3">
          {categoryTabs.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={filters.category === t.id}
                onClick={() => update({ ...filters, category: t.id })}
                className={cn(
                  "t-eyebrow min-h-11 whitespace-nowrap border px-5 transition-colors duration-300",
                  filters.category === t.id ? "border-bone bg-bone text-ink" : "border-bone/30 text-bone hover:border-bone",
                )}
              >
                [ {t.label} ]
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 flex items-center justify-between gap-4 border-y border-bone/15 py-3">
        <p className="t-eyebrow whitespace-nowrap text-ash-lt" aria-live="polite">
          {results.length} {results.length === 1 ? "peça" : "peças"}
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="t-eyebrow inline-flex min-h-11 items-center gap-2 border border-bone/30 px-3 text-[0.66rem] hover:border-bone sm:px-4 lg:hidden"
          >
            <SlidersHorizontal aria-hidden className="size-4" />
            Filtrar{active > 0 && <span className="rounded-full bg-red px-1.5 text-[0.65rem] leading-5 text-paper">{active}</span>}
          </button>
          <Sort value={filters.sort} onChange={(sort) => update({ ...filters, sort })} />
        </div>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filtros" className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+24px)]">
            <Filters value={filters} onChange={update} onClear={clear} showClear={active > 0} />
          </div>
        </aside>

        <div>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="flex flex-col items-start gap-6 border border-bone/15 p-10 md:p-16">
              <p className="font-display text-4xl uppercase text-paper md:text-6xl">Nenhuma peça encontrada</p>
              <p className="max-w-[44ch] text-bone/70">Nenhum produto combina com esses filtros. Remova alguns para ver o DROP 01 completo.</p>
              <Button onClick={clear} variant="solid">Limpar filtros</Button>
            </div>
          )}
        </div>
      </div>

      {/* Filtros — mobile */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <m.div aria-hidden onClick={() => setPanelOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/70 lg:hidden" />
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              tabIndex={-1}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-[101] flex w-[min(100%,380px)] flex-col bg-ink outline-none lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-bone/15 px-6 py-5">
                <h2 className="font-display text-2xl uppercase text-paper">Filtros</h2>
                <button type="button" onClick={() => setPanelOpen(false)} aria-label="Fechar filtros" className="touch-target -mr-3 inline-flex items-center justify-center">
                  <X aria-hidden className="size-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">
                <Filters value={filters} onChange={update} onClear={clear} showClear={active > 0} />
              </div>
              <div className="border-t border-bone/15 p-6">
                <Button onClick={() => setPanelOpen(false)} variant="solid" size="lg" className="w-full">
                  Ver {results.length} {results.length === 1 ? "peça" : "peças"}
                </Button>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
