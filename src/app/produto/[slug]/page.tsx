import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { site } from "@/config/site";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.name} — Camiseta oversized`;
  const description = `${product.description} ${product.colors[0].name}, algodão 240 GSM. DROP 01 MOTZA.`;
  return {
    title,
    description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: { type: "website", title, description, url: `/produto/${product.slug}`, images: [{ url: product.images[0].src, width: 1200, height: 1500, alt: product.images[0].alt }] },
    twitter: { card: "summary_large_image", title, description, images: [product.images[0].src] },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(slug, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${site.url}${i.src}`),
    brand: { "@type": "Brand", name: "MOTZA" },
    color: product.colors.map((c) => c.name).join(", "),
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${site.url}/produto/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="pt-[var(--header-h)]">
        <nav aria-label="Você está em" className="pad-x mx-auto max-w-[2000px] py-5">
          <ol className="t-eyebrow flex flex-wrap items-center gap-2 text-ash-lt">
            <li><Link href="/" className="link-underline">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/shop" className="link-underline">Shop</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-paper">{product.name}</li>
          </ol>
        </nav>

        <div className="mx-auto grid max-w-[2000px] gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)] lg:gap-14 lg:px-10 2xl:px-16">
          <ProductGallery images={product.images} />
          <div className="pad-x pb-4 lg:px-0">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        <ProductDetails product={product} />

        <section aria-labelledby="relacionados" className="pad-x mx-auto max-w-[2000px] pb-24 md:pb-32">
          <h2 id="relacionados" className="t-title mb-10 text-paper">Você também vai gostar</h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.06} y={20}>
                <ProductCard product={p} sizes="(min-width:1024px) 25vw, 50vw" />
              </Reveal>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
