/**
 * Negative zero — IEEE 754 distinguishes -0 from +0
 *
 * IEEE 754-2008 §6.3 — negative zero is a distinct bit pattern.
 * In ECMAScript, -0 === 0 is true, but Object.is(-0, 0) is false.
 * Many parsers silently normalize -0 to 0, which can be a bug.
 *
 * Use compare(actual, meta.value) to correctly distinguish -0 from +0.
 */

export const negativeZero = {
  name: "negative-zero",
  cases: [
    // ── Inputs that produce -0 ───────────────────────────────────────────────
    {
      input: "-0",
      meta: {
        scenario: "negative-zero",
        spec: "IEEE 754-2008 §6.3",
        rule: "negative-zero-distinct-from-positive-zero",
        tags: ["negative-zero", "sign", "json-compatible"],
        value: -0
      }
    },
    {
      input: "-0.0",
      meta: {
        scenario: "negative-zero",
        spec: "IEEE 754-2008 §6.3",
        rule: "negative-zero-distinct-from-positive-zero",
        tags: ["negative-zero", "sign", "json-compatible"],
        value: -0
      }
    },
    {
      input: "-0e0",
      meta: {
        scenario: "negative-zero",
        spec: "IEEE 754-2008 §6.3",
        rule: "negative-zero-distinct-from-positive-zero",
        tags: ["negative-zero", "sign", "scientific", "json-incompatible"],
        value: -0,
        note: "Scientific notation with -0 mantissa; JSON.parse rejects this"
      }
    },
    {
      input: "-0e1",
      meta: {
        scenario: "negative-zero",
        spec: "IEEE 754-2008 §6.3",
        rule: "negative-zero-distinct-from-positive-zero",
        tags: ["negative-zero", "sign", "scientific", "json-incompatible"],
        value: -0,
        note: "Scaling -0 by any positive power still yields -0"
      }
    },
    {
      input: "-0e-1",
      meta: {
        scenario: "negative-zero",
        spec: "IEEE 754-2008 §6.3",
        rule: "negative-zero-distinct-from-positive-zero",
        tags: ["negative-zero", "sign", "scientific", "json-incompatible"],
        value: -0,
        note: "Scaling -0 by a negative exponent still yields -0"
      }
    },

    // ── Explicit +0 ──────────────────────────────────────────────────────────
    {
      input: "+0",
      meta: {
        scenario: "negative-zero",
        spec: "IEEE 754-2008 §6.3",
        rule: "positive-zero-with-explicit-sign",
        tags: ["sign", "json-incompatible", "strict-parser-reject"],
        value: 0,
        note: "Number('+0') → +0; JSON.parse rejects the explicit + sign"
      }
    },

    // ── Contrast: +0 is distinct from -0 under Object.is ────────────────────
    {
      input: "0",
      meta: {
        scenario: "negative-zero",
        spec: "IEEE 754-2008 §6.3",
        rule: "positive-zero-contrast",
        tags: ["json-compatible"],
        value: 0,
        note: "0 === -0 is true, but Object.is(0, -0) is false — use compare() to distinguish"
      }
    }
  ]
};
