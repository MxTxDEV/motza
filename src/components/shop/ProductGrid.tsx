import type { Product } from "@/data/types";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "./ProductCard";

/** Grid responsivo da loja: 2 colunas no mobile, 3–4 no desktop. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 md:gap-y-14 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 3) * 0.06} y={20}>
          <ProductCard product={p} priority={i < 2} sizes="(min-width:1536px) 20vw, (min-width:1024px) 27vw, 50vw" />
        </Reveal>
      ))}
    </ul>
  );
}
