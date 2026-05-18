// ============================================================
// SALARY PERCENTILE DATA — BLS/Census-based 2024
// salaryfact.com
// ============================================================

export const NATIONAL_MEDIAN = 59000;

// BLS-based 2024 national salary percentile breakpoints (annual)
const NATIONAL_PERCENTILES: Record<string, number> = {
  p10: 15000,
  p20: 22000,
  p25: 26000,
  p30: 30000,
  p40: 37000,
  p50: 59000,
  p60: 72000,
  p70: 87000,
  p75: 97000,
  p80: 110000,
  p90: 145000,
  p95: 200000,
  p99: 350000,
};

// Ordered breakpoints for interpolation
const BREAKPOINTS: Array<{ percentile: number; salary: number }> = [
  { percentile: 0, salary: 0 },
  { percentile: 10, salary: NATIONAL_PERCENTILES.p10 },
  { percentile: 20, salary: NATIONAL_PERCENTILES.p20 },
  { percentile: 25, salary: NATIONAL_PERCENTILES.p25 },
  { percentile: 30, salary: NATIONAL_PERCENTILES.p30 },
  { percentile: 40, salary: NATIONAL_PERCENTILES.p40 },
  { percentile: 50, salary: NATIONAL_PERCENTILES.p50 },
  { percentile: 60, salary: NATIONAL_PERCENTILES.p60 },
  { percentile: 70, salary: NATIONAL_PERCENTILES.p70 },
  { percentile: 75, salary: NATIONAL_PERCENTILES.p75 },
  { percentile: 80, salary: NATIONAL_PERCENTILES.p80 },
  { percentile: 90, salary: NATIONAL_PERCENTILES.p90 },
  { percentile: 95, salary: NATIONAL_PERCENTILES.p95 },
  { percentile: 99, salary: NATIONAL_PERCENTILES.p99 },
];

// State median annual salaries (BLS 2024 approximations)
export const STATE_MEDIAN_SALARIES: Record<string, number> = {
  AL: 48000, AK: 62000, AZ: 58000, AR: 46000, CA: 72000,
  CO: 67000, CT: 70000, DE: 62000, DC: 85000, FL: 55000,
  GA: 55000, HI: 60000, ID: 52000, IL: 62000, IN: 52000,
  IA: 55000, KS: 52000, KY: 49000, LA: 48000, ME: 55000,
  MD: 68000, MA: 75000, MI: 55000, MN: 64000, MS: 43000,
  MO: 52000, MT: 50000, NE: 55000, NV: 55000, NH: 68000,
  NJ: 70000, NM: 49000, NY: 68000, NC: 56000, ND: 55000,
  OH: 54000, OK: 48000, OR: 63000, PA: 58000, RI: 62000,
  SC: 50000, SD: 48000, TN: 52000, TX: 58000, UT: 60000,
  VT: 57000, VA: 65000, WA: 74000, WV: 44000, WI: 57000,
  WY: 55000,
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

export const JOB_CATEGORIES: Record<string, { label: string; median: number }> = {
  technology: { label: "Technology & Software", median: 105000 },
  healthcare: { label: "Healthcare & Medical", median: 72000 },
  finance: { label: "Finance & Accounting", median: 78000 },
  education: { label: "Education & Teaching", median: 52000 },
  legal: { label: "Legal & Compliance", median: 95000 },
  engineering: { label: "Engineering", median: 95000 },
  sales: { label: "Sales & Marketing", median: 65000 },
  management: { label: "Management & Executive", median: 105000 },
  creative: { label: "Creative & Design", median: 58000 },
  trades: { label: "Trades & Construction", median: 55000 },
  hospitality: { label: "Hospitality & Food Service", median: 35000 },
  retail: { label: "Retail & Customer Service", median: 38000 },
  transportation: { label: "Transportation & Logistics", median: 52000 },
  government: { label: "Government & Public Service", median: 62000 },
  other: { label: "Other", median: 59000 },
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
  if (salary >= BREAKPOINTS[BREAKPOINTS.length - 1].salary) return 99;

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
  if (percentile >= 99) return "Top 1%";
  if (percentile >= 95) return "Top 5%";
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
