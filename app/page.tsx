import Calculator from "./Calculator";
import { JOB_CATEGORIES, JOB_CATEGORY_KEYS, STATE_MEDIAN_SALARIES, formatCurrency } from "@/lib/salary-data";

const faqItems = [
  {
    q: "What is an income percentile calculator?",
    a: "An income percentile calculator shows where your income ranks compared to everyone else. Salary and income are treated the same way here: enter your annual pay and the calculator compares it against BLS OEWS May 2025 wage data for the whole US, your state, and your field, from the bottom of the distribution up to the 90th percentile (the highest BLS publishes in this dataset). There's no sign-up and nothing is saved.",
  },
  {
    q: "What percentile is a good salary?",
    a: "Any salary above the 50th percentile means you earn more than half of US workers. The national median is $50,980 as of BLS OEWS May 2025 data. The 75th percentile ($80,520) puts you in the top quarter nationally, which most financial planners consider a strong income. The top 10% starts around $128,560. BLS OEWS doesn't publish a 95th or 99th percentile wage in this dataset, so this calculator doesn't claim one.",
  },
  {
    q: "What is the median salary in the United States?",
    a: "The median annual wage in the United States is $50,980 as of BLS OEWS May 2025 data, according to Bureau of Labor Statistics Occupational Employment and Wage Statistics (OEWS) data. This means half of all American workers earn below this figure and half earn above it. The mean (average) is higher, $69,770, because high earners pull it up.",
  },
  {
    q: "How does location affect salary percentile?",
    a: "Location has a significant effect on where your salary ranks. States with higher costs of living — California, New York, Washington, Massachusetts — have higher median wages, so the same dollar amount ranks lower percentile-wise than in lower-cost states. Washington D.C. has the highest median at $91,540. Mississippi has the lowest at $40,120. This calculator adjusts your state percentile based on the state median, giving you a meaningful local comparison.",
  },
  {
    q: "Why does my field matter for salary comparison?",
    a: "Occupational medians vary enormously. The median for Technology and Software workers is $109,280, while Hospitality and Food Service sits at $35,050 (BLS OEWS May 2025). A salary of $80,000 in tech puts you below the field median; the same salary in Education places you well above it. Comparing yourself only to the national average without field context gives an incomplete picture of where you actually stand.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary & Income Percentile Calculator",
  url: "https://salaryfact.com",
  description:
    "Find out what percentile your salary or income is in nationally and by state. BLS OEWS May 2025 data. All 50 states.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(9,9,11,0.95)",
          borderColor: "var(--border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-y-2">
          <a
            href="/"
            className="font-display font-bold text-lg tracking-tight flex items-center gap-2"
            style={{ color: "var(--text-primary)", textDecoration: "none" }}
          >
            <img src="/logo.png" alt="SalaryFact logo" style={{ height: "28px", width: "auto" }} />
            <span style={{ whiteSpace: "nowrap" }}><span className="text-gradient-1">salary</span>fact.com</span>
          </a>

            {/* Mobile/tablet: single CTA */}
            <a href="https://calcmoney.io/calculators/salary-to-hourly" target="_blank" rel="noopener" className="sm:hidden text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap flex-shrink-0" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent-dark)", textDecoration: "none" }}>More Tools →</a>
          <nav className="hidden sm:flex items-center gap-1">
            <a href="https://calcmoney.io/calculators/salary-to-hourly" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent-dark)", textDecoration: "none" }}>CalcMoney.io</a>
            <a href="https://homebuycheck.com" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-border)", textDecoration: "none" }}>Homes</a>
            <a href="https://netpaytool.com" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-border)", textDecoration: "none" }}>Paycheck</a>
            <a href="https://networthrank.com" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-border)", textDecoration: "none" }}>Net Worth</a>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex-1">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1
            className="font-display mb-4 leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}
          >
            Salary Percentile
            <br />
            <span className="text-gradient-1">Calculator</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            Enter your salary and see where you rank nationally, by state, and in your field.{" "}
            <a
              href="/methodology"
              style={{ color: "var(--amber-500)", textDecoration: "none" }}
            >
              BLS OEWS May 2025 data
            </a>
            .
          </p>
          <div
            className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-default)",
            }}
          >
            <span className="live-dot" />
            <span className="terminal-label" style={{ letterSpacing: "0.08em" }}>
              Free. No sign-up. No data collected.
            </span>
          </div>
        </div>

        {/* Calculator */}
        <Calculator />

        {/* Browse by state */}
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-4">Salary percentile by state</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            See how median wages and percentile breakpoints vary across the US.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { code: "CA", name: "California" },
              { code: "TX", name: "Texas" },
              { code: "FL", name: "Florida" },
              { code: "NY", name: "New York" },
              { code: "PA", name: "Pennsylvania" },
              { code: "IL", name: "Illinois" },
              { code: "OH", name: "Ohio" },
              { code: "GA", name: "Georgia" },
              { code: "NC", name: "N. Carolina" },
              { code: "MI", name: "Michigan" },
              { code: "NJ", name: "New Jersey" },
              { code: "WA", name: "Washington" },
              { code: "AZ", name: "Arizona" },
              { code: "MA", name: "Massachusetts" },
              { code: "VA", name: "Virginia" },
            ].map(({ code, name }) => (
              <a
                key={code}
                href={`/state/${code.toLowerCase()}`}
                className="aura-panel p-4 text-sm hover:opacity-80"
                style={{ textDecoration: "none", color: "var(--text-primary)" }}
              >
                <div className="font-semibold">{name}</div>
                <div style={{ color: "var(--text-muted)" }}>
                  Median: {formatCurrency(STATE_MEDIAN_SALARIES[code])}
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            <a href="/state/dc" style={{ color: "var(--amber-500)", textDecoration: "none" }}>Washington D.C.</a>
            {" · "}
            <a href="/state/ak" style={{ color: "var(--amber-500)", textDecoration: "none" }}>Alaska</a>
            {" · "}
            <a href="/state/ct" style={{ color: "var(--amber-500)", textDecoration: "none" }}>Connecticut</a>
            {" · "}
            <a href="/state/co" style={{ color: "var(--amber-500)", textDecoration: "none" }}>Colorado</a>
            {" · and all 50 states"}
          </p>
        </section>

        {/* Browse by field */}
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-4">Salary percentile by field</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            See how median wages and percentile breakpoints vary across industries.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {JOB_CATEGORY_KEYS
              .map((key) => [key, JOB_CATEGORIES[key]] as const)
              .sort((a, b) => a[1].label.localeCompare(b[1].label))
              .map(([key, { label, median }]) => (
                <a
                  key={key}
                  href={`/category/${key}`}
                  className="aura-panel p-4 text-sm hover:opacity-80"
                  style={{ textDecoration: "none", color: "var(--text-primary)" }}
                >
                  <div className="font-semibold">{label}</div>
                  <div style={{ color: "var(--text-muted)" }}>Median: {formatCurrency(median)}</div>
                </a>
              ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="aura-panel p-5">
                <h3 className="font-semibold mb-2" style={{ fontSize: 15 }}>
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="mt-16 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-8 text-sm" style={{ color: "var(--text-muted)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>
              Data: BLS OEWS May 2025.{" "}
              <a href="/methodology" style={{ color: "var(--amber-500)", textDecoration: "none" }}>
                Methodology &rarr;
              </a>
            </p>
            <p>
              More tools at{" "}
              <a
                href="https://calcmoney.io/calculators/salary-to-hourly"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--amber-500)", textDecoration: "none" }}
              >
                calcmoney.io
              </a>
            </p>
          </div>
          <p className="mt-3 text-xs">
            Not financial advice. Salary percentiles are estimates based on BLS occupational data.
            &copy; {new Date().getFullYear()} salaryfact.com
            {" · "}
            <a href="/privacy" style={{ color: "var(--amber-500)", textDecoration: "none" }}>Privacy</a>
            {" · "}
            <a href="https://www.youtube.com/@CalcMoney" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber-500)", textDecoration: "none" }}>YouTube</a>
          </p>
        </div>
      </footer>
    </>
  );
}
