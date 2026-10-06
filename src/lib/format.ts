/** Preços são guardados em centavos. Ex.: 14990 → "R$149,90" */
export function formatPrice(cents: number): string {
  const value = (cents / 100).toFixed(2);
  const [int, dec] = value.split(".");
  return `R$${int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${dec}`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
