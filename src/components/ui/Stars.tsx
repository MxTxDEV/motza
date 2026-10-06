import { Star } from "lucide-react";

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`Avaliação ${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden className={`inline size-4 ${i < Math.round(value) ? "fill-current" : ""}`} strokeWidth={1.5} />
      ))}
    </span>
  );
}
