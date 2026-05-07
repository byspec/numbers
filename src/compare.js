/**
 * Compare two numeric values correctly, handling NaN, -0, and Infinity.
 *
 * Uses Object.is semantics:
 *   compare(NaN, NaN)   → true   (unlike ===)
 *   compare(-0, 0)      → false  (unlike ===)
 *   compare(Infinity, Infinity) → true
 *
 * @param {number} actual   - The value produced by the parser under test
 * @param {number} expected - The value from NumberCase.meta.value
 * @returns {boolean}
 * @throws {TypeError} if either argument is not a number
 */
export function compare(actual, expected) {
  if (typeof actual !== "number") {
    throw new TypeError(
      `compare() expects a number as first argument, got ${typeof actual}. ` +
      `If your parser returns a non-number for overflow/NaN cases, handle that branch before calling compare().`
    );
  }
  if (typeof expected !== "number") {
    throw new TypeError(
      `compare() expects a number as second argument, got ${typeof expected}.`
    );
  }
  return Object.is(actual, expected);
}
