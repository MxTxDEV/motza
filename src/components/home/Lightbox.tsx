"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { LookbookImage } from "@/data/images";
import { useDialog } from "@/lib/useDialog";
import { pad2 } from "@/lib/format";

interface LightboxProps {
  images: LookbookImage[];
  /** Índice aberto, ou null se fechado. */
  index: number | null;
  onIndex: (i: number | null) => void;
}

export function Lightbox({ images, index, onIndex }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const close = useCallback(() => onIndex(null), [onIndex]);
  useDialog(open, close, ref);

  const step = useCallback(
    (dir: 1 | -1) => onIndex(index === null ? null : (index + dir + images.length) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, step]);

  const img = index !== null ? images[index] : null;
  const btn = "touch-target inline-flex size-12 items-center justify-center border border-bone/30 bg-ink/60 backdrop-blur transition-colors hover:bg-bone hover:text-ink";

  return (
    <AnimatePresence>
      {img && index !== null && (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização do lookbook"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[130] bg-ink/97 outline-none"
        >
          <div className="pad-x absolute inset-x-0 top-0 z-10 flex h-20 items-center justify-between">
            <p className="t-eyebrow tabular-nums text-paper">
              {pad2(index + 1)} <span className="text-ash-lt">/ {pad2(images.length)}</span>
            </p>
            <button type="button" onClick={close} aria-label="Fechar visualização" className={btn} data-autofocus>
              <X aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={img.src}
              className="absolute inset-x-0 bottom-24 top-20 md:inset-x-24"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) step(1);
                else if (info.offset.x > 80) step(-1);
              }}
            >
              <Image src={img.src} alt={img.alt} fill sizes="100vw" className="select-none object-contain" priority draggable={false} />
            </m.div>
          </AnimatePresence>

          <div className="pad-x absolute inset-x-0 bottom-0 flex h-24 items-center justify-between gap-4">
            <p className="t-eyebrow max-w-[60%] text-bone">{img.caption}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} aria-label="Imagem anterior" className={btn}>
                <ChevronLeft aria-hidden className="size-5" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Próxima imagem" className={btn}>
                <ChevronRight aria-hidden className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
