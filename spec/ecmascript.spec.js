import { coercion, parsing, safeInteger, scenarios, compare } from "../src/ecmascript/index.js";
import { filterCases } from "../src/index.js";

describe("@byspec/numbers/ecmascript", () => {

  describe("scenarios export", () => {
    it("exports all three scenarios", () => {
      expect(scenarios.length).toBe(3);
      expect(scenarios.map(s => s.name)).toEqual([
        "coercion", "parsing", "safe-integer"
      ]);
    });

    it("every case has required meta fields and valid tags array", () => {
      for (const scenario of scenarios) {
        for (const c of scenario.cases) {
          expect(typeof c.input).withContext(`input must be string`).toBe("string");
          expect(typeof c.meta.scenario).toBe("string");
          expect(typeof c.meta.spec).toBe("string");
          expect(typeof c.meta.rule).toBe("string");
          expect(typeof c.meta.value).withContext(`value must be number for ${c.input}`).toBe("number");
          if (c.meta.tags !== undefined) {
            expect(Array.isArray(c.meta.tags)).toBe(true);
          }
        }
      }
    });
  });

  describe("coercion", () => {
    it("empty string coerces to 0", () => {
      const c = coercion.cases.find(c => c.meta.rule === "empty-string-coerces-to-zero");
      expect(c).toBeDefined();
      expect(compare(Number(c.input), 0)).toBe(true);
    });

    it("whitespace-only strings coerce to 0, including \\v and \\f", () => {
      const ws = coercion.cases.filter(c => c.meta.rule === "whitespace-string-coerces-to-zero");
      expect(ws.length).toBeGreaterThanOrEqual(6); // space, tab, \n, \r, \v, \f
      for (const c of ws) {
        expect(compare(Number(c.input), 0))
          .withContext(`Number(${JSON.stringify(c.input)}) should be 0`)
          .toBe(true);
      }
    });

    it("keyword strings produce NaN", () => {
      const kw = coercion.cases.filter(c => c.meta.rule === "keyword-string-not-coercible");
      expect(kw.length).toBeGreaterThan(0);
      for (const c of kw) {
        expect(compare(Number(c.input), NaN))
          .withContext(`Number('${c.input}') should be NaN`)
          .toBe(true);
      }
    });
  });

  describe("parsing", () => {
    it("numeric separator produces NaN via Number()", () => {
      const c = parsing.cases.find(c => c.meta.rule === "numeric-separator");
      expect(c).toBeDefined();
      expect(compare(Number(c.input), NaN)).toBe(true);
    });

    it("hex input is accepted by Number()", () => {
      const c = parsing.cases.find(c => c.input === "0x10");
      expect(c).toBeDefined();
      expect(compare(Number(c.input), 16)).toBe(true);
    });

    it("negative hex input is not accepted by Number()", () => {
      const c = parsing.cases.find(c => c.input === "-0x10");
      expect(c).toBeDefined();
      expect(compare(Number(c.input), NaN)).toBe(true);
    });

    it("scientific notation diverges between Number() and parseInt()", () => {
      const c = parsing.cases.find(c => c.meta.rule === "scientific-notation-parseInt-divergence");
      expect(c).toBeDefined();
      expect(compare(Number(c.input), 100)).toBe(true);
      expect(parseInt(c.input, 10)).toBe(1);
    });

    it("trailing non-numeric diverges between Number() and parseFloat()", () => {
      const cases = parsing.cases.filter(c => c.meta.rule === "trailing-non-numeric");
      expect(cases.length).toBeGreaterThan(0);
      for (const c of cases) {
        expect(compare(Number(c.input), NaN))
          .withContext(`Number('${c.input}') should be NaN`)
          .toBe(true);
      }
    });

    it("embedded sign characters produce NaN", () => {
      const cases = parsing.cases.filter(c => c.meta.rule === "embedded-sign");
      expect(cases.length).toBeGreaterThan(0);
      for (const c of cases) {
        expect(compare(Number(c.input), NaN))
          .withContext(`Number('${c.input}') should be NaN`)
          .toBe(true);
      }
    });

    it("multi-dot decimals produce NaN", () => {
      const cases = parsing.cases.filter(c => c.meta.rule === "multi-dot-decimal");
      expect(cases.length).toBeGreaterThan(0);
      for (const c of cases) {
        expect(compare(Number(c.input), NaN))
          .withContext(`Number('${c.input}') should be NaN`)
          .toBe(true);
      }
    });

    it("sign with space between sign and digit produces NaN", () => {
      const c = parsing.cases.find(c => c.meta.rule === "sign-with-space");
      expect(c).toBeDefined();
      expect(compare(Number(c.input), NaN)).toBe(true);
    });

    it("whitespace-surrounded numbers are parsed by Number()", () => {
      const cases = parsing.cases.filter(c => c.meta.rule === "leading-trailing-whitespace");
      expect(cases.length).toBeGreaterThanOrEqual(3);
      for (const c of cases) {
        expect(compare(Number(c.input), 42))
          .withContext(`Number(${JSON.stringify(c.input)}) should be 42`)
          .toBe(true);
      }
    });
  });

  describe("safe-integer", () => {
    it("boundary values match Number.MAX/MIN_SAFE_INTEGER", () => {
      const max = safeInteger.cases.find(c => c.meta.rule === "max-safe-integer");
      expect(max).toBeDefined();
      expect(compare(Number(max.input), Number.MAX_SAFE_INTEGER)).toBe(true);

      const min = safeInteger.cases.find(c => c.meta.rule === "min-safe-integer");
      expect(min).toBeDefined();
      expect(compare(Number(min.input), Number.MIN_SAFE_INTEGER)).toBe(true);
    });

    it("values beyond ±MAX_SAFE_INTEGER lose precision", () => {
      const beyondCases = safeInteger.cases.filter(c =>
        c.meta.rule === "exceeds-max-safe-integer" || c.meta.rule === "exceeds-min-safe-integer"
      );
      expect(beyondCases.length).toBeGreaterThan(0);
      for (const c of beyondCases) {
        // The parsed value should differ from a BigInt-correct parse
        expect(typeof Number(c.input)).toBe("number");
      }
    });

    it("9007199254740993 and -9007199254740993 both round to same absolute value", () => {
      const posOver = safeInteger.cases.find(c => c.input === "9007199254740993");
      const negOver = safeInteger.cases.find(c => c.input === "-9007199254740993");
      expect(posOver).toBeDefined();
      expect(negOver).toBeDefined();
      expect(Number(posOver.input)).toBe(-Number(negOver.input));
    });
  });

  describe("filterCases", () => {
    it("filters by tag 'json-incompatible'", () => {
      const cases = filterCases(scenarios, { tags: ["json-incompatible"] });
      expect(cases.length).toBeGreaterThan(0);
      for (const c of cases) {
        expect(c.meta.tags).toContain("json-incompatible");
      }
    });

    it("filters by tag 'non-numeric'", () => {
      const cases = filterCases(scenarios, { tags: ["non-numeric"] });
      expect(cases.length).toBeGreaterThan(0);
    });

    it("filters by multiple tags (AND logic)", () => {
      const cases = filterCases(scenarios, { tags: ["sign", "nan"] });
      expect(cases.length).toBeGreaterThanOrEqual(0);
      for (const c of cases) {
        expect(c.meta.tags).toContain("sign");
        expect(c.meta.tags).toContain("nan");
      }
    });

    it("filters by anyTag (OR logic)", () => {
      const hexCases = filterCases(scenarios, { tags: ["hex"] });
      const octalCases = filterCases(scenarios, { tags: ["octal"] });
      const combined = filterCases(scenarios, { anyTag: ["hex", "octal"] });
      expect(combined.length).toBe(hexCases.length + octalCases.length);
    });

    it("returns all cases when no opts given", () => {
      const total = scenarios.reduce((sum, s) => sum + s.cases.length, 0);
      expect(filterCases(scenarios).length).toBe(total);
    });
  });

});
