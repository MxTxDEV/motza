import Link from "next/link";
import { Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { site } from "@/config/site";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Coleção", href: "/colecao" },
  { label: "Sobre", href: "/sobre" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Contato", href: "/contato" },
];

const perks = [
  { icon: Truck, label: "Envio para todo Brasil" },
  { icon: ShieldCheck, label: "Pagamento seguro" },
  { icon: RefreshCw, label: "Troca facilitada" },
];

export function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink">
      <div className="pad-x mx-auto max-w-[2000px] pt-16 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-display text-[clamp(4rem,14vw,12rem)] leading-[0.85] tracking-[0.02em] text-paper">MOTZA</p>
            <p className="t-eyebrow mt-6 text-bone">Disciplina constrói liberdade.</p>
          </div>

          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-10 lg:col-span-6 lg:pt-4">
            <ul className="flex flex-col gap-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline t-eyebrow touch-target inline-flex items-center text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="link-underline t-eyebrow touch-target inline-flex items-center text-paper">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="link-underline t-eyebrow touch-target inline-flex items-center text-paper">
                  TikTok
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <ul className="mt-16 grid gap-4 border-y border-bone/10 py-6 sm:grid-cols-3">
          {perks.map(({ icon: Icon, label }) => (
            <li key={label} className="t-eyebrow flex items-center gap-3 text-bone">
              <Icon aria-hidden className="size-4 text-signal" strokeWidth={1.6} />
              {label}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 py-8 text-[0.7rem] uppercase tracking-[0.16em] text-ash-lt sm:flex-row sm:justify-between">
          <p>© 2026 MOTZA.</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
