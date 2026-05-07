/**
 * Filter cases across one or more scenarios by meta field values.
 *
 * @param {import('./index.js').NumberScenario[]} scenarios
 * @param {object} [opts]
 * @param {string}   [opts.scenario]  - exact match on meta.scenario
 * @param {string}   [opts.rule]      - exact match on meta.rule
 * @param {string[]} [opts.tags]      - case must include ALL of these tags
 * @param {string}   [opts.anyTag]    - case must include AT LEAST ONE of these tags (comma-separated or array)
 * @returns {import('./index.js').NumberCase[]}
 */
export function filterCases(scenarios, opts = {}) {
  const allCases = scenarios.flatMap(s => s.cases);

  return allCases.filter(c => {
    if (opts.scenario !== undefined && c.meta.scenario !== opts.scenario) return false;
    if (opts.rule !== undefined && c.meta.rule !== opts.rule) return false;

    if (opts.tags !== undefined && opts.tags.length > 0) {
      const caseTags = c.meta.tags ?? [];
      if (!opts.tags.every(t => caseTags.includes(t))) return false;
    }

    if (opts.anyTag !== undefined) {
      const wanted = Array.isArray(opts.anyTag) ? opts.anyTag : [opts.anyTag];
      const caseTags = c.meta.tags ?? [];
      if (!wanted.some(t => caseTags.includes(t))) return false;
    }

    return true;
  });
}
