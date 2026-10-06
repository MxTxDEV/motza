"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/cn";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

interface RevealTextProps {
  /** Cada item vira uma linha; as palavras entram uma a uma. */
  lines: string[];
  as?: Tag;
  className?: string;
  /** Anima imediatamente (acima da dobra) em vez de esperar o scroll. */
  immediate?: boolean;
  delay?: number;
  /** Classe aplicada por linha (ex.: destacar a última em vermelho). */
  lineClasses?: (string | undefined)[];
}

const word = {
  hidden: { y: "108%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.06 } }),
};

/** Títulos gigantes com reveal por palavra (máscara). */
export function RevealText({ lines, as = "h2", className, immediate, delay = 0, lineClasses }: RevealTextProps) {
  const Comp = m[as];
  let counter = 0;
  return (
    <Comp
      className={className}
      initial="hidden"
      animate={immediate ? "show" : undefined}
      whileInView={immediate ? undefined : "show"}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, li) => (
        <span key={li} className={cn("block", lineClasses?.[li])} aria-hidden>
          {line.split(" ").map((w, wi) => {
            const idx = counter++;
            return (
              <span key={wi} className="inline-block overflow-hidden py-[0.28em] -my-[0.28em] align-bottom">
                <m.span className="inline-block will-change-transform" variants={word} custom={idx + delay * 10}>
                  {w}
                  {wi < line.split(" ").length - 1 ? " " : ""}
                </m.span>
              </span>
            );
          })}
        </span>
      ))}
    </Comp>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("t-eyebrow", className)}>{children}</p>;
}
