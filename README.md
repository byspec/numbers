# @byspec/numbers

Spec-anchored numeric test cases for JavaScript parsers and validators.

Each case provides a **string input**, the **expected `Number()` value**, and machine-readable metadata pointing back to the exact specification clause that governs it. Consuming libraries use these cases to verify they handle every numeric edge case — and to know which ones they are deliberately skipping.

---

## Installation

```sh
npm install --save-dev @byspec/numbers
```

---

## Design contract

- **All inputs are strings.** The library is designed for testing parsers and coercers, not for testing JavaScript's own operators. Your parser receives a string; these cases provide the strings worth testing.

- **`meta.value` is always what `Number(input)` produces per spec.** It may be `NaN`, `-0`, or `±Infinity`. Never compare with `===` — always use the provided `compare()` helper.

- **What a specific library should return may differ from `meta.value`.** A library like `strnum` has options (`hex: false`, `leadingZeros: false`, `infinity: "null"`) that change its expected output. That flexibility is the library's own concern. Use this package to enumerate the spec-defined cases; decide in your own tests which ones apply.

- **Each module is independent.** Import only what your domain requires.

---

## Modules

### `@byspec/numbers/ieee754`

Covers the IEEE 754-2008 double-precision specification.

| Scenario | Description |
|---|---|
| `overflow` | Values at and beyond `Number.MAX_VALUE`; `"Infinity"`, `"-Infinity"`, `"+Infinity"` string literals |
| `precision` | Inexact decimals, subnormal numbers, 53-bit mantissa limits, `Number.EPSILON` |
| `negative-zero` | Inputs producing `-0`; `+0` contrast and explicit-sign cases |
| `nan` | String inputs producing `NaN`: `"NaN"`, `"nan"`, `"NAN"`, `"-NaN"` |

### `@byspec/numbers/ecmascript`

Covers ECMAScript 2024 number parsing and coercion rules.

| Scenario | Description |
|---|---|
| `coercion` | Empty string, whitespace variants (`\t \n \r \v \f`), keyword strings (`"null"`, `"true"`, …) |
| `parsing` | Hex/octal/binary literals, numeric separator, sign edge cases, embedded signs, multi-dot decimals, `parseInt`/`parseFloat`/`Number()` divergence |
| `safe-integer` | Boundary and beyond-boundary values around `Number.MAX_SAFE_INTEGER` |

---

## Usage

### Running all cases in a scenario

```js
import { overflow, compare } from "@byspec/numbers/ieee754";

for (const c of overflow.cases) {
  const actual = myParser(c.input);
  // compare() handles NaN, -0, and Infinity correctly — never use ===
  if (!compare(actual, c.meta.value)) {
    console.error(`FAIL [${c.meta.rule}] input="${c.input}" expected=${c.meta.value} got=${actual}`);
  }
}
```

### Iterating all scenarios at once

```js
import { scenarios, compare } from "@byspec/numbers/ieee754";
import { scenarios as ecScenarios } from "@byspec/numbers/ecmascript";

for (const scenario of [...scenarios, ...ecScenarios]) {
  for (const c of scenario.cases) {
    const actual = myParser(c.input);
    if (typeof actual === "number") {
      expect(compare(actual, c.meta.value)).toBe(true);
    }
    // If your parser returns a non-number (string passthrough, null, etc.)
    // for some cases, handle that branch before calling compare()
  }
}
```

### Filtering cases by tag

The `filterCases` utility lets you select cases across scenarios by tag, rule, or scenario name without writing `.filter()` manually.

```js
import { filterCases }  from "@byspec/numbers";
import { scenarios }    from "@byspec/numbers/ieee754";
import { scenarios as ecScenarios } from "@byspec/numbers/ecmascript";

const all = [...scenarios, ...ecScenarios];

// Only cases JSON.parse accepts — safe for a strict JSON parser
const jsonSafe = filterCases(all, { tags: ["json-compatible"] });

// Cases a strict parser must reject
const shouldReject = filterCases(all, { tags: ["strict-parser-reject"] });

// All infinity cases (overflow and string literals)
const infinityCases = filterCases(all, { tags: ["infinity"] });

// Anything hex, octal, or binary (OR logic)
const baseCases = filterCases(all, { anyTag: ["hex", "octal", "binary"] });

// All cases in one scenario by name
const overflowCases = filterCases(scenarios, { scenario: "overflow" });

// By specific rule
const embeddedSigns = filterCases(all, { rule: "embedded-sign" });
```

### Filtering cases by rule — direct array approach

The `cases` array is a plain array, so `.filter()` and `.find()` work directly too:

```js
import { overflow } from "@byspec/numbers/ieee754";

const infinityCases = overflow.cases.filter(c => c.meta.value === Infinity);
const maxVal = overflow.cases.find(c => c.meta.rule === "max-finite-double");
```

### Handling cases where your parser intentionally diverges

```js
import { parsing, compare } from "@byspec/numbers/ecmascript";

// A strict decimal-only parser: hex, octal, binary inputs should be rejected
const strictRejectRules = new Set(["hexadecimal-literal", "octal-literal", "binary-literal"]);

for (const c of parsing.cases) {
  if (strictRejectRules.has(c.meta.rule)) {
    // My parser returns the input as-is (not a number)
    expect(typeof myStrictParser(c.input)).toBe("string");
  } else {
    const actual = myStrictParser(c.input);
    if (typeof actual === "number") {
      expect(compare(actual, c.meta.value)).toBe(true);
    }
  }
}
```

---

## `compare(actual, expected)`

Exported from all entry points. Uses `Object.is` semantics:

```js
import { compare } from "@byspec/numbers";
// also re-exported from both submodules:
// import { compare } from "@byspec/numbers/ieee754";
// import { compare } from "@byspec/numbers/ecmascript";

compare(NaN, NaN)            // true  — unlike ===
compare(-0, 0)               // false — unlike ===
compare(-0, -0)              // true
compare(Infinity, Infinity)  // true
compare(1, 1)                // true
```

**Both arguments must be JavaScript `number` values.** If your parser returns a string, `null`, or `BigInt` for some inputs, check `typeof actual === "number"` before calling `compare`. The function throws a `TypeError` for non-number arguments so you don't silently get a wrong result.

---

## `filterCases(scenarios, opts?)`

```js
import { filterCases } from "@byspec/numbers";
```

**Parameters**

| Option | Type | Logic | Description |
|---|---|---|---|
| `scenario` | `string` | exact match | Filter by `meta.scenario` name |
| `rule` | `string` | exact match | Filter by `meta.rule` identifier |
| `tags` | `string[]` | ALL must match | Case must carry every tag listed |
| `anyTag` | `string \| string[]` | ANY must match | Case must carry at least one of the tags |

Omit `opts` (or pass `{}`) to get all cases across all provided scenarios.

---

## Tags

Every case carries `meta.tags: string[]`. The full tag vocabulary:

| Tag | Meaning |
|---|---|
| `json-compatible` | `JSON.parse` accepts this input |
| `json-incompatible` | `JSON.parse` rejects this input |
| `strict-parser-reject` | A strict decimal-only parser should reject this |
| `infinity` | Value is `±Infinity` |
| `nan` | Value is `NaN` |
| `negative-zero` | Value is `-0` |
| `overflow` | Exceeds IEEE 754 max finite double |
| `underflow` | Rounds to `0` below subnormal range |
| `subnormal` | Denormalized value (below normal range) |
| `precision-loss` | Exact representation is not possible |
| `safe-integer` | Relates to `MAX_SAFE_INTEGER` boundary |
| `whitespace` | Input contains leading/trailing whitespace |
| `sign` | Input has explicit `+` or `-` prefix |
| `hex` | Hexadecimal input (`0x…`) |
| `octal` | Octal input (`0o…` or legacy `0…`) |
| `binary` | Binary input (`0b…`) |
| `scientific` | Scientific notation (`e`/`E`) |
| `leading-zero` | Decimal integer with leading zero(s) |
| `multi-dot` | More than one decimal point (invalid) |
| `embedded-sign` | Sign character appears mid-string (invalid) |
| `trailing-non-numeric` | Valid numeric prefix with non-numeric tail |
| `non-numeric` | Definitively not a number string |
| `parser-divergence` | `Number()`, `parseInt()`, `parseFloat()` disagree |

---

## TypeScript

Types are exported from each entry point:

```ts
import type { NumberCase, NumberScenario, NumberMeta, NumberTag, FilterOptions }
  from "@byspec/numbers";
```

Key types:

```ts
interface NumberMeta {
  scenario: string;       // e.g. "overflow"
  spec: string;           // e.g. "IEEE 754-2008 §3.4"
  rule: string;           // e.g. "exceeds-max-finite-double"
  value: number;          // may be NaN, -0, Infinity — always use compare()
  tags?: NumberTag[];     // cross-cutting classification
  note?: string;          // human explanation for tricky cases
}

interface NumberCase {
  input: string;          // always a string — feed to your parser
  meta: NumberMeta;
}

interface FilterOptions {
  scenario?: string;
  rule?: string;
  tags?: NumberTag[];
  anyTag?: NumberTag | NumberTag[];
}
```

---

## Specification references

- [IEEE 754-2008](https://ieeexplore.ieee.org/document/4610935) — §3.3 (precision), §3.4 (range/overflow), §6.2 (NaN), §6.3 (signed zero)
- [ECMAScript 2024 §7.1.4](https://tc39.es/ecma262/#sec-tonumber) — `ToNumber()`
- [ECMAScript 2024 §7.1.4.1](https://tc39.es/ecma262/#sec-stringtonumber) — `StringToNumber`
- [ECMAScript 2024 §21.1.2.6](https://tc39.es/ecma262/#sec-number.max_safe_integer) — `Number.MAX_SAFE_INTEGER`