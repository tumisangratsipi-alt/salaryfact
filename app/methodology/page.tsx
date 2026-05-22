import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Methodology — Salary Percentile Calculator",
  description:
    "How we calculate salary percentiles. Data source (BLS OEWS 2024), interpolation method, state adjustments, and limitations.",
  alternates: {
    canonical: "https://salaryfact.com/methodology",
  },
};

export default function MethodologyPage() {
  return (
    <>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(9,9,11,0.95)",
          borderColor: "var(--border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight flex items-center gap-2"
            style={{ color: "var(--text-primary)", textDecoration: "none" }}
          >
            <img src="/logo.png" alt="SalaryFact logo" style={{ height: "28px", width: "auto" }} />
            <span className="text-gradient-1">salary</span>fact.com
          </Link>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Data: BLS OEWS 2024
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8"
          style={{ color: "var(--text-muted)", textDecoration: "none" }}
        >
          &larr; Back to calculator
        </Link>

        <h1 className="text-3xl font-black mb-2">Methodology</h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          How this calculator works and where the data comes from.
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Data source
            </h2>
            <p>
              All national percentile benchmarks are derived from the{" "}
              <a
                href="https://www.bls.gov/oes/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--amber-500)", textDecoration: "none" }}
              >
                Bureau of Labor Statistics Occupational Employment and Wage Statistics (OEWS)
              </a>
              {" "}2024 release.
            </p>
            <p className="mt-3">
              The OEWS program produces employment and wage estimates for over 800 occupations
              across the United States. It surveys approximately 1.1 million business establishments
              and is the most comprehensive source of occupational wage data available for the US
              workforce. State median figures are derived from BLS state-level OEWS estimates.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              National percentile calculation
            </h2>
            <p>
              We use key percentile breakpoints from the 2024 BLS OEWS data (10th, 20th, 25th,
              30th, 40th, 50th, 60th, 70th, 75th, 80th, 90th, 95th, 99th) for the full national
              workforce. For salary values between these breakpoints, we apply linear interpolation
              to estimate the percentile.
            </p>
            <p className="mt-3">
              For example: if the 50th percentile is $59,000 and the 60th percentile is $72,000,
              a salary of $65,500 would be approximately at the 55th percentile (halfway on a
              linear scale). Results are rounded to the nearest whole percentile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              State percentile adjustment
            </h2>
            <p>
              To calculate your state percentile, we scale your salary by the ratio of the
              national median to your state median before applying the national percentile curve.
              This captures the effect of regional wage levels: the same salary ranks higher
              in a low-wage state and lower in a high-wage state.
            </p>
            <p className="mt-3">
              State medians are sourced from BLS state-level OEWS 2024 data covering all
              50 states and Washington D.C.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Job category medians
            </h2>
            <p>
              The job category median shown in the comparison grid is the approximate BLS
              OEWS 2024 median for that broad occupational group. This gives context for
              how your salary compares within your field, separate from the national and
              state percentile calculations. The national percentile is always calculated
              against the full workforce distribution.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Limitations
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                This calculator does not adjust for cost of living. A $70,000 salary in
                San Francisco buys far less than $70,000 in rural Tennessee, but the
                percentile reflects wage distribution only, not purchasing power.
              </li>
              <li>
                The data covers wage and salary workers. Self-employment income and
                business income are not fully captured in BLS OEWS figures.
              </li>
              <li>
                Part-time workers are included in the BLS data and pull down the lower
                percentiles. If you work part-time, your full-time-equivalent salary
                will rank higher than the raw figures suggest.
              </li>
              <li>
                Salaries above the 99th percentile ($350,000+) use the top breakpoint
                as a ceiling. The calculator returns 99 for any salary at or above
                this threshold.
              </li>
              <li>
                This tool does not store any data you enter. All calculations happen
                entirely in your browser.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Not financial advice
            </h2>
            <p>
              This calculator provides context for understanding your salary relative to
              US workers. It does not constitute financial advice, career advice, or any
              recommendation to take or refrain from any action. Salary negotiation and
              career decisions should be informed by multiple data sources and your
              specific circumstances.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="btn-primary-gold"
            style={{ display: "block", textAlign: "center", textDecoration: "none" }}
          >
            Back to calculator
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="mt-16 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-8 text-sm" style={{ color: "var(--text-muted)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>Data: BLS OEWS 2024.</p>
            <p>
              More tools at{" "}
              <a
                href="https://calcmoney.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--amber-500)", textDecoration: "none" }}
              >
                calcmoney.io
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
