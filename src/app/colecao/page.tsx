import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { DropSection } from "@/components/home/DropSection";
import { Marquee } from "@/components/ui/Marquee";
import { RevealText } from "@/components/ui/Typography";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Coleção — DROP 01",
  description: "DROP 01: oito camisetas oversized criadas para quem transforma disciplina em movimento.",
  alternates: { canonical: "/colecao" },
};

export default async function ColecaoPage() {
  const products = await getProducts();
  return (
    <>
      <section className="pad-x mx-auto max-w-[2000px] pb-20 pt-[calc(var(--header-h)+3rem)] md:pb-28 md:pt-[calc(var(--header-h)+5rem)]">
        <p className="t-eyebrow mb-6 flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-8 bg-current" />
          Coleção
        </p>
        <RevealText as="h1" immediate lines={["DROP 01"]} className="t-mega text-paper" />
        <Reveal className="mt-10 max-w-[46ch]">
          <p className="text-lg leading-relaxed text-bone/85 md:text-xl">
            Oito peças. Uma ideia: <span className="t-serif text-[1.2em] text-paper">disciplina constrói liberdade.</span> Camisetas oversized em algodão premium 240 GSM, pensadas para o movimento.
          </p>
        </Reveal>
      </section>
      <Marquee />
      <DropSection products={products} />
    </>
  );
}
