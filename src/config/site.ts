export const site = {
  name: "MOTZA",
  title: "MOTZA — Mais que roupa. Um estilo de vida.",
  description:
    "MOTZA é streetwear premium brasileiro. Camisetas oversized em algodão 240 GSM. Disciplina constrói liberdade. Conheça o DROP 01.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://motza.com.br",
  locale: "pt_BR",
  email: "contato@motza.com.br",
  social: {
    instagram: "https://www.instagram.com/motza",
    instagramHandle: "@MOTZA",
    tiktok: "https://www.tiktok.com/@motza",
  },
} as const;

export const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "Coleção", href: "/colecao" },
  { label: "Sobre", href: "/sobre" },
  { label: "Lookbook", href: "/lookbook" },
] as const;

export const mobileNavigation = [
  { label: "Shop", href: "/shop" },
  { label: "Coleção", href: "/colecao" },
  { label: "Sobre", href: "/sobre" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Instagram", href: site.social.instagram, external: true },
  { label: "Contato", href: "/contato" },
] as const;
