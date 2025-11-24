import { HSL, HarmonyType, ColorDefinition } from '../types';

// HSL to Hex Conversion
export function hslToHex({ h, s, l }: HSL): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Hex to HSL Conversion
export function hexToHsl(hex: string): HSL {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

// Generate Palette based on Harmony
export function generatePalette(base: HSL, harmony: HarmonyType): ColorDefinition[] {
  let hsls: HSL[] = [];

  switch (harmony) {
    case HarmonyType.MONOCHROMATIC:
      // Generate variations in Lightness and Saturation
      hsls = [
        base,
        { ...base, l: Math.max(10, base.l - 20) }, // Darker
        { ...base, l: Math.min(95, base.l + 20) }, // Lighter
        { ...base, s: Math.max(10, base.s - 30), l: Math.min(90, base.l + 10) }, // Desaturated lighter
        { ...base, s: Math.min(100, base.s + 20), l: Math.max(20, base.l - 10) }, // Saturated darker
      ];
      break;
    case HarmonyType.ANALOGOUS:
      hsls = [
        { ...base, h: (base.h - 30 + 360) % 360 },
        base,
        { ...base, h: (base.h + 30) % 360 },
        { ...base, h: (base.h + 60) % 360 }, // Extra analogous
        { ...base, h: (base.h - 60 + 360) % 360 }, // Extra analogous
      ];
      break;
    case HarmonyType.COMPLEMENTARY:
      hsls = [
        base,
        { ...base, h: (base.h + 180) % 360 },
        // Add tints/shades of the complementary to fill palette
        { ...base, l: Math.min(90, base.l + 20) },
        { h: (base.h + 180) % 360, s: base.s, l: Math.max(20, base.l - 20) },
        { h: (base.h + 180) % 360, s: Math.max(0, base.s - 20), l: Math.min(95, base.l + 30) },
      ];
      break;
    case HarmonyType.SPLIT_COMPLEMENTARY:
      hsls = [
        base,
        { ...base, h: (base.h + 150) % 360 },
        { ...base, h: (base.h + 210) % 360 },
        // Variations
        { ...base, l: Math.max(20, base.l - 20) },
        { h: (base.h + 150) % 360, s: base.s, l: Math.min(90, base.l + 20) },
      ];
      break;
    case HarmonyType.TRIADIC:
      hsls = [
        base,
        { ...base, h: (base.h + 120) % 360 },
        { ...base, h: (base.h + 240) % 360 },
        // Variations
        { ...base, l: Math.min(95, base.l + 30) },
        { h: (base.h + 120) % 360, s: base.s, l: Math.max(15, base.l - 20) },
      ];
      break;
    case HarmonyType.TETRADIC:
      hsls = [
        base,
        { ...base, h: (base.h + 60) % 360 },
        { ...base, h: (base.h + 180) % 360 },
        { ...base, h: (base.h + 240) % 360 },
        { ...base, l: Math.min(95, base.l + 20) }, // Variation of base
      ];
      break;
    case HarmonyType.SQUARE:
      hsls = [
        base,
        { ...base, h: (base.h + 90) % 360 },
        { ...base, h: (base.h + 180) % 360 },
        { ...base, h: (base.h + 270) % 360 },
        { h: (base.h + 90) % 360, s: base.s, l: Math.min(90, base.l + 20) }, // Variation
      ];
      break;
    case HarmonyType.HEXAGONAL:
      hsls = [
        base,
        { ...base, h: (base.h + 60) % 360 },
        { ...base, h: (base.h + 120) % 360 },
        { ...base, h: (base.h + 180) % 360 },
        { ...base, h: (base.h + 240) % 360 },
        { ...base, h: (base.h + 300) % 360 },
      ];
      break;
    default:
      hsls = [base];
  }

  return hsls.map((hsl) => ({
    hsl,
    hex: hslToHex(hsl),
  }));
}