import Calculator from "./Calculator";

const faqItems = [
  {
    q: "What percentile is a good salary?",
    a: "Any salary above the 50th percentile means you earn more than half of US workers. The national median is approximately $59,000 as of 2024 BLS data. The 75th percentile (roughly $97K) puts you in the top quarter nationally, which most financial planners consider a strong income. The top 10% starts around $145,000, and the top 1% is approximately $350,000 or more.",
  },
  {
    q: "What is the median salary in the United States?",
    a: "The median annual wage in the United States is approximately $59,000 as of 2024, according to Bureau of Labor Statistics Occupational Employment and Wage Statistics (OEWS) data. This means half of all American workers earn below this figure and half earn above it. The mean (average) is higher, around $65,000, because high earners pull it up.",
  },
  {
    q: "How does location affect salary percentile?",
    a: "Location has a significant effect on where your salary ranks. States with higher costs of living — California, New York, Washington, Massachusetts — have higher median wages, so the same dollar amount ranks lower percentile-wise than in lower-cost states. Washington D.C. has the highest median at roughly $85,000. Mississippi has the lowest at around $43,000. This calculator adjusts your state percentile based on the state median, giving you a meaningful local comparison.",
  },
  {
    q: "Why does my field matter for salary comparison?",
    a: "Occupational medians vary enormously. The median for Technology and Software workers is around $105,000, while Hospitality and Food Service sits near $35,000. A salary of $80,000 in tech puts you below the field median; the same salary in Education places you well above it. Comparing yourself only to the national average without field context gives an incomplete picture of where you actually stand.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Percentile Calculator",
  url: "https://salaryfact.com",
  description:
    "Find out what percentile your salary is in nationally and by state. BLS 2024 data. All 50 states.",
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
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="font-bold text-lg tracking-tight flex items-center gap-2"
            style={{ color: "var(--text-primary)", textDecoration: "none" }}
          >
            <img src="/logo.png" alt="SalaryFact logo" style={{ height: "28px", width: "auto" }} />
            <span className="text-gradient-1">salary</span>fact.com
          </a>
          
            {/* Mobile: single CTA */}
            <a href="https://calcmoney.io" target="_blank" rel="noopener" className="sm:hidden text-xs px-3 py-1 rounded-full font-semibold" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent-dark)", textDecoration: "none" }}>More Tools →</a>
          <nav className="hidden sm:flex items-center gap-1 overflow-hidden">
            <a href="https://calcmoney.io" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent-dark)", textDecoration: "none" }}>CalcMoney.io</a>
            <a href="https://homebuycheck.com" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-border)", textDecoration: "none" }}>Home Affordability</a>
            <a href="https://netpaytool.com" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-border)", textDecoration: "none" }}>Take-Home Pay</a>
            <a href="https://networthrank.com" target="_blank" rel="noopener" className="text-xs px-2.5 py-1 rounded-full transition-[color,border-color] duration-150 ease-out" style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-border)", textDecoration: "none" }}>Net Worth Rank</a>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex-1">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1
            className="font-black mb-3 leading-tight"
            style={{ fontSize: "clamp(28px, 6vw, 42px)" }}
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
              BLS 2024 data
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
              { code: "CA", name: "California",   median: "$72K" },
              { code: "TX", name: "Texas",        median: "$58K" },
              { code: "FL", name: "Florida",      median: "$55K" },
              { code: "NY", name: "New York",     median: "$68K" },
              { code: "PA", name: "Pennsylvania", median: "$58K" },
              { code: "IL", name: "Illinois",     median: "$62K" },
              { code: "OH", name: "Ohio",         median: "$54K" },
              { code: "GA", name: "Georgia",      median: "$55K" },
              { code: "NC", name: "N. Carolina",  median: "$56K" },
              { code: "MI", name: "Michigan",     median: "$55K" },
              { code: "NJ", name: "New Jersey",   median: "$70K" },
              { code: "WA", name: "Washington",   median: "$74K" },
              { code: "AZ", name: "Arizona",      median: "$58K" },
              { code: "MA", name: "Massachusetts", median: "$75K" },
              { code: "VA", name: "Virginia",     median: "$65K" },
            ].map(({ code, name, median }) => (
              <a
                key={code}
                href={`/state/${code.toLowerCase()}`}
                className="aura-panel p-4 text-sm hover:opacity-80"
                style={{ textDecoration: "none", color: "var(--text-primary)" }}
              >
                <div className="font-semibold">{name}</div>
                <div style={{ color: "var(--text-muted)" }}>Median: {median}</div>
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
              Data: BLS OEWS 2024.{" "}
              <a href="/methodology" style={{ color: "var(--amber-500)", textDecoration: "none" }}>
                Methodology &rarr;
              </a>
            </p>
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
          <p className="mt-3 text-xs">
            Not financial advice. Salary percentiles are estimates based on BLS occupational data.
            &copy; {new Date().getFullYear()} salaryfact.com
            {" · "}
            <a href="/privacy" style={{ color: "var(--amber-500)", textDecoration: "none" }}>Privacy</a>
          </p>
        </div>
      </footer>
    </>
  );
}
