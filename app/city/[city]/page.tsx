import type { Metadata } from "next";
import Script from "next/script";
import Calculator from "@/app/Calculator";
import { NATIONAL_MEDIAN, formatCurrency } from "@/lib/salary-data";
import { CITY_DATA, CITY_SLUGS } from "@/lib/city-data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return CITY_SLUGS.map((slug) => ({ city: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = CITY_DATA[slug];

  if (!city) {
    return { title: "City Not Found" };
  }

  return {
    title: `${city.name} Salary Percentile Calculator — Where Do You Rank?`,
    description: `See where your salary ranks in ${city.name}. The median salary in ${city.name} is ${formatCurrency(city.medianSalary)}. Compare yourself against ${city.name} workers using BLS 2024 data.`,
    alternates: {
      canonical: `https://salaryfact.com/city/${slug}`,
    },
    openGraph: {
      title: `${city.name} Salary Percentile Calculator`,
      description: `The median salary in ${city.name} is ${formatCurrency(city.medianSalary)}. Find your percentile among ${city.name} workers.`,
      url: `https://salaryfact.com/city/${slug}`,
    },
  };
}

// Salary percentile table breakpoints
const TABLE_POINTS = [
  { label: "10th", pct: 10, national: 15000 },
  { label: "25th", pct: 25, national: 26000 },
  { label: "50th (median)", pct: 50, national: 59000 },
  { label: "75th", pct: 75, national: 97000 },
  { label: "90th", pct: 90, national: 145000 },
  { label: "95th", pct: 95, national: 200000 },
  { label: "99th", pct: 99, national: 350000 },
];

function getCitySalaryAtPercentile(cityMedian: number, nationalSalary: number): number {
  return Math.round((nationalSalary * cityMedian) / NATIONAL_MEDIAN / 1000) * 1000;
}

// Sorted cities for the navigation grid
const ALL_CITIES = Object.entries(CITY_DATA).sort((a, b) =>
  a[1].name.localeCompare(b[1].name)
);

interface CityFaq {
  q: string;
  a: string;
}

function buildFaqs(cityName: string, cityMedian: number, pctDiff: number, vsNational: string): CityFaq[] {
  return [
    {
      q: `What is the median salary in ${cityName}?`,
      a: `The median annual salary in ${cityName} is approximately ${formatCurrency(cityMedian)} based on 2024 BLS data. This is ${pctDiff}% ${vsNational} the national median of ${formatCurrency(NATIONAL_MEDIAN)}.`,
    },
    {
      q: `Where does your salary rank in ${cityName}?`,
      a: `Use the calculator above to find your exact salary percentile in ${cityName}. The ${cityName} median is ${formatCurrency(cityMedian)}. If you earn above this, you rank in the top half of ${cityName} workers. The calculator compares your salary to both the ${cityName} distribution and the national distribution.`,
    },
    {
      q: `How does ${cityName} compare to the national median salary?`,
      a: `${cityName}'s median salary of ${formatCurrency(cityMedian)} is ${pctDiff}% ${vsNational} the US national median of ${formatCurrency(NATIONAL_MEDIAN)}. This means ${cityName} workers earn ${vsNational} the typical American worker on a gross basis. Cost of living differences may affect real purchasing power.`,
    },
    {
      q: `What salary is needed to be in the top 25% in ${cityName}?`,
      a: `To reach the top 25% of earners in ${cityName}, you need approximately ${formatCurrency(getCitySalaryAtPercentile(cityMedian, 97000))} or more. The top 10% threshold in ${cityName} is around ${formatCurrency(getCitySalaryAtPercentile(cityMedian, 145000))}.`,
    },
  ];
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = CITY_DATA[slug];

  if (!city) {
    return <div>City not found</div>;
  }

  const vsNational = city.medianSalary > NATIONAL_MEDIAN ? "above" : "below";
  const pctDiff = Math.round(
    (Math.abs(city.medianSalary - NATIONAL_MEDIAN) / NATIONAL_MEDIAN) * 100
  );

  const cityTableRows = TABLE_POINTS.map((pt) => ({
    ...pt,
    citySalary: getCitySalaryAtPercentile(city.medianSalary, pt.national),
  }));

  const faqs = buildFaqs(city.name, city.medianSalary, pctDiff, vsNational);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${city.name} Salary Percentile Calculator`,
    description: `See where your salary ranks in ${city.name}. BLS 2024 data.`,
    url: `https://salaryfact.com/city/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SalaryFact", item: "https://salaryfact.com" },
        { "@type": "ListItem", position: 2, name: "Cities", item: "https://salaryfact.com/city" },
        { "@type": "ListItem", position: 3, name: `${city.name} Salary Percentile`, item: `https://salaryfact.com/city/${slug}` },
      ],
    },
  });

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  });

  return (
    <>
      <Script id="city-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {jsonLd}
      </Script>
      <Script id="city-faq-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {faqJsonLd}
      </Script>

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
            <img
              src="/logo.png"
              alt="SalaryFact logo"
              style={{ height: "28px", width: "auto" }}
            />
            <span className="text-gradient-1">salary</span>fact.com
          </a>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Data: BLS OEWS 2024
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex-1">
        {/* Breadcrumb */}
        <nav className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          <a href="/" style={{ color: "var(--amber-500)", textDecoration: "none" }}>
            SalaryFact
          </a>
          {" / "}
          <a href="/city" style={{ color: "var(--amber-500)", textDecoration: "none" }}>
            Cities
          </a>
          {" / "}
          <span>{city.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1
            className="font-black mb-3 leading-tight"
            style={{ fontSize: "clamp(24px, 5vw, 38px)" }}
          >
            {city.name} Salary Percentile
            <br />
            <span className="text-gradient-1">Calculator</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Where does your salary rank in {city.name}? The median salary here
            is {formatCurrency(city.medianSalary)}, {pctDiff}% {vsNational} the
            national median of {formatCurrency(NATIONAL_MEDIAN)}. Enter your
            salary below to see your exact percentile among {city.name} workers.
          </p>
        </div>

        {/* City vs National comparison stat bar */}
        <div
          className="mb-8 p-4 rounded-xl flex flex-col sm:flex-row gap-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex-1 text-center">
            <p className="text-xs terminal-label mb-1">{city.name} median</p>
            <p className="text-2xl font-black tabular-gold">
              {formatCurrency(city.medianSalary)}
            </p>
          </div>
          <div
            className="hidden sm:block w-px"
            style={{ background: "var(--border-subtle)" }}
          />
          <div className="flex-1 text-center">
            <p className="text-xs terminal-label mb-1">National median</p>
            <p className="text-2xl font-black" style={{ color: "var(--text-muted)" }}>
              {formatCurrency(NATIONAL_MEDIAN)}
            </p>
          </div>
          <div
            className="hidden sm:block w-px"
            style={{ background: "var(--border-subtle)" }}
          />
          <div className="flex-1 text-center">
            <p className="text-xs terminal-label mb-1">vs national</p>
            <p
              className="text-2xl font-black"
              style={{
                color:
                  city.medianSalary >= NATIONAL_MEDIAN
                    ? "var(--amber-400)"
                    : "var(--text-secondary)",
              }}
            >
              {city.medianSalary >= NATIONAL_MEDIAN ? "+" : ""}
              {pctDiff}%
            </p>
          </div>
        </div>

        {/* Calculator pre-seeded with this city's state */}
        <Calculator defaultState={city.stateCode} />

        {/* Data table */}
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">
            {city.name} salary percentiles — 2024
          </h2>
          <div
            className="overflow-x-auto rounded-xl"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <th className="text-left px-4 py-3 terminal-label">Percentile</th>
                  <th className="text-right px-4 py-3 terminal-label">{city.name}</th>
                  <th className="text-right px-4 py-3 terminal-label">National</th>
                </tr>
              </thead>
              <tbody>
                {cityTableRows.map((row, i) => {
                  const isMedian = row.pct === 50;
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom:
                          i < cityTableRows.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                        background: isMedian
                          ? "rgba(212,175,55,0.07)"
                          : "transparent",
                      }}
                    >
                      <td
                        className="px-4 py-3 font-medium"
                        style={{
                          color: isMedian
                            ? "var(--amber-400)"
                            : "var(--text-secondary)",
                        }}
                      >
                        {row.label}
                        {isMedian && (
                          <span
                            className="ml-2 text-xs"
                            style={{ color: "var(--amber-500)" }}
                          >
                            median
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-gold font-mono text-sm">
                        {formatCurrency(row.citySalary)}
                      </td>
                      <td
                        className="px-4 py-3 text-right font-mono text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatCurrency(row.national)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            City figures derived from BLS OEWS 2024 metro area median. National
            figures from BLS national percentile data.
          </p>
        </section>

        {/* Key insight */}
        <div
          className="mt-8 p-5 rounded-xl"
          style={{
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: "var(--amber-500)" }}
          >
            Key insight
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {city.name}&apos;s median salary of {formatCurrency(city.medianSalary)} is{" "}
            {pctDiff}% {vsNational} the US national median of{" "}
            {formatCurrency(NATIONAL_MEDIAN)}. The top 25% of {city.name} workers
            earn at least{" "}
            {formatCurrency(getCitySalaryAtPercentile(city.medianSalary, 97000))}. The
            top 10% threshold is around{" "}
            {formatCurrency(getCitySalaryAtPercentile(city.medianSalary, 145000))}.
          </p>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">
            {city.name} salary — frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="aura-panel p-5">
                <h3 className="font-semibold mb-2" style={{ fontSize: 15 }}>
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Link to state page */}
        <div className="mt-8">
          <a
            href={`/state/${city.stateCode.toLowerCase()}`}
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--amber-500)", textDecoration: "none" }}
          >
            See all {city.state} salary data &rarr;
          </a>
        </div>

        {/* City navigation grid */}
        <section className="mt-12">
          <h2 className="text-lg font-bold mb-4">Salary percentiles by city</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_CITIES.map(([citySlug, cityEntry]) => {
              const isActive = citySlug === slug;
              return (
                <a
                  key={citySlug}
                  href={`/city/${citySlug}`}
                  className="rounded-lg p-3 transition-colors"
                  style={{
                    background: isActive
                      ? "rgba(212,175,55,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: isActive
                      ? "1px solid rgba(212,175,55,0.4)"
                      : "1px solid var(--border-subtle)",
                    textDecoration: "none",
                  }}
                >
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: isActive ? "var(--amber-400)" : "var(--text-secondary)",
                    }}
                  >
                    {cityEntry.name}
                  </p>
                  <p
                    className="text-xs mt-0.5 tabular-gold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatCurrency(cityEntry.medianSalary)} median
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t" style={{ borderColor: "var(--border)" }}>
        <div
          className="max-w-2xl mx-auto px-4 py-8 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>
              Data: BLS OEWS 2024.{" "}
              <a
                href="/methodology"
                style={{ color: "var(--amber-500)", textDecoration: "none" }}
              >
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
            Not financial advice. Salary percentiles are estimates based on BLS
            occupational data. &copy; {new Date().getFullYear()} salaryfact.com
            {" · "}
            <a
              href="/privacy"
              style={{ color: "var(--amber-500)", textDecoration: "none" }}
            >
              Privacy
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
