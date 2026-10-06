"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { lookbook } from "@/data/images";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

/** Posições (índice em `lookbook`) e classes do collage da home. */
const preview: { i: number; className: string }[] = [
  { i: 0, className: "col-span-5 md:col-span-4" },
  { i: 1, className: "col-span-7 md:col-span-8 md:mt-16" },
  { i: 6, className: "col-span-6 md:col-span-3" },
  { i: 4, className: "col-span-6 md:col-span-5 md:mt-20" },
  { i: 2, className: "col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-4 md:col-start-auto" },
];

function Tile({ index, className, onOpen, sizes }: { index: number; className?: string; onOpen: (i: number) => void; sizes: string }) {
  const img = lookbook[index];
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Ampliar: ${img.caption}`}
      className={cn("group relative block w-full overflow-hidden bg-ink-2 text-left", className)}
      style={{ aspectRatio: `${img.width} / ${img.height}` }}
    >
      <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
      <span className="t-eyebrow absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/85 to-transparent p-3 text-[0.62rem] text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
        {img.caption}
        <Maximize2 aria-hidden className="size-3.5" />
      </span>
    </button>
  );
}

/** Home: collage editorial com 5 imagens + lightbox navegável. */
export function Lookbook() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-labelledby="lookbook-titulo" className="on-light bg-bone py-24 text-ink md:py-36">
      <div className="pad-x mx-auto max-w-[2000px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionTitle eyebrow="Editorial" lines={["LOOKBOOK", "DROP 01"]} lineClasses={[undefined, "text-red"]} />
          <Reveal>
            <Button href="/lookbook" variant="light" arrow>Ver lookbook completo</Button>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-12 items-start gap-3 md:mt-20 md:gap-5">
          {preview.map(({ i, className }, k) => (
            <Reveal as="li" key={i} className={className} delay={(k % 2) * 0.08} y={30}>
              <Tile index={i} onOpen={setOpen} sizes="(min-width:1024px) 40vw, 80vw" />
            </Reveal>
          ))}
        </ul>
      </div>
      <Lightbox images={lookbook} index={open} onIndex={setOpen} />
    </section>
  );
}

/** Página /lookbook: layout em colunas estilo revista (verticais, horizontais, close-ups). */
export function LookbookMagazine() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="columns-1 gap-3 sm:columns-2 md:gap-5 lg:columns-3">
        {lookbook.map((img, i) => (
          <Reveal as="li" key={img.src} className="mb-3 break-inside-avoid md:mb-5" y={30} delay={(i % 3) * 0.06}>
            <Tile index={i} onOpen={setOpen} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
            <p className="t-eyebrow mt-2 flex justify-between text-ash-lt">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{img.caption}</span>
            </p>
          </Reveal>
        ))}
      </ul>
      <Lightbox images={lookbook} index={open} onIndex={setOpen} />
    </>
  );
}
