export function randomElement<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @param min min int value (inclusive)
 * @param max max int value (exclusive)
 * @returns random integer in the range specified.
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
