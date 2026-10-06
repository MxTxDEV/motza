import type { Metadata } from "next";
import Image from "next/image";
import { aboutImage } from "@/data/images";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/Typography";
import { Mindset } from "@/components/home/Mindset";

export const metadata: Metadata = {
  title: "Sobre a MOTZA",
  description: "A MOTZA nasceu da ideia de que estilo não é apenas aquilo que você veste. É aquilo que você representa. Mais que roupa. Um estilo de vida.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <>
      <section className="grain relative flex h-[100svh] min-h-[560px] items-end overflow-hidden">
        <Image src={aboutImage.src} alt={aboutImage.alt} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "72% 50%" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
        <div className="pad-x relative pb-14 md:pb-20">
          <p className="t-eyebrow mb-5 flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-current" />
            Sobre a MOTZA
          </p>
          <RevealText as="h1" immediate lines={["MAIS QUE ROUPA.", "UM ESTILO", "DE VIDA."]} className="t-huge text-paper" lineClasses={[undefined, undefined, "text-red"]} />
        </div>
      </section>

      <section className="pad-x mx-auto grid max-w-[1500px] gap-10 py-24 md:py-36 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="font-display text-[clamp(2rem,4vw,3.4rem)] uppercase leading-[0.98] text-paper">
            Estilo não é apenas aquilo que você veste.
          </p>
        </Reveal>
        <div className="flex flex-col gap-8 text-lg leading-relaxed text-bone/85 lg:col-span-6 lg:col-start-7 md:text-xl">
          <Reveal>
            <p>A MOTZA nasceu da ideia de que estilo não é apenas aquilo que você veste.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="t-serif text-[1.5em] leading-tight text-paper">É aquilo que você representa.</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p>
              A marca combina estética, disciplina e movimento para criar peças que representam uma geração que decidiu construir o próprio caminho.
            </p>
          </Reveal>
        </div>
      </section>

      <Mindset />

      <section className="grain relative overflow-hidden bg-ink-2 py-28 md:py-44">
        <div className="pad-x mx-auto max-w-[2000px]">
          <RevealText as="h2" lines={["DISCIPLINA", "CONSTRÓI", "LIBERDADE."]} className="t-mega text-paper" lineClasses={[undefined, undefined, "text-red"]} />
          <Reveal className="mt-14">
            <Button href="/shop" variant="solid" size="lg" arrow>Ver o DROP 01</Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
