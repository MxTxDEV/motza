"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { heroSlides } from "@/data/images";
import { pad2 } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/Typography";

const INTERVAL = 7000;

/**
 * Hero em carrossel (3 slides). A cópia fica fixa e só a fotografia muda —
 * para adicionar slides basta incluir itens em `heroSlides`.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const total = heroSlides.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % total), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, playing, total]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

  return (
    <section ref={ref} aria-roledescription="carrossel" aria-label="Destaques MOTZA" className="grain relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
      <m.div style={{ y }} className="absolute inset-x-0 -top-[4%] h-[112%]">
        {heroSlides.map((s, i) => (
          <m.div
            key={s.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={i !== index}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.07 }}
            transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: i === index ? 8 : 1.4, ease: "linear" } }}
          >
            <Image src={s.src} alt={i === index ? s.alt : ""} fill priority={i === 0} sizes="100vw" style={{ objectPosition: s.position }} className="object-cover" />
          </m.div>
        ))}
      </m.div>

      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/50" />

      <m.div style={{ y: textY }} className="pad-x absolute inset-x-0 bottom-0 pb-28 md:pb-32">
        <p className="t-eyebrow flex items-center gap-3 text-bone">
          <span aria-hidden className="inline-block h-px w-8 bg-current" />
          EST. 2024
        </p>
        <p className="mt-3 font-display text-[clamp(1.4rem,2.4vw,2.2rem)] leading-none tracking-[0.3em] text-paper">MOTZA</p>
        <RevealText
          as="h1"
          immediate
          delay={0.4}
          lines={["DISCIPLINA", "CONSTRÓI", "LIBERDADE."]}
          className="t-hero mt-4 text-paper"
          lineClasses={[undefined, undefined, "text-bone"]}
        />
        <div className="mt-8 md:mt-10">
          <Button href="/shop" variant="outline" size="lg" arrow className="border-paper text-paper hover:bg-paper hover:text-ink">
            [ Ver coleção ]
          </Button>
        </div>
      </m.div>

      <div className="pad-x absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-6 md:pb-8">
        <div className="flex items-center gap-1 text-paper">
          <p className="t-eyebrow mr-2 whitespace-nowrap tabular-nums sm:mr-3" aria-live={playing ? "off" : "polite"}>
            {pad2(index + 1)} <span className="text-ash-lt">/ {pad2(total)}</span>
          </p>
          <button type="button" onClick={() => go(-1)} aria-label="Slide anterior" className="touch-target inline-flex items-center justify-center hover:text-signal">
            <ChevronLeft aria-hidden className="size-5" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Próximo slide" className="touch-target inline-flex items-center justify-center hover:text-signal">
            <ChevronRight aria-hidden className="size-5" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pausar carrossel" : "Reproduzir carrossel"} className="touch-target hidden items-center justify-center hover:text-signal sm:inline-flex">
            {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          </button>
        </div>
        <p className="t-eyebrow whitespace-nowrap text-right text-[0.6rem] leading-relaxed tracking-[0.16em] text-paper sm:text-[0.72rem] sm:tracking-[0.22em]">
          Mais que roupa.
          <br />
          Um estilo de vida.
        </p>
      </div>

      {/* barra de progresso */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-bone/20">
        <AnimatePresence mode="wait">
          <m.div
            key={`${index}-${playing}`}
            className="h-full origin-left bg-red"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: playing ? 1 : 0 }}
            transition={{ duration: playing ? INTERVAL / 1000 : 0, ease: "linear" }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}
