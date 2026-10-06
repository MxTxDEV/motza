import { getFeaturedProducts } from "@/lib/catalog";
import { Hero } from "@/components/home/Hero";
import { DropSection } from "@/components/home/DropSection";
import { Manifesto } from "@/components/home/Manifesto";
import { Mindset } from "@/components/home/Mindset";
import { Lookbook } from "@/components/home/Lookbook";
import { InstagramSection } from "@/components/home/InstagramSection";
import { Marquee } from "@/components/ui/Marquee";

export default async function HomePage() {
  const products = await getFeaturedProducts();
  return (
    <>
      <Hero />
      <Marquee className="bg-ink text-bone" />
      <DropSection products={products} />
      <Manifesto />
      <Mindset />
      <Lookbook />
      <InstagramSection />
    </>
  );
}
