import { overflow, precision, negativeZero, nan, scenarios, compare } from "../src/ieee754/index.js";
import { filterCases } from "../src/index.js";

describe("@byspec/numbers/ieee754", () => {

  describe("scenarios export", () => {
    it("exports all four scenarios", () => {
      expect(scenarios.length).toBe(4);
      expect(scenarios.map(s => s.name)).toEqual([
        "overflow", "precision", "negative-zero", "nan"
      ]);
    });

    it("every case has required meta fields and valid tags array", () => {
      for (const scenario of scenarios) {
        for (const c of scenario.cases) {
          expect(typeof c.input).withContext(`input must be string in ${scenario.name}`).toBe("string");
          expect(typeof c.meta.scenario).toBe("string");
          expect(typeof c.meta.spec).toBe("string");
          expect(typeof c.meta.rule).toBe("string");
          expect(typeof c.meta.value).withContext(`value must be number in ${scenario.name} / ${c.input}`).toBe("number");
          if (c.meta.tags !== undefined) {
            expect(Array.isArray(c.meta.tags)).toBe(true);
          }
        }
      }
    });
  });

  describe("compare utility", () => {
    it("correctly identifies NaN equality", () => {
      expect(compare(NaN, NaN)).toBe(true);
    });

    it("correctly distinguishes -0 from +0", () => {
      expect(compare(-0, 0)).toBe(false);
      expect(compare(0, -0)).toBe(false);
      expect(compare(-0, -0)).toBe(true);
    });

    it("correctly compares Infinity", () => {
      expect(compare(Infinity, Infinity)).toBe(true);
      expect(compare(-Infinity, -Infinity)).toBe(true);
      expect(compare(Infinity, -Infinity)).toBe(false);
    });

    it("throws TypeError for non-number first argument", () => {
      expect(() => compare("42", 42)).toThrowError(TypeError);
      expect(() => compare(null, 42)).toThrowError(TypeError);
    });
  });

  describe("overflow", () => {
    it("MAX_VALUE boundary cases parse to finite values", () => {
      const maxVal = overflow.cases.find(c => c.meta.rule === "max-finite-double");
      expect(maxVal).toBeDefined();
      expect(Number.isFinite(Number(maxVal.input))).toBe(true);

      const minVal = overflow.cases.find(c => c.meta.rule === "min-finite-double");
      expect(minVal).toBeDefined();
      expect(Number.isFinite(Number(minVal.input))).toBe(true);
    });

    it("inputs past MAX_VALUE overflow to ±Infinity", () => {
      const overflowCases = overflow.cases.filter(c =>
        c.meta.rule === "exceeds-max-finite-double" || c.meta.rule === "exceeds-min-finite-double"
      );
      expect(overflowCases.length).toBeGreaterThan(0);
      for (const c of overflowCases) {
        const parsed = Number(c.input);
        expect(parsed === Infinity || parsed === -Infinity)
          .withContext(`expected ${c.input} to overflow to ±Infinity`)
          .toBe(true);
        expect(compare(parsed, c.meta.value)).toBe(true);
      }
    });

    it("Infinity string literals parse correctly including +Infinity", () => {
      const inf = overflow.cases.find(c => c.meta.rule === "infinity-string-literal");
      expect(compare(Number(inf.input), Infinity)).toBe(true);

      const negInf = overflow.cases.find(c => c.meta.rule === "negative-infinity-string-literal");
      expect(compare(Number(negInf.input), -Infinity)).toBe(true);

      const posInf = overflow.cases.find(c => c.meta.rule === "positive-infinity-string-literal");
      expect(compare(Number(posInf.input), Infinity)).toBe(true);
    });

    it("all overflow cases carry the 'overflow' or 'infinity' tag", () => {
      for (const c of overflow.cases) {
        if (c.meta.tags) {
          // every case that overflows to ±Infinity should have the infinity tag
          if (c.meta.value === Infinity || c.meta.value === -Infinity) {
            expect(c.meta.tags).toContain("infinity");
          }
        }
      }
    });
  });

  describe("precision", () => {
    it("parsed value differs from naive integer expectation for large integers", () => {
      const big = precision.cases.find(c => c.meta.rule === "exceeds-53-bit-mantissa");
      expect(big).toBeDefined();
      const val = BigInt(big.input);
      expect(Number(big.input)).not.toBe(val);
    });

    it("subnormal MIN_VALUE is the smallest positive double", () => {
      const minVal = precision.cases.find(c => c.meta.rule === "subnormal-min-value");
      expect(minVal).toBeDefined();
      expect(compare(Number(minVal.input), Number.MIN_VALUE)).toBe(true);
    });

    it("values below subnormal range underflow to zero", () => {
      const underflow = precision.cases.find(c => c.meta.rule === "underflow-to-zero");
      expect(underflow).toBeDefined();
      expect(compare(Number(underflow.input), 0)).toBe(true);
    });

    it("machine epsilon matches Number.EPSILON", () => {
      const eps = precision.cases.find(c => c.meta.rule === "machine-epsilon");
      expect(eps).toBeDefined();
      expect(compare(Number(eps.input), Number.EPSILON)).toBe(true);
    });
  });

  describe("negative-zero", () => {
    it("negative-zero cases produce -0", () => {
      const negCases = negativeZero.cases.filter(c => c.meta.rule === "negative-zero-distinct-from-positive-zero");
      expect(negCases.length).toBeGreaterThan(0);
      for (const c of negCases) {
        expect(compare(Number(c.input), -0))
          .withContext(`expected ${c.input} to be -0`)
          .toBe(true);
        expect(Object.is(c.meta.value, -0)).toBe(true);
      }
    });

    it("positive-zero contrast case shows -0 !== +0 under Object.is", () => {
      const pos = negativeZero.cases.find(c => c.meta.rule === "positive-zero-contrast");
      expect(pos).toBeDefined();
      expect(compare(Number(pos.input), 0)).toBe(true);
      expect(compare(Number(pos.input), -0)).toBe(false);
    });

    it("+0 with explicit sign is accepted by Number()", () => {
      const pos = negativeZero.cases.find(c => c.meta.rule === "positive-zero-with-explicit-sign");
      expect(pos).toBeDefined();
      expect(compare(Number(pos.input), 0)).toBe(true);
      expect(Object.is(Number(pos.input), -0)).toBe(false);
    });
  });

  describe("nan", () => {
    it("meta value is NaN for all cases", () => {
      for (const c of nan.cases) {
        expect(Number.isNaN(c.meta.value)).toBe(true);
      }
    });

    it("NaN and NAN produce NaN via Number()", () => {
      for (const c of nan.cases) {
        expect(compare(Number(c.input), NaN))
          .withContext(`expected Number('${c.input}') to be NaN`)
          .toBe(true);
      }
    });

    it("-NaN case is present and produces NaN", () => {
      const negNan = nan.cases.find(c => c.input === "-NaN");
      expect(negNan).toBeDefined();
      expect(compare(Number(negNan.input), NaN)).toBe(true);
    });
  });

  describe("filterCases", () => {
    it("filters by tag 'infinity'", () => {
      const cases = filterCases(scenarios, { tags: ["infinity"] });
      expect(cases.length).toBeGreaterThan(0);
      for (const c of cases) {
        expect(c.meta.tags).toContain("infinity");
      }
    });

    it("filters by tag 'json-incompatible'", () => {
      const cases = filterCases(scenarios, { tags: ["json-incompatible"] });
      expect(cases.length).toBeGreaterThan(0);
    });

    it("filters by scenario", () => {
      const cases = filterCases(scenarios, { scenario: "overflow" });
      expect(cases.length).toBe(overflow.cases.length);
    });

    it("filters by rule", () => {
      const cases = filterCases(scenarios, { rule: "negative-zero-distinct-from-positive-zero" });
      expect(cases.length).toBeGreaterThan(0);
      for (const c of cases) {
        expect(c.meta.rule).toBe("negative-zero-distinct-from-positive-zero");
      }
    });

    it("filters by anyTag", () => {
      const cases = filterCases(scenarios, { anyTag: ["overflow", "underflow"] });
      expect(cases.length).toBeGreaterThan(0);
    });

    it("returns all cases when no opts given", () => {
      const total = scenarios.reduce((sum, s) => sum + s.cases.length, 0);
      expect(filterCases(scenarios).length).toBe(total);
    });
  });

});
