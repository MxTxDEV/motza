import type { Metadata } from "next";
import { FavoritesView } from "@/components/shop/FavoritesView";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Suas peças favoritas do DROP 01 MOTZA.",
  alternates: { canonical: "/favoritos" },
  robots: { index: false },
};

export default function FavoritosPage() {
  return (
    <div className="pad-x mx-auto max-w-[2000px] pb-24 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <SectionTitle as="h1" eyebrow="Wishlist" lines={["FAVORITOS"]} titleClassName="t-mega" className="mb-14" />
      <FavoritesView />
    </div>
  );
}
