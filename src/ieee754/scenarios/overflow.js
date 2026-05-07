/**
 * Overflow — values that exceed IEEE 754 double-precision range
 *
 * IEEE 754-2008 §3.4 — the largest finite double is (2 − 2^−52) × 2^1023,
 * approximately 1.7976931348623157e+308. Values beyond this overflow to
 * ±Infinity. The boundary itself (Number.MAX_VALUE) is the last valid finite.
 */

export const overflow = {
  name: "overflow",
  cases: [
    // ── Largest finite double ────────────────────────────────────────────────
    {
      input: "1.7976931348623157e+308",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "max-finite-double",
        tags: ["json-compatible"],
        value: 1.7976931348623157e+308,
        note: "Number.MAX_VALUE — the largest representable finite double"
      }
    },
    {
      input: "-1.7976931348623157e+308",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "min-finite-double",
        tags: ["json-compatible", "sign"],
        value: -1.7976931348623157e+308,
        note: "-Number.MAX_VALUE — the most negative representable finite double"
      }
    },

    // ── One ULP below overflow boundary (last finite, heading toward it) ────
    {
      input: "1.7976931348623155e+308",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "one-ulp-below-max-finite-double",
        tags: ["json-compatible"],
        value: 1.7976931348623155e+308,
        note: "One ULP below MAX_VALUE; still finite"
      }
    },

    // ── First values past the boundary → Infinity ────────────────────────────
    {
      input: "1.7976931348623159e+308",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "exceeds-max-finite-double",
        tags: ["overflow", "infinity", "json-incompatible", "strict-parser-reject"],
        value: Infinity,
        note: "One ULP past MAX_VALUE, overflows to +Infinity"
      }
    },
    {
      input: "-1.7976931348623159e+308",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "exceeds-min-finite-double",
        tags: ["overflow", "infinity", "sign", "json-incompatible", "strict-parser-reject"],
        value: -Infinity,
        note: "One ULP past -MAX_VALUE, overflows to -Infinity"
      }
    },

    // ── Clearly out-of-range ─────────────────────────────────────────────────
    {
      input: "1.8e+309",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "exceeds-max-finite-double",
        tags: ["overflow", "infinity", "scientific", "json-incompatible", "strict-parser-reject"],
        value: Infinity
      }
    },
    {
      input: "-1.8e+309",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "exceeds-min-finite-double",
        tags: ["overflow", "infinity", "sign", "scientific", "json-incompatible", "strict-parser-reject"],
        value: -Infinity
      }
    },
    {
      input: "9.9e+999",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "exceeds-max-finite-double",
        tags: ["overflow", "infinity", "scientific", "json-incompatible", "strict-parser-reject"],
        value: Infinity
      }
    },
    {
      input: "-9.9e+999",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "exceeds-min-finite-double",
        tags: ["overflow", "infinity", "sign", "scientific", "json-incompatible", "strict-parser-reject"],
        value: -Infinity
      }
    },

    // ── Infinity as a string literal ─────────────────────────────────────────
    {
      input: "Infinity",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "infinity-string-literal",
        tags: ["infinity", "json-incompatible", "strict-parser-reject"],
        value: Infinity,
        note: "Number() accepts 'Infinity'; JSON.parse rejects it"
      }
    },
    {
      input: "-Infinity",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "negative-infinity-string-literal",
        tags: ["infinity", "sign", "json-incompatible", "strict-parser-reject"],
        value: -Infinity,
        note: "Number() accepts '-Infinity'; JSON.parse rejects it"
      }
    },
    {
      input: "+Infinity",
      meta: {
        scenario: "overflow",
        spec: "IEEE 754-2008 §3.4",
        rule: "positive-infinity-string-literal",
        tags: ["infinity", "sign", "json-incompatible", "strict-parser-reject"],
        value: Infinity,
        note: "Number() accepts '+Infinity'; JSON.parse rejects it"
      }
    }
  ]
};
