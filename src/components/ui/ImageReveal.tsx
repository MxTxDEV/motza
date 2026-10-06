"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { cn } from "@/lib/cn";

interface ImageRevealProps {
  src: string;
  alt: string;
  sizes: string;
  /** Classes do contêiner (defina proporção/tamanho aqui). */
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Zoom sutil (2–4%) ao passar o mouse no ancestral `.group`. */
  hoverZoom?: boolean;
  objectPosition?: string;
  delay?: number;
}

/** Imagem com reveal por máscara (clip-path) e assentamento de escala. */
export function ImageReveal({ src, alt, sizes, className, imageClassName, priority, hoverZoom = true, objectPosition, delay = 0 }: ImageRevealProps) {
  return (
    <div className={cn("relative overflow-hidden bg-ink-2", className)}>
      <m.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay }}
      >
        <m.div
          className="absolute inset-0"
          initial={{ scale: 1.14 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            style={objectPosition ? { objectPosition } : undefined}
            className={cn("object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)]", hoverZoom && "group-hover:scale-[1.04]", imageClassName)}
          />
        </m.div>
      </m.div>
    </div>
  );
}
