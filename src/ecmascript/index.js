export { coercion }    from "./scenarios/coercion.js";
export { parsing }     from "./scenarios/parsing.js";
export { safeInteger } from "./scenarios/safe-integer.js";
export { compare }     from "../compare.js";

import { coercion }    from "./scenarios/coercion.js";
import { parsing }     from "./scenarios/parsing.js";
import { safeInteger } from "./scenarios/safe-integer.js";

/** All ECMAScript scenarios, in order: coercion, parsing, safe-integer */
export const scenarios = [coercion, parsing, safeInteger];
