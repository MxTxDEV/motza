"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform } from "framer-motion";
import { manifestoImage } from "@/data/images";
import { RevealText } from "@/components/ui/Typography";
import { Reveal } from "@/components/ui/Reveal";

const pillars = ["DISCIPLINA.", "MOVIMENTO.", "LIBERDADE.", "IDENTIDADE."];

/** Seção editorial gigante: fotografia + manifesto. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} aria-labelledby="manifesto-titulo" className="grain relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ink py-24 md:min-h-[120svh] md:py-32">
      <m.div style={{ y }} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <Image src={manifestoImage.src} alt={manifestoImage.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: "30% 50%" }} />
      </m.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/20 to-ink/85" />

      <div className="pad-x relative">
        <h2 id="manifesto-titulo" className="sr-only">Não é sobre a roupa. É sobre quem você se torna.</h2>
        <RevealText as="p" lines={["NÃO É SOBRE", "A ROUPA."]} className="t-huge text-paper" />
      </div>

      <div className="pad-x relative flex flex-col items-end gap-12 text-right">
        <ul className="t-eyebrow absolute right-5 top-0 hidden flex-col gap-1 text-bone md:right-10 md:flex" aria-label="Pilares da marca">
          {pillars.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <RevealText as="p" lines={["É SOBRE QUEM", "VOCÊ SE TORNA."]} className="t-huge text-paper" lineClasses={[undefined, "text-red"]} />
        <Reveal className="w-full md:hidden">
          <ul className="t-eyebrow flex flex-col gap-1 text-left text-bone">
            {pillars.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
