import { cn } from "@/lib/cn";

const WORDS = ["DISCIPLINA", "MOVIMENTO", "LIBERDADE", "IDENTIDADE"];

/** Faixa contínua com os quatro pilares da marca. */
export function Marquee({ className }: { className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {WORDS.concat(WORDS).map((w, i) => (
        <li key={`${w}-${i}`} className="flex items-center">
          <span className="font-display text-[clamp(1.4rem,3vw,2.4rem)] uppercase tracking-[0.04em] px-6 md:px-10">{w}</span>
          <span aria-hidden className="size-2 rotate-45 bg-red" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("marquee overflow-hidden border-y border-bone/15 py-4", className)} role="presentation">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
