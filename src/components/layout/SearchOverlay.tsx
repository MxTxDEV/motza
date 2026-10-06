"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Search, X } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useDialog } from "@/lib/useDialog";
import { catalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useDialog(searchOpen, closeSearch, ref);

  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return catalog.all.filter((p) => p.bestseller).slice(0, 4);
    return catalog.all.filter((p) => norm(`${p.name} ${p.description} ${p.colors.map((c) => c.name).join(" ")} ${p.category}`).includes(q));
  }, [query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Buscar"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] overflow-y-auto bg-ink/98 backdrop-blur-md outline-none"
        >
          <div className="pad-x mx-auto max-w-[1200px] pb-16 pt-6">
            <div className="flex justify-end">
              <button type="button" onClick={closeSearch} aria-label="Fechar busca" className="touch-target inline-flex items-center justify-center hover:text-signal">
                <X aria-hidden className="size-7" strokeWidth={1.5} />
              </button>
            </div>
            <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-6 flex items-center gap-4 border-b border-bone/40 pb-4">
              <Search aria-hidden className="size-6 shrink-0" strokeWidth={1.5} />
              <label htmlFor="search-input" className="sr-only">Buscar produtos</label>
              <input
                id="search-input"
                data-autofocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="BUSCAR NO DROP 01"
                autoComplete="off"
                className="w-full bg-transparent font-display text-[clamp(1.8rem,6vw,4rem)] uppercase text-paper placeholder:text-bone/30 focus:outline-none"
              />
            </form>
            <p className="t-eyebrow mt-8 text-ash-lt" aria-live="polite">
              {query.trim() ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : "Mais vendidos"}
            </p>
            {results.length === 0 ? (
              <p className="mt-6 text-lg text-bone/70">Nada encontrado para “{query}”. Tente “preto”, “oversized” ou “montanha”.</p>
            ) : (
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link href={`/produto/${p.slug}`} onClick={closeSearch} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                        <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      </div>
                      <p className="t-eyebrow mt-3 text-paper">{p.name}</p>
                      <p className="mt-1 text-sm text-bone/70">{formatPrice(p.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
