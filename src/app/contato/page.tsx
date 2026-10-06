import type { Metadata } from "next";
import { ContactForm } from "@/components/layout/ContactForm";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a MOTZA: dúvidas sobre pedidos, trocas, tamanhos e parcerias.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <div className="pad-x mx-auto grid max-w-[1500px] gap-16 pb-28 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)] lg:grid-cols-12">
      <div className="lg:col-span-6">
        <SectionTitle as="h1" eyebrow="Contato" lines={["FALE", "COM A MOTZA"]} titleClassName="t-display" lineClasses={[undefined, "text-red"]} />
        <p className="mt-8 max-w-[40ch] text-lg text-bone/80">
          Dúvidas sobre pedidos, trocas, tamanhos ou parcerias. Responderemos o mais rápido possível.
        </p>
        <ul className="mt-10 flex flex-col gap-3 text-sm">
          <li><a className="link-underline t-eyebrow" href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><a className="link-underline t-eyebrow" href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram {site.social.instagramHandle}</a></li>
          <li><a className="link-underline t-eyebrow" href={site.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></li>
        </ul>
      </div>
      <div className="lg:col-span-6">
        <ContactForm />
      </div>
    </div>
  );
}
