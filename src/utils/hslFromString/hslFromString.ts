/* eslint-disable no-restricted-syntax */
/* eslint-disable no-bitwise */
type Theme = 'light' | 'dark'

/**
 * FNV-1a 32-bit hash over Unicode code points (stable across JS engines).
 * Produces an unsigned 32-bit integer.
 */
const fnv1a32 = (str: string): number => {
  let h = 0x811c9dc5 // offset basis
  for (const ch of str) {
    h ^= ch.codePointAt(0)!
    // multiply by FNV prime (mod 2^32)
    h = (h >>> 0) * 0x01000193
  }
  return h >>> 0
}

/** Map an unsigned int to an inclusive integer range [min, max]. */
const pickInRange = (u32: number, min: number, max: number): number => min + (u32 % (max - min + 1))

/**
 * Deterministic, functional mapper from (value, theme) -> HSL string.
 * - Hue spans full 0..359 based on a stable FNV-1a hash of the string.
 * - Saturation/Lightness are derived from disjoint hash segments and
 *   constrained to your specified ranges per theme.
 */
export const hslFromString: (value: string, theme: Theme) => string = (value, theme) => {
  const hash = fnv1a32(value)

  const hue = hash % 345

  const [sMin, sMax] = theme === 'light' ? [90, 100] : [78, 80]
  const [lMin, lMax] = theme === 'light' ? [78, 80] : [25, 35]

  const s = pickInRange(hash >>> 8, sMin, sMax) // use different hash bits for S
  const l = pickInRange(hash >>> 16, lMin, lMax) // and for L

  return `hsl(${hue}, ${s}%, ${l}%)`
}

// --- usage ---
/*
hslFromString('alice@example.com', 'light'); // e.g. "hsl(123, 8%, 92%)"
hslFromString('alice@example.com', 'dark');  // e.g. "hsl(123, 12%, 21%)"
*/
