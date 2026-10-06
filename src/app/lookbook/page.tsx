import type { Metadata } from "next";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LookbookMagazine } from "@/components/home/Lookbook";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Lookbook — DROP 01",
  description: "O editorial do DROP 01 da MOTZA: montanha, cidade e concreto. Camisetas oversized em movimento.",
  alternates: { canonical: "/lookbook" },
};

export default function LookbookPage() {
  return (
    <div className="pad-x mx-auto max-w-[2000px] pb-24 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <SectionTitle as="h1" eyebrow="Editorial" lines={["LOOKBOOK", "DROP 01"]} titleClassName="t-mega" lineClasses={[undefined, "outline-text"]} className="mb-14 md:mb-20" />
      <LookbookMagazine />
      <div className="mt-20 flex justify-center">
        <Button href="/shop" variant="solid" size="lg" arrow>Comprar o DROP 01</Button>
      </div>
    </div>
  );
}
