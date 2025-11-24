export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export enum HarmonyType {
  MONOCHROMATIC = 'Monocromática',
  ANALOGOUS = 'Análoga',
  COMPLEMENTARY = 'Complementaria',
  SPLIT_COMPLEMENTARY = 'Complementaria Dividida',
  TRIADIC = 'Triádica',
  TETRADIC = 'Tétrade (Rectangular)',
  SQUARE = 'Cuadrada',
  HEXAGONAL = 'Hexagonal',
}

export interface ColorDefinition {
  hex: string;
  hsl: HSL;
  name?: string; // Optional approximate name
}

export interface GeometricShape {
  x: number;
  y: number;
  width: number;
  height: number;
  colorIndex: number;
}