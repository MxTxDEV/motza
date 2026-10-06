"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { sizeGuide } from "@/data/sizeGuide";
import { useDialog } from "@/lib/useDialog";

export function SizeTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <caption className="sr-only">Medidas da peça em centímetros, por tamanho</caption>
        <thead>
          <tr className="border-b border-bone/30 text-ash-lt">
            <th scope="col" className="t-eyebrow py-3 pr-4 font-semibold">Tam.</th>
            <th scope="col" className="t-eyebrow py-3 pr-4 font-semibold">Largura</th>
            <th scope="col" className="t-eyebrow py-3 pr-4 font-semibold">Comprimento</th>
            <th scope="col" className="t-eyebrow py-3 pr-4 font-semibold">Manga</th>
            <th scope="col" className="t-eyebrow py-3 font-semibold">Altura</th>
          </tr>
        </thead>
        <tbody>
          {sizeGuide.map((r) => (
            <tr key={r.size} className="border-b border-bone/10">
              <th scope="row" className="py-3 pr-4 font-display text-xl text-paper">{r.size}</th>
              <td className="py-3 pr-4 tabular-nums">{r.width} cm</td>
              <td className="py-3 pr-4 tabular-nums">{r.length} cm</td>
              <td className="py-3 pr-4 tabular-nums">{r.sleeve} cm</td>
              <td className="py-3 tabular-nums">{r.height}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeGuideButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useDialog(open, close, ref);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="link-underline t-eyebrow text-bone" aria-haspopup="dialog">
        Guia de tamanhos
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[110] flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <m.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-guide-title"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl border border-bone/15 bg-ink p-6 outline-none sm:p-10"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <h2 id="size-guide-title" className="font-display text-3xl uppercase text-paper sm:text-4xl">Guia de tamanhos</h2>
                <button type="button" onClick={close} aria-label="Fechar guia de tamanhos" className="touch-target -mr-3 -mt-2 inline-flex items-center justify-center hover:text-signal">
                  <X aria-hidden className="size-6" strokeWidth={1.5} />
                </button>
              </div>
              <SizeTable />
              <p className="mt-6 text-sm text-bone/70">
                Modelagem oversized: o caimento é amplo por design. Prefere um ajuste mais próximo ao corpo? Escolha um tamanho abaixo do habitual.
              </p>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
