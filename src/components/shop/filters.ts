import type { Product, Size } from "@/data/types";

export type CategoryTab = "todos" | "camisetas" | "oversized" | "best-sellers";
export type SortKey = "recentes" | "vendidos" | "menor-preco" | "maior-preco";
export type PriceRange = "ate-150" | "150-175" | "acima-175";

export interface ShopFilters {
  category: CategoryTab;
  sizes: Size[];
  colors: string[];
  price: PriceRange | null;
  sort: SortKey;
}

export const defaultFilters: ShopFilters = { category: "todos", sizes: [], colors: [], price: null, sort: "recentes" };

export const categoryTabs: { id: CategoryTab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "camisetas", label: "Camisetas" },
  { id: "oversized", label: "Oversized" },
  { id: "best-sellers", label: "Best sellers" },
];

export const sortOptions: { id: SortKey; label: string }[] = [
  { id: "recentes", label: "Mais recentes" },
  { id: "vendidos", label: "Mais vendidos" },
  { id: "menor-preco", label: "Menor preço" },
  { id: "maior-preco", label: "Maior preço" },
];

export const priceRanges: { id: PriceRange; label: string; test: (cents: number) => boolean }[] = [
  { id: "ate-150", label: "Até R$150", test: (c) => c <= 15000 },
  { id: "150-175", label: "R$150 – R$175", test: (c) => c > 15000 && c <= 17500 },
  { id: "acima-175", label: "Acima de R$175", test: (c) => c > 17500 },
];

export function isCategoryTab(v: string | undefined): v is CategoryTab {
  return categoryTabs.some((t) => t.id === v);
}

export function applyFilters(products: Product[], f: ShopFilters): Product[] {
  const range = priceRanges.find((r) => r.id === f.price);
  const list = products.filter((p) => {
    if (f.category === "camisetas" && p.category !== "camisetas") return false;
    if (f.category === "oversized" && p.category !== "oversized") return false;
    if (f.category === "best-sellers" && !p.bestseller) return false;
    if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s) && !p.soldOutSizes?.includes(s))) return false;
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c.name))) return false;
    if (range && !range.test(p.price)) return false;
    return true;
  });
  const sorted = [...list];
  switch (f.sort) {
    case "recentes":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "vendidos":
      sorted.sort((a, b) => b.sales - a.sales);
      break;
    case "menor-preco":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      sorted.sort((a, b) => b.price - a.price);
      break;
  }
  return sorted;
}

export function activeFilterCount(f: ShopFilters): number {
  return f.sizes.length + f.colors.length + (f.price ? 1 : 0);
}
