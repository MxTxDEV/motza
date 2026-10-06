export type Size = "P" | "M" | "G" | "GG";
export type ProductCategory = "camisetas" | "oversized";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Preço em centavos. */
  price: number;
  category: ProductCategory;
  colors: ProductColor[];
  sizes: Size[];
  /** Tamanhos temporariamente indisponíveis. */
  soldOutSizes?: Size[];
  /**
   * Ordem: [0] foto no modelo (capa), [1] segunda foto (hover do card),
   * depois frente e costas da peça.
   */
  images: ProductImage[];
  featured: boolean;
  bestseller: boolean;
  rating: number;
  /** ISO date — usado na ordenação "Mais recentes". */
  createdAt: string;
  /** Unidades vendidas — usado na ordenação "Mais vendidos". */
  sales: number;
  details: string[];
}
