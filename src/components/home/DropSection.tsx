import type { Product } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/cn";

/** Variações propositais do grid editorial (colunas, proporção e deslocamento). */
const layout: { col: string; aspect: string; offset?: string }[] = [
  { col: "col-span-2 lg:col-span-7", aspect: "aspect-[4/5] lg:aspect-[7/6]" },
  { col: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "lg:mt-32" },
  { col: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "lg:mt-4" },
  { col: "col-span-2 lg:col-span-7", aspect: "aspect-[5/4] lg:aspect-[7/6]", offset: "lg:mt-24" },
  { col: "lg:col-span-3", aspect: "aspect-[4/5]" },
  { col: "lg:col-span-3", aspect: "aspect-[4/5]", offset: "lg:mt-14" },
  { col: "lg:col-span-3", aspect: "aspect-[4/5]" },
  { col: "lg:col-span-3", aspect: "aspect-[4/5]", offset: "lg:mt-14" },
];

export function DropSection({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="drop-titulo" className="on-light bg-bone py-24 text-ink md:py-36">
      <div className="pad-x mx-auto max-w-[2000px]">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <SectionTitle eyebrow="DROP 01" lines={["MAIS QUE", "ROUPA."]} className="lg:col-span-8" lineClasses={[undefined, "text-red"]} />
          <Reveal className="flex flex-col items-start gap-8 lg:col-span-4 lg:pb-3">
            <p className="max-w-[34ch] text-lg leading-snug md:text-xl">
              Uma coleção criada para quem transforma <span className="t-serif text-[1.15em]">disciplina em movimento.</span>
            </p>
            <Button href="/shop" variant="light" arrow>Ver todos</Button>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-x-3 gap-y-12 md:mt-24 md:gap-x-5 lg:grid-cols-12 lg:gap-y-20">
          {products.slice(0, layout.length).map((p, i) => (
            <Reveal as="li" key={p.id} className={cn(layout[i].col, layout[i].offset)} y={36}>
              <ProductCard
                product={p}
                tone="light"
                aspect={layout[i].aspect}
                sizes={layout[i].col.includes("col-span-7") ? "(min-width:1024px) 58vw, 100vw" : layout[i].col.includes("col-span-5") ? "(min-width:1024px) 42vw, 50vw" : "(min-width:1024px) 25vw, 50vw"}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
