import type { Metadata } from "next";
import Calculator from "@/app/Calculator";
import {
  JOB_CATEGORIES,
  JOB_CATEGORY_KEYS,
  NATIONAL_MEDIAN,
  formatCurrency,
  type JobCategoryKey,
} from "@/lib/salary-data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return JOB_CATEGORY_KEYS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = JOB_CATEGORIES[slug];

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.label} Salary Percentile Calculator — Where Do You Rank?`,
    description: `See where your salary ranks among ${category.label} workers. The median salary for ${category.label} is ${formatCurrency(category.median)}. Compare yourself using BLS 2024 data.`,
    alternates: {
      canonical: `https://salaryfact.com/category/${slug}`,
    },
    openGraph: {
      title: `${category.label} Salary Percentile Calculator`,
      description: `The median salary for ${category.label} is ${formatCurrency(category.median)}. Find your percentile among ${category.label} workers.`,
      url: `https://salaryfact.com/category/${slug}`,
    },
  };
}

// Salary percentile table breakpoints (national, used as reference)
const TABLE_POINTS = [
  { label: "10th", pct: 10, national: 15000 },
  { label: "25th", pct: 25, national: 26000 },
  { label: "50th (median)", pct: 50, national: 59000 },
  { label: "75th", pct: 75, national: 97000 },
  { label: "90th", pct: 90, national: 145000 },
  { label: "95th", pct: 95, national: 200000 },
  { label: "99th", pct: 99, national: 350000 },
];

function getCategorySalaryAtPercentile(categoryMedian: number, nationalSalary: number): number {
  return Math.round((nationalSalary * categoryMedian) / NATIONAL_MEDIAN / 1000) * 1000;
}

function getGenericContent(slug: string) {
  const category = JOB_CATEGORIES[slug];
  const vsNational = category.median > NATIONAL_MEDIAN ? "above" : "below";
  const pctDiff = Math.round(Math.abs(category.median - NATIONAL_MEDIAN) / NATIONAL_MEDIAN * 100);

  return {
    intro: `${category.label} has a median salary of ${formatCurrency(category.median)}, ${pctDiff}% ${vsNational} the national median of ${formatCurrency(NATIONAL_MEDIAN)}. The calculator below lets you see how your salary ranks against other ${category.label} workers using BLS 2024 data.`,
    keyInsight: `The median salary in ${category.label} is ${formatCurrency(category.median)}. Half of all workers in this field earn less than this amount. Your field percentile measures where you stand relative to other ${category.label} workers, while your national percentile compares you to all US workers regardless of field.`,
    faqs: [
      {
        q: `What is the median salary in ${category.label}?`,
        a: `The median annual salary in ${category.label} is approximately ${formatCurrency(category.median)} based on 2024 BLS data. This means half of all workers in this field earn below this amount and half earn above it. The national median across all fields is ${formatCurrency(NATIONAL_MEDIAN)}, making ${category.label} ${pctDiff}% ${vsNational} the national average.`,
      },
      {
        q: `What is a good salary in ${category.label}?`,
        a: `A salary above ${formatCurrency(Math.round(category.median * 1.3 / 1000) * 1000)} puts you in roughly the top quarter of earners in ${category.label}. The top 10% in most fields starts around 2-2.5x the field median. The calculator above shows your exact percentile for any salary in this field.`,
      },
      {
        q: `How does ${category.label} compare to other fields?`,
        a: `${category.label}'s median of ${formatCurrency(category.median)} is ${pctDiff}% ${vsNational} the national median of ${formatCurrency(NATIONAL_MEDIAN)} across all fields. Salaries vary significantly by field based on education requirements, demand, and industry structure. Use the calculator to see both your field and national percentile.`,
      },
      {
        q: "Does location affect salary within this field?",
        a: `Yes. State and metro-area cost of living and local demand both shift ${category.label} salaries meaningfully. The calculator above lets you enter your state alongside your field for a more specific comparison.`,
      },
    ],
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = JOB_CATEGORIES[slug];

  if (!category) {
    return <div>Category not found</div>;
  }

  const content = getGenericContent(slug);

  const categoryTableRows = TABLE_POINTS.map((pt) => ({
    ...pt,
    categorySalary: getCategorySalaryAtPercentile(category.median, pt.national),
  }));

  const allCategories = JOB_CATEGORY_KEYS
    .map((key) => [key, JOB_CATEGORIES[key]] as const)
    .sort((a, b) => a[1].label.localeCompare(b[1].label));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${category.label} Salary Percentile Calculator`,
    description: `See where your salary ranks among ${category.label} workers. BLS 2024 data.`,
    url: `https://salaryfact.com/category/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SalaryFact", item: "https://salaryfact.com" },
        { "@type": "ListItem", position: 2, name: `${category.label} Salary Percentile`, item: `https://salaryfact.com/category/${slug}` },
      ],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(9,9,11,0.95)", borderColor: "var(--border)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="font-bold text-lg tracking-tight flex items-center gap-2"
            style={{ color: "var(--text-primary)", textDecoration: "none" }}
          >
            <img src="/logo.png" alt="SalaryFact logo" style={{ height: "28px", width: "auto" }} />
            <span style={{ whiteSpace: "nowrap" }}><span className="text-gradient-1">salary</span>fact.com</span>
          </a>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Data: BLS OEWS 2024
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex-1">
        {/* Breadcrumb */}
        <nav className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          <a href="/" style={{ color: "var(--amber-500)", textDecoration: "none" }}>SalaryFact</a>
          {" / "}
          <span>{category.label}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-black mb-3 leading-tight" style={{ fontSize: "clamp(24px, 5vw, 38px)" }}>
            {category.label} Salary Percentile
            <br />
            <span className="text-gradient-1">Calculator</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {content.intro}
          </p>
        </div>

        {/* Calculator pre-seeded with this category */}
        <Calculator defaultCategory={slug as JobCategoryKey} />

        {/* Data table */}
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">
            {category.label} salary percentiles — 2024
          </h2>
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border-subtle)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid var(--border-subtle)" }}>
                  <th className="text-left px-4 py-3 terminal-label">Percentile</th>
                  <th className="text-right px-4 py-3 terminal-label">{category.label}</th>
                  <th className="text-right px-4 py-3 terminal-label">National</th>
                </tr>
              </thead>
              <tbody>
                {categoryTableRows.map((row, i) => {
                  const isMedian = row.pct === 50;
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < categoryTableRows.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        background: isMedian ? "rgba(212,175,55,0.07)" : "transparent",
                      }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: isMedian ? "var(--amber-400)" : "var(--text-secondary)" }}>
                        {row.label}
                        {isMedian && <span className="ml-2 text-xs" style={{ color: "var(--amber-500)" }}>median</span>}
                      </td>
                      <td className="px-4 py-3 text-right tabular-gold font-mono text-sm">
                        {formatCurrency(row.categorySalary)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm" style={{ color: "var(--text-muted)" }}>
                        {formatCurrency(row.national)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Field figures derived from BLS OEWS 2024 field median. National figures from BLS national percentile data.
          </p>
        </section>

        {/* Key insight */}
        <div
          className="mt-8 p-5 rounded-xl"
          style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.25)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--amber-500)" }}>
            Key insight
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {content.keyInsight}
          </p>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">{category.label} salary — frequently asked questions</h2>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <div key={i} className="aura-panel p-5">
                <h3 className="font-semibold mb-2" style={{ fontSize: 15 }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category navigation grid */}
        <section className="mt-12">
          <h2 className="text-lg font-bold mb-4">Salary percentiles by field</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allCategories.map(([catKey, catData]) => {
              const isActive = catKey === slug;
              return (
                <a
                  key={catKey}
                  href={`/category/${catKey}`}
                  className="rounded-lg p-3 transition-colors"
                  style={{
                    background: isActive ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                    border: isActive ? "1px solid rgba(212,175,55,0.4)" : "1px solid var(--border-subtle)",
                    textDecoration: "none",
                  }}
                >
                  <p className="text-xs font-bold" style={{ color: isActive ? "var(--amber-400)" : "var(--text-secondary)" }}>
                    {catData.label}
                  </p>
                  <p className="text-xs mt-0.5 tabular-gold" style={{ color: "var(--text-muted)" }}>
                    {formatCurrency(catData.median)} median
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-2xl mx-auto px-4 py-8 text-sm" style={{ color: "var(--text-muted)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>
              Data: BLS OEWS 2024.{" "}
              <a href="/methodology" style={{ color: "var(--amber-500)", textDecoration: "none" }}>
                Methodology &rarr;
              </a>
            </p>
            <a
              href="https://calcmoney.io/calculators/salary-to-hourly"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", padding: "5px 12px", borderRadius: "999px", background: "rgba(212,175,55,0.1)", color: "var(--amber-500)", border: "1px solid rgba(212,175,55,0.25)", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}
            >
              After-tax take-home by state at CalcMoney &rarr;
            </a>
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
