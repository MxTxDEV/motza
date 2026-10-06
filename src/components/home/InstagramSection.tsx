import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { instagramImages } from "@/data/images";
import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export function InstagramSection() {
  return (
    <section aria-labelledby="instagram-titulo" className="bg-ink py-24 md:py-36">
      <div className="pad-x mx-auto max-w-[2000px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="t-eyebrow flex items-center gap-3 text-bone">
              <span aria-hidden className="inline-block h-px w-8 bg-current" />
              Nos acompanhe no Instagram
            </p>
            <h2 id="instagram-titulo" className="sr-only">@MOTZA — Nos acompanhe no Instagram</h2>
            <RevealText as="p" lines={["@MOTZA"]} className="t-huge mt-5 text-paper" />
          </div>
          <Reveal>
            <Button href={site.social.instagram} external arrow>Seguir @motza</Button>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-3 xl:grid-cols-6">
          {instagramImages.map((img, i) => (
            <Reveal as="li" key={img.src} delay={(i % 3) * 0.05} y={20}>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${img.alt} — abrir Instagram da MOTZA`} className="group relative block aspect-square overflow-hidden bg-ink-2">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:1280px) 16vw, (min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
                <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-ink/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ArrowUpRight className="size-8 text-paper" strokeWidth={1.3} />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
