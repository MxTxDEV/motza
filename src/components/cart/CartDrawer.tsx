"use client";

import { useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useDialog } from "@/lib/useDialog";
import { Button } from "@/components/ui/Button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function CartDrawer() {
  const { isOpen, close, lines, count, toast } = useCart();
  const ref = useRef<HTMLElement>(null);
  useDialog(isOpen, close, ref);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              key="backdrop"
              aria-hidden
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-[2px]"
            />
            <m.aside
              key="drawer"
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-label="Sua sacola"
              tabIndex={-1}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-[460px] flex-col border-l border-bone/10 bg-ink outline-none"
            >
              <div className="flex items-center justify-between px-6 py-5">
                <h2 className="font-display text-2xl uppercase tracking-[0.04em] text-paper">
                  Sua sacola <span className="ml-1 text-base text-ash-lt">({count})</span>
                </h2>
                <button type="button" onClick={close} aria-label="Fechar sacola" className="touch-target -mr-3 inline-flex items-center justify-center hover:text-signal">
                  <X aria-hidden className="size-6" strokeWidth={1.5} />
                </button>
              </div>

              {lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                  <ShoppingBag aria-hidden className="size-10 text-ash-lt" strokeWidth={1.2} />
                  <p className="font-display text-3xl uppercase text-paper">Sacola vazia</p>
                  <p className="max-w-[28ch] text-bone/70">Disciplina também é escolher bem. Comece pelo DROP 01.</p>
                  <Button href="/shop" onClick={close} arrow>Ver coleção</Button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 overflow-y-auto px-6 [scrollbar-width:thin]">
                    {lines.map((line) => (
                      <CartItem key={line.key} line={line} />
                    ))}
                  </ul>
                  <CartSummary />
                </>
              )}
            </m.aside>
          </>
        )}
      </AnimatePresence>

      {/* Feedback ao adicionar (fora do drawer) */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[120] flex justify-center px-4">
        <AnimatePresence>
          {toast && !isOpen && (
            <m.div
              key={toast.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-center gap-3 bg-bone px-5 py-3.5 text-ink shadow-2xl"
            >
              <Check aria-hidden className="size-4 text-red" strokeWidth={3} />
              <span className="t-eyebrow">{toast.message}</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
