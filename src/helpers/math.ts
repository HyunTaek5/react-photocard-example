export function clamp(val: number, min = 0, max = 100): number {
  return Math.min(Math.max(val, min), max);
}

export function round(val: number): number {
  return Math.round(val);
}

/**
 * remaps a number from one range to another
 * @param val current value
 * @param inMin input min
 * @param inMax input max
 * @param outMin output min
 * @param outMax output max
 */
export function adjust(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
