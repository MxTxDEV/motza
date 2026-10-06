import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop/ShopView";
import { isCategoryTab } from "@/components/shop/filters";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Shop — DROP 01",
  description: "Camisetas oversized MOTZA em algodão 240 GSM. Filtre por tamanho, cor e preço. Envio para todo o Brasil.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  return (
    <div className="pad-x mx-auto max-w-[2000px] pb-24 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <SectionTitle as="h1" eyebrow="DROP 01" lines={["SHOP"]} titleClassName="t-mega" className="mb-12 md:mb-16" />
      <Suspense>
        <ShopView initialCategory={isCategoryTab(cat) ? cat : "todos"} />
      </Suspense>
    </div>
  );
}
