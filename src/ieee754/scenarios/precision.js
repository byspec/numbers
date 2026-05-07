/**
 * Precision loss — values that cannot be represented exactly
 * in IEEE 754 double-precision floating point
 *
 * IEEE 754-2008 §3.3 — doubles have 52 explicit mantissa bits plus one
 * implicit, giving 53 bits total (~15–17 significant decimal digits).
 * Beyond that, values are rounded to the nearest representable double.
 */

export const precision = {
  name: "precision",
  cases: [
    // ── Inexact decimal fractions ────────────────────────────────────────────
    {
      input: "0.1",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "inexact-decimal-representation",
        tags: ["precision-loss", "json-compatible"],
        value: 0.1,
        note: "0.1 cannot be represented exactly; 0.1 + 0.2 !== 0.3 in IEEE 754"
      }
    },
    {
      input: "0.2",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "inexact-decimal-representation",
        tags: ["precision-loss", "json-compatible"],
        value: 0.2,
        note: "0.2 cannot be represented exactly"
      }
    },
    {
      input: "0.3",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "inexact-decimal-representation",
        tags: ["precision-loss", "json-compatible"],
        value: 0.3,
        note: "0.1 + 0.2 produces 0.30000000000000004, not this value"
      }
    },

    // ── Subnormal (denormalized) numbers ─────────────────────────────────────
    {
      input: "5e-324",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "subnormal-min-value",
        tags: ["subnormal", "scientific", "json-compatible"],
        value: 5e-324,
        note: "Number.MIN_VALUE — smallest positive subnormal double"
      }
    },
    {
      input: "2.5e-324",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "subnormal-rounds-to-min-value",
        tags: ["subnormal", "precision-loss", "scientific", "json-compatible"],
        value: 5e-324,
        note: "Rounds up to Number.MIN_VALUE; no smaller subnormal exists"
      }
    },
    {
      input: "1e-400",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "underflow-to-zero",
        tags: ["underflow", "scientific", "json-compatible"],
        value: 0,
        note: "Below the subnormal range — underflows to +0"
      }
    },

    // ── Large integers beyond 53-bit mantissa ────────────────────────────────
    {
      input: "9007199254740993",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "exceeds-53-bit-mantissa",
        tags: ["precision-loss", "safe-integer", "json-compatible"],
        value: 9007199254740992,
        note: "MAX_SAFE_INTEGER + 1 rounds down to MAX_SAFE_INTEGER + 1 (even rounding)"
      }
    },
    {
      input: "9999999999999999",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "exceeds-53-bit-mantissa",
        tags: ["precision-loss", "json-compatible"],
        value: 10000000000000000,
        note: "Rounds up due to mantissa limits — carries into next power of 10"
      }
    },

    // ── Machine epsilon ──────────────────────────────────────────────────────
    {
      input: "2.220446049250313e-16",
      meta: {
        scenario: "precision",
        spec: "IEEE 754-2008 §3.3",
        rule: "machine-epsilon",
        tags: ["scientific", "json-compatible"],
        value: 2.220446049250313e-16,
        note: "Number.EPSILON — smallest x where 1 + x !== 1"
      }
    }
  ]
};
