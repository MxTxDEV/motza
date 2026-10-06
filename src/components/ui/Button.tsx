import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "outline" | "solid" | "light" | "red";

interface CommonProps {
  variant?: Variant;
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;
type LinkProps = CommonProps & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href">;

const variants: Record<Variant, string> = {
  outline: "border border-bone/70 text-bone hover:bg-bone hover:text-ink hover:border-bone",
  solid: "bg-bone text-ink border border-bone hover:bg-red hover:border-red hover:text-paper",
  light: "bg-ink text-bone border border-ink hover:bg-red hover:border-red hover:text-paper on-light-btn",
  red: "bg-red text-paper border border-red hover:bg-paper hover:text-ink hover:border-paper",
};

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "outline", size = "md", arrow, className, children, ...rest } = props;
  const classes = cn(
    "group/btn inline-flex select-none items-center justify-center gap-3 whitespace-nowrap font-semibold uppercase tracking-[0.18em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40",
    size === "md" ? "min-h-12 px-7 text-[0.72rem]" : "min-h-14 px-9 text-[0.78rem]",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external, ...anchorRest } = rest as LinkProps;
    if (external || /^https?:|^mailto:/.test(href)) {
      return (
        <a href={href} className={classes} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }
  const { type = "button", ...buttonRest } = rest as ButtonProps;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
