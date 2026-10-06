"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/data/types";
import { careInstructions } from "@/data/sizeGuide";
import { lookbook } from "@/data/images";
import { cn } from "@/lib/cn";
import { SizeTable } from "./SizeGuide";

function Item({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-bone/15">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left"
        >
          <span className="font-display text-2xl uppercase tracking-[0.03em] text-paper md:text-3xl">{title}</span>
          <Plus aria-hidden className={cn("size-6 shrink-0 transition-transform duration-500", open && "rotate-45")} strokeWidth={1.4} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pr-10 text-bone/85">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const onBody = [product.images[0], { src: lookbook[0].src, alt: lookbook[0].alt }];
  return (
    <section aria-labelledby="detalhes-titulo" className="pad-x mx-auto max-w-[1400px] py-20 md:py-28">
      <h2 id="detalhes-titulo" className="t-eyebrow mb-8 flex items-center gap-3">
        <span aria-hidden className="inline-block h-px w-8 bg-current" />
        Detalhes do produto
      </h2>
      <div className="border-t border-bone/15">
        <Item title="Detalhes" defaultOpen>
          <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-3">
                <span aria-hidden className="size-1.5 rotate-45 bg-red" />
                {d}.
              </li>
            ))}
          </ul>
        </Item>
        <Item title="Guia de tamanhos">
          <SizeTable />
        </Item>
        <Item title="Como fica no corpo">
          <div className="grid max-w-3xl grid-cols-2 gap-3">
            {onBody.map((img) => (
              <div key={img.src} className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 340px, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-[60ch] text-sm text-bone/70">
            Modelo com 1,82 m veste tamanho G. O caimento é oversized: para um ajuste mais próximo do corpo, escolha um tamanho abaixo.
          </p>
        </Item>
        <Item title="Cuidados">
          <ul className="flex flex-col gap-2">
            {careInstructions.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-red" />
                {c}
              </li>
            ))}
          </ul>
        </Item>
      </div>
    </section>
  );
}
