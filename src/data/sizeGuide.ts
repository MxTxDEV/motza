import type { Size } from "@/data/types";

/** Medidas da peça (cm). Modelagem oversized. */
export const sizeGuide: { size: Size; width: number; length: number; sleeve: number; height: string }[] = [
  { size: "P", width: 58, length: 72, sleeve: 24, height: "1,60 – 1,70 m" },
  { size: "M", width: 60, length: 74, sleeve: 25, height: "1,70 – 1,78 m" },
  { size: "G", width: 62, length: 76, sleeve: 26, height: "1,78 – 1,85 m" },
  { size: "GG", width: 64, length: 78, sleeve: 27, height: "1,85 – 1,92 m" },
];

export const careInstructions = [
  "Lave do avesso, em água fria (até 30 °C).",
  "Não use alvejante nem amaciante em excesso.",
  "Seque à sombra, longe de fontes de calor.",
  "Passe a ferro do avesso, em temperatura baixa — nunca sobre a estampa.",
  "Não lave a seco.",
];
