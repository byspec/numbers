/**
 * @byspec/numbers/ecmascript
 *
 * ECMAScript string-to-number specification scenarios.
 */
export type { NumberValue, NumberMeta, NumberCase, NumberScenario, NumberTag, FilterOptions } from "../index.js";
export { compare } from "../index.js";

import type { NumberScenario } from "../index.js";

export declare const coercion: NumberScenario;
export declare const parsing: NumberScenario;
export declare const safeInteger: NumberScenario;

/** All ECMAScript scenarios in order: coercion, parsing, safe-integer */
export declare const scenarios: NumberScenario[];
