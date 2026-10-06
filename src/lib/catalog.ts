/**
 * Camada de acesso ao catálogo. Hoje lê de src/data/products.ts; para conectar
 * um banco de dados / CMS basta reimplementar estas funções (já são async).
 */
import { products } from "@/data/products";
import type { Product } from "@/data/types";

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products;
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

/** Versão síncrona usada por Client Components (carrinho, busca). */
export const catalog = {
  all: products,
  byId: (id: string) => products.find((p) => p.id === id),
};
