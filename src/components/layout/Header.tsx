"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { mobileNavigation, navigation } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";
import { useDialog } from "@/lib/useDialog";
import { cn } from "@/lib/cn";
import { SearchOverlay } from "./SearchOverlay";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, open: openCart } = useCart();
  const { ids } = useWishlist();
  const { openSearch } = useUI();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);
  useDialog(menuOpen, () => setMenuOpen(false), menuRef);

  const solid = scrolled || menuOpen;
  const iconBtn = "touch-target relative inline-flex items-center justify-center transition-colors hover:text-signal";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          solid ? "border-b border-bone/10 bg-ink/95 backdrop-blur-md" : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="pad-x mx-auto flex h-[var(--header-h)] max-w-[2000px] items-center justify-between">
          <Link href="/" aria-label="MOTZA — página inicial" className="relative z-[70] font-display text-[1.7rem] leading-none tracking-[0.12em] text-paper">
            MOTZA
          </Link>

          <nav aria-label="Principal" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul className="flex items-center gap-12">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}
                    className="link-underline t-eyebrow text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[70] flex items-center gap-1 text-paper md:gap-3">
            <button type="button" onClick={openSearch} aria-label="Buscar produtos" className={cn(iconBtn, "gap-2")}>
              <Search aria-hidden className="size-[18px]" strokeWidth={1.6} />
              <span className="t-eyebrow hidden xl:inline">Search</span>
            </button>
            <Link href="/favoritos" aria-label={`Favoritos${ids.length ? `, ${ids.length} itens` : ""}`} className={cn(iconBtn, "hidden sm:inline-flex")}>
              <Heart aria-hidden className={cn("size-[18px]", ids.length > 0 && "fill-red text-red")} strokeWidth={1.6} />
            </Link>
            <button type="button" onClick={openCart} aria-label={`Abrir sacola${count ? `, ${count} itens` : ""}`} className={cn(iconBtn, "gap-2")}>
              <ShoppingBag aria-hidden className="size-[18px]" strokeWidth={1.6} />
              <span className="t-eyebrow hidden xl:inline">Bag</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={count}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold leading-5",
                    count > 0 ? "bg-red text-paper" : "text-ash-lt",
                  )}
                  aria-hidden
                >
                  {count}
                </m.span>
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className={cn(iconBtn, "lg:hidden")}
            >
              {menuOpen ? <X aria-hidden className="size-6" strokeWidth={1.6} /> : <Menu aria-hidden className="size-6" strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="menu-mobile"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink pad-x pb-10 pt-[calc(var(--header-h)+1.5rem)] outline-none lg:hidden"
          >
            <nav aria-label="Menu mobile" className="flex flex-1 flex-col justify-center">
              <ul className="flex flex-col">
                {mobileNavigation.map((item, i) => {
                  const external = "external" in item && item.external;
                  const cls = "group flex items-baseline justify-between border-b border-bone/10 py-3 font-display text-[clamp(2.6rem,12vw,4.5rem)] uppercase leading-none text-paper active:text-signal";
                  return (
                    <m.li
                      key={item.label}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
                    >
                      {external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                          {item.label}
                          <span className="t-eyebrow text-ash-lt">↗</span>
                        </a>
                      ) : (
                        <Link href={item.href} className={cls}>
                          {item.label}
                          <span className="t-eyebrow text-ash-lt">{String(i + 1).padStart(2, "0")}</span>
                        </Link>
                      )}
                    </m.li>
                  );
                })}
              </ul>
            </nav>
            <p className="t-serif pt-6 text-2xl text-bone/80">Disciplina constrói liberdade.</p>
          </m.div>
        )}
      </AnimatePresence>

      <SearchOverlay />
    </>
  );
}
