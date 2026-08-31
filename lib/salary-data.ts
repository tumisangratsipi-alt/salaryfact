// ============================================================
// SALARY PERCENTILE DATA — BLS OEWS May 2025 (real, verified)
// salaryfact.com
//
// Source: BLS Occupational Employment and Wage Statistics, May 2025
// release (the most current available as of this fix), "All Occupations"
// row (OCC_CODE 00-0000), cross-industry. National file:
// https://www.bls.gov/oes/special-requests/oesm25nat.zip
// State file: https://www.bls.gov/oes/special-requests/oesm25st.zip
// Downloaded and parsed directly, not estimated. Replaces a prior version
// of this file whose NATIONAL_MEDIAN ($59,000), percentile breakpoints,
// all 51 state medians, and all 15 JOB_CATEGORIES medians were invented
// placeholder figures, not real BLS output — audited and rebuilt
// 2026-08-31 (national/state figures first, JOB_CATEGORIES in a same-day
// follow-up pass — see that constant's own comment for its sourcing,
// which needed a second BLS file).
// ============================================================

export const NATIONAL_MEDIAN = 50980;

// Real BLS OEWS national annual wage percentiles for "All Occupations".
// OEWS's standard cross-industry table only publishes 10th/25th/median/
// 75th/90th — there is no real BLS figure for a 95th or 99th percentile
// wage in this dataset, so this file no longer invents ones. A "top 1%"
// feature would need a distinct, separately-labeled source (e.g. IRS SOI
// AGI percentiles), not a number bolted onto this table.
const NATIONAL_PERCENTILES: Record<string, number> = {
  p10: 31200,
  p25: 37590,
  p50: 50980,
  p75: 80520,
  p90: 128560,
};

// Ordered breakpoints for interpolation. Capped at the real p90 anchor —
// see the comment on NATIONAL_PERCENTILES for why there's nothing above it.
const BREAKPOINTS: Array<{ percentile: number; salary: number }> = [
  { percentile: 0, salary: 0 },
  { percentile: 10, salary: NATIONAL_PERCENTILES.p10 },
  { percentile: 25, salary: NATIONAL_PERCENTILES.p25 },
  { percentile: 50, salary: NATIONAL_PERCENTILES.p50 },
  { percentile: 75, salary: NATIONAL_PERCENTILES.p75 },
  { percentile: 90, salary: NATIONAL_PERCENTILES.p90 },
];

// Real state median annual salaries, BLS OEWS May 2025, "All Occupations".
export const STATE_MEDIAN_SALARIES: Record<string, number> = {
  AL: 45670, AK: 61000, AZ: 50060, AR: 43630, CA: 58240,
  CO: 59800, CT: 59690, DE: 52190, DC: 91540, FL: 47880,
  GA: 48170, HI: 56320, ID: 47970, IL: 51960, IN: 47860,
  IA: 48540, KS: 48010, KY: 46920, LA: 45520, ME: 51430,
  MD: 59510, MA: 63590, MI: 49270, MN: 56920, MS: 40120,
  MO: 47800, MT: 48740, NE: 48980, NV: 47660, NH: 55880,
  NJ: 58570, NM: 47210, NY: 59670, NC: 47970, ND: 52480,
  OH: 49380, OK: 45600, OR: 57000, PA: 49690, RI: 56780,
  SC: 46490, SD: 47080, TN: 47380, TX: 48620, UT: 50110,
  VT: 56390, VA: 55690, WA: 62990, WV: 45300, WI: 50270,
  WY: 50270,
};

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "Washington D.C.", FL: "Florida",
  GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana",
  IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine",
  MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin",
  WY: "Wyoming",
};

// Real BLS OEWS May 2025 medians, one per site category. These broad
// site categories don't map 1:1 onto BLS's SOC occupation taxonomy, so
// each was anchored to the closest real SOC group and documented below
// rather than left as a guessed number. Source: same national file as
// NATIONAL_MEDIAN (OCC_CODE column), plus a second real BLS file for
// "government" specifically, since government is an ownership/sector
// classification, not an occupation family — no SOC group represents it:
// https://www.bls.gov/oes/special-requests/oesm25in4.zip,
// national_owner_M2025_dl.xlsx, OWN_CODE 123 ("Federal, State, and
// Local Government... OEWS Designation"), All Occupations row.
//
//   technology     -> SOC 15-0000 Computer and Mathematical Occupations
//   healthcare     -> SOC 29-0000 Healthcare Practitioners and Technical
//                      Occupations (the professional/clinical tier —
//                      support roles sit in a separate, lower-paid SOC
//                      major group, 31-0000, not blended in here)
//   finance        -> SOC 13-2000 Financial Specialists (accountants,
//                      analysts — tighter match than the broader
//                      13-0000 Business and Financial Operations major
//                      group, which also covers HR/logistics roles)
//   education      -> SOC 25-0000 Educational Instruction and Library
//                      Occupations
//   legal          -> SOC 23-0000 Legal Occupations
//   engineering    -> SOC 17-2000 Engineers (excludes architects/
//                      drafters/surveying techs that sit in the same
//                      17-0000 major group but aren't "engineering")
//   sales          -> SOC 41-4000 Sales Representatives, Wholesale and
//                      Manufacturing — a professional B2B sales anchor,
//                      deliberately distinct from the "retail" category
//                      below. "Marketing" itself has no dedicated SOC
//                      group and isn't separately represented here.
//   management     -> SOC 11-0000 Management Occupations
//   creative       -> SOC 27-1000 Art and Design Workers (excludes
//                      athletes/entertainers/journalists that sit in
//                      the broader 27-0000 Arts/Design/Media major group)
//   trades         -> SOC 47-0000 Construction and Extraction Occupations
//   hospitality    -> SOC 35-0000 Food Preparation and Serving Related
//                      Occupations
//   retail         -> SOC 41-2000 Retail Sales Workers
//   transportation -> SOC 53-0000 Transportation and Material Moving
//                      Occupations
//   government     -> All Occupations, Federal+State+Local government
//                      ownership combined (see file/OWN_CODE note above)
//   other          -> SOC 00-0000 All Occupations (same figure as
//                      NATIONAL_MEDIAN — the honest anchor for a
//                      residual/unspecified bucket)
export const JOB_CATEGORIES: Record<string, { label: string; median: number }> = {
  technology: { label: "Technology & Software", median: 109280 },
  healthcare: { label: "Healthcare & Medical", median: 86530 },
  finance: { label: "Finance & Accounting", median: 84680 },
  education: { label: "Education & Teaching", median: 60570 },
  legal: { label: "Legal & Compliance", median: 102500 },
  engineering: { label: "Engineering", median: 108620 },
  sales: { label: "Sales & Marketing", median: 76460 },
  management: { label: "Management & Executive", median: 126520 },
  creative: { label: "Creative & Design", median: 58240 },
  trades: { label: "Trades & Construction", median: 59540 },
  hospitality: { label: "Hospitality & Food Service", median: 35050 },
  retail: { label: "Retail & Customer Service", median: 34810 },
  transportation: { label: "Transportation & Logistics", median: 44350 },
  government: { label: "Government & Public Service", median: 63390 },
  other: { label: "Other", median: 50980 },
};

export type JobCategoryKey = keyof typeof JOB_CATEGORIES;
export const JOB_CATEGORY_KEYS = Object.keys(JOB_CATEGORIES) as JobCategoryKey[];

// ============================================================
// HELPERS
// ============================================================

export function formatCurrency(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `$${Math.round(n / 1000)}K`;
  }
  return `$${n.toLocaleString("en-US")}`;
}

export function formatPercent(n: number): string {
  return `${Math.round(n)}%`;
}

// ============================================================
// CORE CALCULATIONS
// ============================================================

export function calculateNationalPercentile(salary: number): number {
  if (salary <= 0) return 0;
  // Real BLS OEWS data tops out at the 90th percentile anchor (see
  // NATIONAL_PERCENTILES above) — anything at or above it is honestly
  // "90th percentile or higher," not a fabricated 95th/99th.
  if (salary >= BREAKPOINTS[BREAKPOINTS.length - 1].salary) return 90;

  for (let i = 1; i < BREAKPOINTS.length; i++) {
    const lower = BREAKPOINTS[i - 1];
    const upper = BREAKPOINTS[i];
    if (salary <= upper.salary) {
      const ratio = (salary - lower.salary) / (upper.salary - lower.salary);
      const pct = lower.percentile + ratio * (upper.percentile - lower.percentile);
      return Math.min(99, Math.max(0, Math.round(pct)));
    }
  }
  return 99;
}

export function calculateStatePercentile(salary: number, stateCode: string): number {
  const stateMedian = STATE_MEDIAN_SALARIES[stateCode];
  if (!stateMedian) return calculateNationalPercentile(salary);

  // Scale the salary relative to state median vs national median
  const ratio = NATIONAL_MEDIAN / stateMedian;
  const adjustedSalary = salary * ratio;
  return calculateNationalPercentile(adjustedSalary);
}

export function getPercentileLabel(percentile: number): string {
  // 90 is the real ceiling calculateNationalPercentile/calculateStatePercentile
  // can return now (see BREAKPOINTS) — no fabricated tiers above it.
  if (percentile >= 90) return "Top 10%";
  if (percentile >= 75) return "Top 25%";
  if (percentile >= 60) return "Above Average";
  if (percentile >= 40) return "Average";
  if (percentile >= 25) return "Below Average";
  return "Bottom 25%";
}

export function getPercentileInsight(
  salary: number,
  percentile: number,
  stateCode: string,
  jobCategory: JobCategoryKey
): string {
  const stateName = STATE_NAMES[stateCode] ?? "your state";
  const jobLabel = JOB_CATEGORIES[jobCategory]?.label ?? "your field";
  const jobMedian = JOB_CATEGORIES[jobCategory]?.median ?? NATIONAL_MEDIAN;

  if (percentile >= 90) {
    return `You earn more than 9 in 10 American workers. In ${stateName}, your salary places you firmly in the high-earner tier.`;
  }
  if (percentile >= 75) {
    return `You outpace three-quarters of US workers. For ${jobLabel}, a salary of ${formatCurrency(salary)} is ${salary > jobMedian ? "above" : "near"} the field median of ${formatCurrency(jobMedian)}.`;
  }
  if (percentile >= 50) {
    return `You are above the national median. In ${stateName}, your earnings compare ${salary > (STATE_MEDIAN_SALARIES[stateCode] ?? NATIONAL_MEDIAN) ? "favorably" : "closely"} to the state median of ${formatCurrency(STATE_MEDIAN_SALARIES[stateCode] ?? NATIONAL_MEDIAN)}.`;
  }
  if (percentile >= 25) {
    return `You are near the national median of ${formatCurrency(NATIONAL_MEDIAN)}. The median for ${jobLabel} is ${formatCurrency(jobMedian)}.`;
  }
  return `You are below the national median. The typical ${jobLabel} worker earns ${formatCurrency(jobMedian)}. Growth in this field often comes through specialization or advancement.`;
}

// ============================================================
// MAIN EXPORT
// ============================================================

export interface SalaryResult {
  nationalPercentile: number;
  statePercentile: number;
  percentileLabel: string;
  vsNationalMedian: number;
  vsStateMedian: number;
  jobMedian: number;
  vsJobMedian: number;
  stateName: string;
  jobCategoryLabel: string;
  insight: string;
}

export function calculateSalary(
  salary: number,
  stateCode: string,
  jobCategory: JobCategoryKey
): SalaryResult {
  const nationalPercentile = calculateNationalPercentile(salary);
  const statePercentile = calculateStatePercentile(salary, stateCode);
  const percentileLabel = getPercentileLabel(nationalPercentile);
  const stateMedian = STATE_MEDIAN_SALARIES[stateCode] ?? NATIONAL_MEDIAN;
  const jobMedian = JOB_CATEGORIES[jobCategory]?.median ?? NATIONAL_MEDIAN;

  return {
    nationalPercentile,
    statePercentile,
    percentileLabel,
    vsNationalMedian: salary - NATIONAL_MEDIAN,
    vsStateMedian: salary - stateMedian,
    jobMedian,
    vsJobMedian: salary - jobMedian,
    stateName: STATE_NAMES[stateCode] ?? stateCode,
    jobCategoryLabel: JOB_CATEGORIES[jobCategory]?.label ?? "Other",
    insight: getPercentileInsight(salary, nationalPercentile, stateCode, jobCategory),
  };
}
