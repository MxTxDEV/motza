import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Preço padrão ou promocional (valor original riscado, atual em vermelho). */
export function Price({ cents, compareAt, className }: { cents: number; compareAt?: number; className?: string }) {
  return (
    <span className={cn("tabular-nums", className)}>
      {compareAt && compareAt > cents ? (
        <>
          <span className="sr-only">Preço promocional </span>
          <span className="text-signal">{formatPrice(cents)}</span>
          <span className="sr-only"> de </span>
          <s className="ml-2 opacity-50">{formatPrice(compareAt)}</s>
        </>
      ) : (
        formatPrice(cents)
      )}
    </span>
  );
}
