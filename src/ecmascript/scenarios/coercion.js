/**
 * Coercion — string inputs that produce surprising results via Number()
 *
 * ECMAScript 2024 §7.1.4 ToNumber()
 *
 * All inputs in this package are strings. Note that string coercion is
 * distinct from value coercion: Number(null) → 0, but Number("null") → NaN.
 * These cases cover the string form only, focusing on inputs a parser
 * might receive from user input or an API.
 *
 * A strict parser (e.g. one that only accepts decimal digit strings) should
 * reject most of these. Number() is intentionally permissive.
 */

export const coercion = {
  name: "coercion",
  cases: [
    // ── Whitespace inputs ────────────────────────────────────────────────────
    {
      input: "",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "empty-string-coerces-to-zero",
        tags: ["non-numeric", "strict-parser-reject", "json-incompatible"],
        value: 0,
        note: "Number('') → 0; a strict parser should treat this as non-numeric"
      }
    },
    {
      input: " ",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "whitespace-string-coerces-to-zero",
        tags: ["whitespace", "non-numeric", "strict-parser-reject", "json-incompatible"],
        value: 0,
        note: "Number(' ') → 0 (whitespace-only strings are trimmed to empty)"
      }
    },
    {
      input: "\t",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "whitespace-string-coerces-to-zero",
        tags: ["whitespace", "non-numeric", "strict-parser-reject", "json-incompatible"],
        value: 0,
        note: "Tab character is whitespace; same behavior as space"
      }
    },
    {
      input: "\n",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "whitespace-string-coerces-to-zero",
        tags: ["whitespace", "non-numeric", "strict-parser-reject", "json-incompatible"],
        value: 0,
        note: "ECMAScript §7.1.4 trims all WhiteSpace and LineTerminator chars, including \\n"
      }
    },
    {
      input: "\r",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "whitespace-string-coerces-to-zero",
        tags: ["whitespace", "non-numeric", "strict-parser-reject", "json-incompatible"],
        value: 0,
        note: "Carriage return is a LineTerminator — trimmed before parsing"
      }
    },
    {
      input: "\v",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "whitespace-string-coerces-to-zero",
        tags: ["whitespace", "non-numeric", "strict-parser-reject", "json-incompatible"],
        value: 0,
        note: "Vertical tab (U+000B) is WhiteSpace in ECMAScript — often missed by parsers"
      }
    },
    {
      input: "\f",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "whitespace-string-coerces-to-zero",
        tags: ["whitespace", "non-numeric", "strict-parser-reject", "json-incompatible"],
        value: 0,
        note: "Form feed (U+000C) is WhiteSpace in ECMAScript — often missed by parsers"
      }
    },

    // ── Boolean / keyword strings ─────────────────────────────────────────────
    {
      input: "null",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "keyword-string-not-coercible",
        tags: ["nan", "non-numeric", "strict-parser-reject"],
        value: NaN,
        note: "The string 'null' is NaN; Number(null) the value is 0 — these are different"
      }
    },
    {
      input: "undefined",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "keyword-string-not-coercible",
        tags: ["nan", "non-numeric", "strict-parser-reject"],
        value: NaN,
        note: "The string 'undefined' is NaN"
      }
    },
    {
      input: "true",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "keyword-string-not-coercible",
        tags: ["nan", "non-numeric", "strict-parser-reject"],
        value: NaN,
        note: "The string 'true' is NaN; Number(true) the value is 1"
      }
    },
    {
      input: "false",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "keyword-string-not-coercible",
        tags: ["nan", "non-numeric", "strict-parser-reject"],
        value: NaN,
        note: "The string 'false' is NaN; Number(false) the value is 0"
      }
    },

    // ── Punctuation / structure strings ──────────────────────────────────────
    {
      input: "[]",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "non-numeric-string-not-coercible",
        tags: ["nan", "non-numeric", "strict-parser-reject"],
        value: NaN,
        note: "Not a numeric string; Number([]) the value is 0 via empty-array → empty-string path"
      }
    },
    {
      input: "{}",
      meta: {
        scenario: "coercion",
        spec: "ECMAScript 2024 §7.1.4",
        rule: "non-numeric-string-not-coercible",
        tags: ["nan", "non-numeric", "strict-parser-reject"],
        value: NaN
      }
    }
  ]
};
