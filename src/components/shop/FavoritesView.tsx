"use client";

import { useWishlist } from "@/context/WishlistContext";
import { catalog } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "./ProductGrid";

export function FavoritesView() {
  const { ids } = useWishlist();
  const items = catalog.all.filter((p) => ids.includes(p.id));
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border border-bone/15 p-10 md:p-16">
        <p className="font-display text-4xl uppercase text-paper md:text-6xl">Nada por aqui ainda</p>
        <p className="max-w-[44ch] text-bone/70">Toque no coração de uma peça para guardá-la. Seus favoritos ficam salvos neste dispositivo.</p>
        <Button href="/shop" variant="solid" arrow>Explorar o shop</Button>
      </div>
    );
  }
  return <ProductGrid products={items} />;
}
