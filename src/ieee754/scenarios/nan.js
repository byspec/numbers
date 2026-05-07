/**
 * NaN — Not a Number
 *
 * IEEE 754-2008 §6.2 — NaN is the result of undefined or
 * unrepresentable operations. NaN !== NaN is always true.
 * A parser receiving "NaN" as input must decide: error or propagate?
 *
 * Note on meta.value: all cases carry NaN. Use compare(actual, NaN)
 * (which uses Object.is) to assert correctly — NaN !== NaN under ===.
 */

export const nan = {
  name: "nan",
  cases: [
    // ── NaN string literals ──────────────────────────────────────────────────
    {
      input: "NaN",
      meta: {
        scenario: "nan",
        spec: "IEEE 754-2008 §6.2",
        rule: "not-a-number-string",
        tags: ["nan", "json-incompatible", "strict-parser-reject"],
        value: NaN,
        note: "Number('NaN') → NaN; JSON.parse rejects it"
      }
    },
    {
      input: "nan",
      meta: {
        scenario: "nan",
        spec: "IEEE 754-2008 §6.2",
        rule: "not-a-number-string",
        tags: ["nan", "json-incompatible", "strict-parser-reject", "non-numeric"],
        value: NaN,
        note: "Lowercase — Number('nan') → NaN (not recognized as a number)"
      }
    },
    {
      input: "NAN",
      meta: {
        scenario: "nan",
        spec: "IEEE 754-2008 §6.2",
        rule: "not-a-number-string",
        tags: ["nan", "json-incompatible", "strict-parser-reject", "non-numeric"],
        value: NaN
      }
    },
    // ── -NaN: sign prefix on NaN ─────────────────────────────────────────────
    {
      input: "-NaN",
      meta: {
        scenario: "nan",
        spec: "IEEE 754-2008 §6.2",
        rule: "not-a-number-string",
        tags: ["nan", "sign", "json-incompatible", "strict-parser-reject", "non-numeric"],
        value: NaN,
        note: "Number('-NaN') → NaN; the negative sign does not apply to NaN"
      }
    }
  ]
};
