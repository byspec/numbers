/**
 * @byspec/numbers/ieee754
 *
 * IEEE 754-2008 double-precision scenarios.
 */
export type { NumberValue, NumberMeta, NumberCase, NumberScenario, NumberTag, FilterOptions } from "../index.js";
export { compare } from "../index.js";

import type { NumberScenario } from "../index.js";

export declare const overflow: NumberScenario;
export declare const precision: NumberScenario;
export declare const negativeZero: NumberScenario;
export declare const nan: NumberScenario;

/** All IEEE 754 scenarios in order: overflow, precision, negative-zero, nan */
export declare const scenarios: NumberScenario[];
