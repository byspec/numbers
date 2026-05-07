/**
 * @byspec/numbers — shared types, compare, and filterCases.
 *
 * For scenario data, import from the sub-paths:
 *   import { scenarios } from "@byspec/numbers/ieee754";
 *   import { scenarios } from "@byspec/numbers/ecmascript";
 */

/**
 * Tag vocabulary for filtering cases.
 *
 * Tags express cross-cutting concerns:
 *   "json-incompatible"    — JSON.parse rejects this input
 *   "json-compatible"      — JSON.parse accepts this input
 *   "infinity"             — value is ±Infinity
 *   "nan"                  — value is NaN
 *   "negative-zero"        — value is -0
 *   "precision-loss"       — exact representation is not possible
 *   "safe-integer"         — relates to MAX/MIN_SAFE_INTEGER boundary
 *   "overflow"             — exceeds IEEE 754 max finite double
 *   "underflow"            — rounds to 0 below subnormal range
 *   "subnormal"            — denormalized (below normal range)
 *   "whitespace"           — input contains leading/trailing whitespace
 *   "sign"                 — input has explicit + or - sign prefix
 *   "hex"                  — hexadecimal input (0x...)
 *   "octal"                — octal input (0o... or legacy 0...)
 *   "binary"               — binary input (0b...)
 *   "scientific"           — scientific notation (e/E)
 *   "leading-zero"         — decimal integer with leading zero(s)
 *   "multi-dot"            — more than one decimal point (invalid)
 *   "embedded-sign"        — sign character appears mid-string (invalid)
 *   "trailing-non-numeric" — valid numeric prefix with non-numeric tail
 *   "non-numeric"          — the input is definitively not a number
 *   "parser-divergence"    — Number() / parseInt() / parseFloat() disagree
 *   "strict-parser-reject" — a strict JSON-like parser must reject this
 */
export type NumberTag =
  | "json-incompatible"
  | "json-compatible"
  | "infinity"
  | "nan"
  | "negative-zero"
  | "precision-loss"
  | "safe-integer"
  | "overflow"
  | "underflow"
  | "subnormal"
  | "whitespace"
  | "sign"
  | "hex"
  | "octal"
  | "binary"
  | "scientific"
  | "leading-zero"
  | "multi-dot"
  | "embedded-sign"
  | "trailing-non-numeric"
  | "non-numeric"
  | "parser-divergence"
  | "strict-parser-reject";

/** The numeric value this case is expected to produce via Number(). */
export type NumberValue = number;

export interface NumberMeta {
  /** Scenario name this case belongs to, e.g. "overflow" */
  scenario: string;
  /** Spec document and section, e.g. "IEEE 754-2008 §3.4" */
  spec: string;
  /** Machine-readable rule identifier, e.g. "exceeds-max-finite-double" */
  rule: string;
  /**
   * The value Number() produces for this input.
   * Use `compare(actual, meta.value)` — not `===` — because NaN ≠ NaN
   * and -0 === 0 under strict equality.
   */
  value: NumberValue;
  /**
   * Classification tags for filtering.
   * A case may carry multiple tags.
   */
  tags?: NumberTag[];
  /** Optional human note for tricky or counter-intuitive cases */
  note?: string;
}

export interface NumberCase {
  /** String input to be fed to the parser under test */
  input: string;
  meta: NumberMeta;
}

export interface NumberScenario {
  name: string;
  cases: NumberCase[];
}

/**
 * Compare two numeric values correctly, handling NaN, -0, and Infinity.
 *
 * Uses Object.is semantics:
 *   compare(NaN, NaN)         → true   (unlike ===)
 *   compare(-0, 0)            → false  (unlike ===)
 *   compare(Infinity, Infinity) → true
 *
 * @throws {TypeError} if either argument is not a number
 */
export declare function compare(actual: number, expected: number): boolean;

export interface FilterOptions {
  /** Filter to cases where meta.scenario exactly matches */
  scenario?: string;
  /** Filter to cases where meta.rule exactly matches */
  rule?: string;
  /** Filter to cases that have ALL of the given tags */
  tags?: NumberTag[];
  /** Filter to cases that have AT LEAST ONE of the given tags */
  anyTag?: NumberTag | NumberTag[];
}

/**
 * Filter cases across one or more scenarios.
 *
 * @example
 * import { filterCases }  from "@byspec/numbers";
 * import { scenarios }    from "@byspec/numbers/ieee754";
 *
 * const infinityCases = filterCases(scenarios, { tags: ["infinity"] });
 * const jsonSafe      = filterCases(scenarios, { tags: ["json-compatible"] });
 */
export declare function filterCases(
  scenarios: NumberScenario[],
  opts?: FilterOptions
): NumberCase[];
