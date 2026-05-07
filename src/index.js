/**
 * @byspec/numbers — root entry point
 *
 * Re-exports the shared utilities. For scenario data, import from the
 * sub-paths directly:
 *
 *   import { scenarios, compare } from "@byspec/numbers/ieee754";
 *   import { scenarios, compare } from "@byspec/numbers/ecmascript";
 *   import { filterCases }       from "@byspec/numbers";
 */
export { compare }     from "./compare.js";
export { filterCases } from "./filter.js";
