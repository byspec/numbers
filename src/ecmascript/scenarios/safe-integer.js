/**
 * Safe integer boundaries
 *
 * ECMAScript 2024 §21.1.2.6 — Number.MAX_SAFE_INTEGER = 2^53 - 1 = 9007199254740991
 * Integers beyond ±MAX_SAFE_INTEGER cannot be represented exactly as doubles.
 * Operations on them may silently produce wrong results with no error thrown.
 *
 * For exact integer arithmetic beyond this range, use BigInt.
 */

export const safeInteger = {
  name: "safe-integer",
  cases: [
    // ── Boundary values (last safe integers) ─────────────────────────────────
    {
      input: "9007199254740991",
      meta: {
        scenario: "safe-integer",
        spec: "ECMAScript 2024 §21.1.2.6",
        rule: "max-safe-integer",
        tags: ["safe-integer", "json-compatible"],
        value: 9007199254740991,
        note: "Number.MAX_SAFE_INTEGER — last integer representable exactly"
      }
    },
    {
      input: "-9007199254740991",
      meta: {
        scenario: "safe-integer",
        spec: "ECMAScript 2024 §21.1.2.6",
        rule: "min-safe-integer",
        tags: ["safe-integer", "sign", "json-compatible"],
        value: -9007199254740991,
        note: "Number.MIN_SAFE_INTEGER — most negative integer representable exactly"
      }
    },

    // ── First values past the boundary ───────────────────────────────────────
    {
      input: "9007199254740992",
      meta: {
        scenario: "safe-integer",
        spec: "ECMAScript 2024 §21.1.2.6",
        rule: "exceeds-max-safe-integer",
        tags: ["safe-integer", "precision-loss", "json-compatible"],
        value: 9007199254740992,
        note: "MAX_SAFE_INTEGER + 1; still representable, but no longer unique"
      }
    },
    {
      input: "9007199254740993",
      meta: {
        scenario: "safe-integer",
        spec: "ECMAScript 2024 §21.1.2.6",
        rule: "exceeds-max-safe-integer",
        tags: ["safe-integer", "precision-loss", "json-compatible"],
        value: 9007199254740992,
        note: "Rounds down to MAX_SAFE_INTEGER + 1; distinct integer value is lost"
      }
    },
    {
      input: "-9007199254740992",
      meta: {
        scenario: "safe-integer",
        spec: "ECMAScript 2024 §21.1.2.6",
        rule: "exceeds-min-safe-integer",
        tags: ["safe-integer", "precision-loss", "sign", "json-compatible"],
        value: -9007199254740992,
        note: "MIN_SAFE_INTEGER - 1; still representable exactly at this step"
      }
    },
    {
      input: "-9007199254740993",
      meta: {
        scenario: "safe-integer",
        spec: "ECMAScript 2024 §21.1.2.6",
        rule: "exceeds-min-safe-integer",
        tags: ["safe-integer", "precision-loss", "sign", "json-compatible"],
        value: -9007199254740992,
        note: "Rounds toward zero to -(MAX_SAFE_INTEGER + 1); distinct integer value is lost"
      }
    },

    // ── Long decimal integer: Number.MIN_VALUE boundary in decimal string form
    {
      input: "5e-324",
      meta: {
        scenario: "safe-integer",
        spec: "ECMAScript 2024 §21.1.2.6",
        rule: "min-value-boundary",
        tags: ["subnormal", "scientific", "json-compatible"],
        value: 5e-324,
        note: "Number.MIN_VALUE — the smallest positive double, for reference alongside safe-integer boundary"
      }
    }
  ]
};
