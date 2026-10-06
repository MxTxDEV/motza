/**
 * Mapa central das imagens de campanha. Substitua os arquivos em /public/images
 * (ou aponte para um CDN) sem tocar nos componentes.
 */
export const heroSlides = [
  { src: "/images/hero-1.jpg", alt: "Modelo de costas vestindo camiseta oversized MOTZA diante de montanhas ao amanhecer", position: "70% 50%" },
  { src: "/images/hero-2.jpg", alt: "Modelo de costas com camiseta oversized preta MOTZA RED diante de uma cidade ao entardecer", position: "70% 50%" },
  { src: "/images/hero-3.jpg", alt: "Modelo com camiseta oversized off-white DISCIPLINA em parede de concreto com luz natural", position: "70% 50%" },
] as const;

export const manifestoImage = {
  src: "/images/manifesto.jpg",
  alt: "Modelo de costas com camiseta MOTZA BOLD olhando para as montanhas na névoa",
};

export const aboutImage = {
  src: "/images/about.jpg",
  alt: "Modelo com camiseta MOTZA HERITAGE diante da cidade ao amanhecer",
};

export const mindsetItems = [
  { n: "01", title: "DISCIPLINA", text: "Fazer mesmo quando ninguém está olhando.", src: "/images/mindset-1.jpg", alt: "Silhueta em preto e branco diante de montanhas" },
  { n: "02", title: "MOVIMENTO", text: "Não permanecer parado.", src: "/images/mindset-2.jpg", alt: "Silhueta em preto e branco diante de uma cidade" },
  { n: "03", title: "LIBERDADE", text: "Construir a própria história.", src: "/images/mindset-3.jpg", alt: "Silhueta em preto e branco sob feixe de luz em parede de concreto" },
  { n: "04", title: "IDENTIDADE", text: "Não vestir aquilo que todo mundo veste.", src: "/images/mindset-4.jpg", alt: "Silhueta em preto e branco diante de montanhas ao pôr do sol" },
] as const;

export interface LookbookImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}

export const lookbook: LookbookImage[] = [
  { src: "/images/look-1.jpg", alt: "Look completo: MOTZA CLEAN com calça ampla, montanhas ao fundo", width: 1200, height: 1600, caption: "Corpo inteiro — MOTZA CLEAN" },
  { src: "/images/look-2.jpg", alt: "Look horizontal: MONTANHA off-white em cenário urbano ao pôr do sol", width: 1800, height: 1200, caption: "Cidade — MONTANHA" },
  { src: "/images/look-3.jpg", alt: "Close-up das costas da camiseta MOTZA BOLD sobre concreto", width: 1200, height: 1500, caption: "Close-up — MOTZA BOLD" },
  { src: "/images/products/thorn-4.jpg", alt: "Detalhe da estampa de espinhos da camiseta THORN", width: 1200, height: 1500, caption: "Detalhe — THORN" },
  { src: "/images/look-4.jpg", alt: "Modelo com MOTZA HERITAGE marrom diante de montanhas na névoa", width: 1200, height: 1600, caption: "Montanha — MOTZA HERITAGE" },
  { src: "/images/look-5.jpg", alt: "THORN preta em ambiente brutalista com feixe de luz", width: 1800, height: 1200, caption: "Concreto — THORN" },
  { src: "/images/look-6.jpg", alt: "Torso com a camiseta MOTZA RED em fundo urbano", width: 1200, height: 1200, caption: "Lifestyle — MOTZA RED" },
  { src: "/images/look-7.jpg", alt: "MONTANHA off-white com céu de pôr do sol ao fundo", width: 1200, height: 1600, caption: "Pôr do sol — MONTANHA" },
  { src: "/images/products/motza-bold-4.jpg", alt: "Detalhe da estampa MOTZA nas costas da camiseta BOLD", width: 1200, height: 1500, caption: "Detalhe — MOTZA BOLD" },
  { src: "/images/look-8.jpg", alt: "Modelo com camiseta DISCIPLINA off-white em cenário urbano", width: 1800, height: 1200, caption: "Cidade — DISCIPLINA" },
];

export const instagramImages = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: `/images/ig-${n}.jpg`,
  alt: `Publicação ${n} do Instagram da MOTZA`,
}));
