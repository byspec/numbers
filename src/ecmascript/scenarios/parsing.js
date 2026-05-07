/**
 * Parsing — edge cases in string-to-number parsing
 *
 * ECMAScript 2024 §7.1.4.1 StringToNumber
 *
 * Covers Number(), parseInt(), and parseFloat() divergence.
 * A parser like strnum, fast-json-parse, or a validation library must
 * decide which of these inputs to accept or reject.
 *
 * Key divergences documented per case:
 *   Number()     — permissive; accepts hex, octal, binary, whitespace, Infinity
 *   parseInt()   — stops at first non-digit; ignores trailing non-numerics
 *   parseFloat() — stops at first non-numeric; accepts leading sign and dot
 *   JSON.parse() — strict; rejects leading zeros, Infinity, explicit +, hex
 */

export const parsing = {
  name: "parsing",
  cases: [
    // ── Numeric bases ────────────────────────────────────────────────────────
    {
      input: "0x10",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "hexadecimal-literal",
        tags: ["hex", "json-incompatible", "strict-parser-reject"],
        value: 16,
        note: "Number() and parseInt() accept hex; JSON.parse rejects it"
      }
    },
    {
      input: "-0x10",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "hexadecimal-literal",
        tags: ["hex", "sign", "json-incompatible", "strict-parser-reject"],
        value: -16,
        note: "Negative hex literal; Number() accepts it"
      }
    },
    {
      input: "0o10",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "octal-literal",
        tags: ["octal", "json-incompatible", "strict-parser-reject"],
        value: 8,
        note: "Number() accepts ES6 octal; parseInt('0o10') gives 0; JSON.parse rejects"
      }
    },
    {
      input: "0b1010",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "binary-literal",
        tags: ["binary", "json-incompatible", "strict-parser-reject"],
        value: 10,
        note: "Number() accepts ES6 binary; parseInt('0b1010') gives 0; JSON.parse rejects"
      }
    },
    {
      input: "010",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "leading-zero-decimal",
        tags: ["leading-zero", "octal", "json-incompatible", "strict-parser-reject", "parser-divergence"],
        value: 10,
        note: "Number() gives 10; parseInt() gives 8 in legacy engines (octal mode); JSON.parse rejects leading zero"
      }
    },

    // ── Numeric separator ────────────────────────────────────────────────────
    {
      input: "1_000",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "numeric-separator",
        tags: ["nan", "non-numeric", "json-incompatible", "strict-parser-reject"],
        value: NaN,
        note: "Valid JS literal syntax but Number('1_000') is NaN — separators not accepted by runtime coercion"
      }
    },

    // ── Whitespace ───────────────────────────────────────────────────────────
    {
      input: " 42 ",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "leading-trailing-whitespace",
        tags: ["whitespace", "json-incompatible", "strict-parser-reject"],
        value: 42,
        note: "Number() trims whitespace before parsing; strict parsers may reject"
      }
    },
    {
      input: "\t42\t",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "leading-trailing-whitespace",
        tags: ["whitespace", "json-incompatible", "strict-parser-reject"],
        value: 42,
        note: "Tab-surrounded number — Number() trims all WhiteSpace"
      }
    },
    {
      input: "\n42\n",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "leading-trailing-whitespace",
        tags: ["whitespace", "json-incompatible", "strict-parser-reject"],
        value: 42,
        note: "Newline-surrounded — ECMAScript trims LineTerminator characters too"
      }
    },

    // ── Sign prefix ──────────────────────────────────────────────────────────
    {
      input: "+42",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "explicit-positive-sign",
        tags: ["sign", "json-incompatible", "strict-parser-reject"],
        value: 42,
        note: "Number() accepts explicit +; JSON.parse rejects it"
      }
    },
    {
      input: "+ 42",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "sign-with-space",
        tags: ["sign", "whitespace", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Space between sign and digits — Number() gives NaN"
      }
    },

    // ── Embedded / misplaced sign (invalid) ─────────────────────────────────
    {
      input: "12+12",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "embedded-sign",
        tags: ["embedded-sign", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Sign character mid-string — not a valid numeric literal"
      }
    },
    {
      input: "12-12",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "embedded-sign",
        tags: ["embedded-sign", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Minus sign mid-string — not a valid numeric literal"
      }
    },
    {
      input: "--1",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "embedded-sign",
        tags: ["embedded-sign", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Double minus — not a valid numeric string; Number('--1') → NaN"
      }
    },
    {
      input: "+-1",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "embedded-sign",
        tags: ["embedded-sign", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Consecutive sign characters — not valid"
      }
    },
    {
      input: "-+1",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "embedded-sign",
        tags: ["embedded-sign", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Consecutive sign characters, minus first — not valid"
      }
    },

    // ── Trailing non-numeric ─────────────────────────────────────────────────
    {
      input: "1.5abc",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "trailing-non-numeric",
        tags: ["trailing-non-numeric", "nan", "non-numeric", "json-incompatible", "parser-divergence"],
        value: NaN,
        note: "Number('1.5abc') → NaN; parseFloat('1.5abc') → 1.5"
      }
    },
    {
      input: "12px",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "trailing-non-numeric",
        tags: ["trailing-non-numeric", "nan", "non-numeric", "json-incompatible", "parser-divergence"],
        value: NaN,
        note: "Number('12px') → NaN; parseFloat('12px') → 12; parseInt('12px') → 12"
      }
    },
    {
      input: "1212+",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "trailing-non-numeric",
        tags: ["trailing-non-numeric", "embedded-sign", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Trailing sign character — not a valid number"
      }
    },

    // ── Multi-dot / invalid decimal format ───────────────────────────────────
    {
      input: "12.12.12",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "multi-dot-decimal",
        tags: ["multi-dot", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "More than one decimal point — not a valid number"
      }
    },
    {
      input: "20.21.030",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "multi-dot-decimal",
        tags: ["multi-dot", "nan", "non-numeric", "json-incompatible"],
        value: NaN
      }
    },
    {
      input: "0.21.",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "multi-dot-decimal",
        tags: ["multi-dot", "nan", "non-numeric", "json-incompatible"],
        value: NaN,
        note: "Trailing dot after decimal — not valid"
      }
    },

    // ── parseInt vs Number divergence ─────────────────────────────────────────
    {
      input: "1e2",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "scientific-notation-parseInt-divergence",
        tags: ["scientific", "json-compatible", "parser-divergence"],
        value: 100,
        note: "Number('1e2') → 100; parseInt('1e2') → 1 (stops at 'e')"
      }
    },
    {
      input: "1.5",
      meta: {
        scenario: "parsing",
        spec: "ECMAScript 2024 §7.1.4.1",
        rule: "decimal-parseInt-divergence",
        tags: ["json-compatible", "parser-divergence"],
        value: 1.5,
        note: "Number('1.5') → 1.5; parseInt('1.5') → 1 (integer truncation)"
      }
    }
  ]
};
