export { overflow }     from "./scenarios/overflow.js";
export { precision }    from "./scenarios/precision.js";
export { negativeZero } from "./scenarios/negative-zero.js";
export { nan }          from "./scenarios/nan.js";
export { compare }      from "../compare.js";

import { overflow }     from "./scenarios/overflow.js";
import { precision }    from "./scenarios/precision.js";
import { negativeZero } from "./scenarios/negative-zero.js";
import { nan }          from "./scenarios/nan.js";

/** All IEEE 754 scenarios, in order: overflow, precision, negative-zero, nan */
export const scenarios = [overflow, precision, negativeZero, nan];
