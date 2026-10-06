"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/data/types";
import { pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Desktop: grade editorial (primeira imagem em destaque, largura total).
 * Mobile: carrossel horizontal com snap e indicador.
 */
export function ProductGallery({ images }: { images: ProductImage[] }) {
  const scroller = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = scroller.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={scroller}
        onScroll={onScroll}
        aria-label="Galeria de imagens do produto"
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible"
      >
        {images.map((img, i) => (
          <li key={img.src} className={cn("relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-ink-2", i === 0 && "lg:col-span-2 lg:aspect-[5/4]")}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width:1024px) 55vw, 100vw" : "(min-width:1024px) 27vw, 100vw"}
              className="object-cover"
              style={i === 0 ? { objectPosition: "50% 40%" } : undefined}
            />
          </li>
        ))}
      </ul>

      <div className="pad-x pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-between lg:hidden">
        <p className="t-eyebrow bg-ink/70 px-2 py-1 text-paper backdrop-blur" aria-hidden>
          {pad2(index + 1)} / {pad2(images.length)}
        </p>
        <div className="pointer-events-auto flex">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver imagem ${i + 1} de ${images.length}`}
              aria-current={i === index}
              className="inline-flex h-9 w-7 items-center justify-center"
            >
              <span className={cn("h-0.5 w-5 transition-colors", i === index ? "bg-paper" : "bg-paper/40")} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
