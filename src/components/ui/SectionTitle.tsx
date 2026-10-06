import { RevealText } from "./Typography";
import { cn } from "@/lib/cn";

interface SectionTitleProps {
  eyebrow?: string;
  lines: string[];
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
  lineClasses?: (string | undefined)[];
  children?: React.ReactNode;
}

export function SectionTitle({ eyebrow, lines, as = "h2", className, titleClassName = "t-huge", lineClasses, children }: SectionTitleProps) {
  return (
    <header className={cn("flex flex-col gap-5", className)}>
      {eyebrow && (
        <p className="t-eyebrow flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-8 bg-current" />
          {eyebrow}
        </p>
      )}
      <RevealText as={as} lines={lines} className={titleClassName} lineClasses={lineClasses} />
      {children}
    </header>
  );
}
