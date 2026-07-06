import type { Metadata } from "next";
import Calculator from "@/app/Calculator";
import {
  STATE_NAMES,
  STATE_MEDIAN_SALARIES,
  NATIONAL_MEDIAN,
  formatCurrency,
} from "@/lib/salary-data";

export const dynamic = "force-static";

// Slug format: lowercase state abbreviation, e.g. "ca", "ny", "dc"
const SLUG_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.keys(STATE_NAMES).map((code) => [code.toLowerCase(), code])
);

export function generateStaticParams() {
  return Object.keys(STATE_NAMES).map((code) => ({
    state: code.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const code = SLUG_TO_CODE[slug];
  const name = STATE_NAMES[code] ?? slug.toUpperCase();
  const median = STATE_MEDIAN_SALARIES[code] ?? NATIONAL_MEDIAN;

  return {
    title: `${name} Salary Percentile Calculator — Where Do You Rank?`,
    description: `See where your salary ranks in ${name}. The median salary in ${name} is ${formatCurrency(median)}. Compare yourself against all ${name} workers using BLS 2024 data.`,
    alternates: {
      canonical: `https://salaryfact.com/state/${slug}`,
    },
    openGraph: {
      title: `${name} Salary Percentile Calculator`,
      description: `The median salary in ${name} is ${formatCurrency(median)}. Find your percentile among ${name} workers.`,
      url: `https://salaryfact.com/state/${slug}`,
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

function getStateSalaryAtPercentile(stateCode: string, nationalSalary: number): number {
  const stateMedian = STATE_MEDIAN_SALARIES[stateCode] ?? NATIONAL_MEDIAN;
  return Math.round((nationalSalary * stateMedian) / NATIONAL_MEDIAN / 1000) * 1000;
}

const STATE_CONTENT: Record<string, { intro: string; keyInsight: string; faqs: { q: string; a: string }[] }> = {
  CA: {
    intro: "California has the largest economy of any US state and one of the highest median salaries. Tech, entertainment, and agriculture drive wages, but the high cost of living means purchasing power varies widely by region.",
    keyInsight: `California's state median of ${formatCurrency(STATE_MEDIAN_SALARIES.CA)} is 22% above the national median of ${formatCurrency(NATIONAL_MEDIAN)}, but San Francisco's cost of living index runs 80% above the US average.`,
    faqs: [
      { q: "What is the median salary in California?", a: `The median annual salary in California is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.CA)} based on 2024 BLS data. This is significantly higher than the national median of ${formatCurrency(NATIONAL_MEDIAN)}, driven by the concentration of high-paying tech and finance jobs in the Bay Area and Los Angeles.` },
      { q: "What salary puts you in the top 10% in California?", a: "Reaching the top 10% of earners in California requires roughly $180,000-$200,000 annually. The state's high concentration of tech workers and executives pushes the upper percentile thresholds higher than most other states." },
      { q: "How does salary compare across California regions?", a: "San Francisco Bay Area salaries run 30-40% above the state median. Los Angeles and San Diego are closer to the state median. Inland Empire and Central Valley wages sit well below it. A $90,000 salary in Fresno buys considerably more than in San Jose." },
      { q: "Does California have state income tax on salaries?", a: "Yes. California has the highest marginal state income tax rate in the US at 13.3% for earners above $1 million, with rates starting at 1% for income above $10,099. Most middle-income earners pay 6-9.3% in state income tax, which significantly affects take-home pay compared to states with no income tax." },
    ],
  },
  TX: {
    intro: "Texas has no state income tax, making take-home pay higher than the gross salary comparison suggests. The state's economy spans energy, technology, healthcare, and manufacturing, with wide variation between metros like Austin, Dallas, and Houston.",
    keyInsight: `Texas has no state income tax. A ${formatCurrency(STATE_MEDIAN_SALARIES.TX)} salary in Texas takes home roughly $5,000-$8,000 more per year than the same salary in a state with 6-9% income tax.`,
    faqs: [
      { q: "What is the median salary in Texas?", a: `The median annual salary in Texas is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.TX)} based on 2024 BLS data. Texas is at the national median despite having no state income tax, which means purchasing power is effectively higher than in higher-tax states with similar gross salaries.` },
      { q: "What salary is considered good in Texas?", a: "A salary above $75,000 puts you in the top 25% of Texas earners. In Austin, where tech salaries dominate, the threshold is higher. In smaller Texas cities, $65,000 can provide a comfortable lifestyle given lower housing costs outside the major metros." },
      { q: "How does Austin compare to the rest of Texas for salaries?", a: "Austin has seen rapid salary growth due to tech company relocations. Median wages in the Austin metro run 20-25% above the Texas state median. Dallas and Houston are closer to the state median, while rural Texas and the Rio Grande Valley are well below it." },
      { q: "Is Texas good for high-income earners?", a: "Texas is particularly favorable for high earners because there is no state income tax. Someone earning $300,000 in Texas saves $15,000-$30,000 annually compared to the same salary in California or New York. This has driven significant relocation of executives and high earners from high-tax states." },
    ],
  },
  NY: {
    intro: "New York's salary figures are heavily influenced by New York City, which skews the state median upward. Outside the five boroughs and immediate suburbs, wages align much closer to the national median, while cost of living differences are dramatic.",
    keyInsight: `New York City's median salary is roughly 40% above upstate New York. The state median of ${formatCurrency(STATE_MEDIAN_SALARIES.NY)} reflects this mix, with finance, tech, and media driving high-end wages.`,
    faqs: [
      { q: "What is the median salary in New York?", a: `The median annual salary in New York State is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.NY)} based on 2024 BLS data. This figure is significantly influenced by New York City. Median wages in Buffalo, Syracuse, and Albany are 25-35% lower than in the New York City metro area.` },
      { q: "What salary do you need to live comfortably in New York City?", a: "Financial planners typically suggest $80,000-$100,000 as the minimum for a single person to live comfortably in New York City without roommates. With a partner or family, $150,000+ provides more stability. Manhattan has the highest costs; outer boroughs and New Jersey suburbs offer more value." },
      { q: "How much is taken out of a New York salary in taxes?", a: "New York has both state and city income taxes. State tax runs 4-10.9% on income. New York City adds another 3.08-3.88% on top. A $100,000 salary in NYC faces roughly 12-14% in combined state and city income tax, before federal taxes. This makes effective take-home pay lower than many other high-salary states." },
      { q: "Is a $100,000 salary good in New York?", a: "In New York City, $100,000 places you above the local median but is not considered wealthy given the cost of living. After taxes, you take home roughly $68,000-$72,000. Rent for a one-bedroom can exceed $3,000/month in Manhattan. In upstate New York, $100,000 is firmly upper-middle class." },
    ],
  },
  FL: {
    intro: "Florida has no state income tax, similar to Texas, and a diverse economy across tourism, healthcare, finance, and real estate. Salaries vary significantly between Miami, Tampa, Orlando, and smaller metros.",
    keyInsight: `Florida's no-income-tax advantage means a ${formatCurrency(STATE_MEDIAN_SALARIES.FL)} salary takes home more than the equivalent salary in most other states. Miami wages run about 15-20% above the state median.`,
    faqs: [
      { q: "What is the median salary in Florida?", a: `The median annual salary in Florida is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.FL)} based on 2024 BLS data, slightly below the national median. Florida benefits from no state income tax, which partially offsets the lower gross wages compared to high-cost coastal states.` },
      { q: "What is a good salary in Florida?", a: "A salary of $70,000 or more puts you comfortably above the Florida median and in the top third of earners statewide. In Miami, where costs are higher, $85,000-$90,000 is the threshold for financial comfort. In smaller markets like Gainesville or Pensacola, $55,000 provides a reasonable standard of living." },
      { q: "How does Miami compare to the rest of Florida for salaries?", a: "Miami's median wage runs 15-25% above the state median. Fort Lauderdale and West Palm Beach are similar. Orlando and Tampa are near the state median. Jacksonville and the Panhandle run slightly below the Florida median. The salary gap between Miami and smaller markets is significant but not as extreme as New York City vs. upstate." },
      { q: "Why are Florida salaries lower than the national median?", a: "Florida's economy has a large hospitality, tourism, and retail sector that pulls the median down. Wages in these service industries are below the national median. Finance and tech workers in South Florida and Tampa earn well above the median, but lower-wage service jobs are more prevalent in Florida than in most other large states." },
    ],
  },
  WA: {
    intro: "Washington State has the highest minimum wage in the country and a strong technology sector anchored by Amazon, Microsoft, and a dense startup ecosystem. No state income tax makes take-home pay favorable for high earners.",
    keyInsight: `Washington has no state income tax, and its state median of ${formatCurrency(STATE_MEDIAN_SALARIES.WA)} is among the highest in the US — 25% above the national median, driven by Seattle tech wages.`,
    faqs: [
      { q: "What is the median salary in Washington State?", a: `The median annual salary in Washington State is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.WA)} based on 2024 BLS data, well above the national median. The Seattle metro, anchored by Amazon and Microsoft, drives wages significantly higher than eastern Washington or smaller cities.` },
      { q: "What salary do you need in Seattle?", a: "Financial planners suggest $90,000-$110,000 for comfortable single living in Seattle without roommates. The city's tech boom has driven rents to $2,500-$3,500/month for a one-bedroom. In Spokane or Yakima, $60,000-$70,000 provides a comparable lifestyle at lower cost." },
      { q: "Does Washington State have income tax?", a: "No. Washington State has no personal income tax, which is a significant advantage for high earners. A tech worker earning $200,000 in Seattle saves $12,000-$18,000 per year compared to the equivalent salary in California. Washington does have a capital gains tax on income above $250,000 introduced in 2023." },
      { q: "How much do Amazon and Microsoft employees earn on average?", a: "Amazon and Microsoft together employ over 100,000 workers in Washington State. Median total compensation (salary plus stock) at these firms runs $180,000-$250,000 for software engineers at mid-level positions. These concentrations of high-earners pull the Seattle median well above the national average." },
    ],
  },
  MA: {
    intro: "Massachusetts has one of the highest median salaries in the country, driven by biotech, finance, healthcare, and technology sectors centered around Boston and Cambridge. The state has a flat income tax of 5% (with a 9% surtax above $1 million).",
    keyInsight: `Massachusetts' state median of ${formatCurrency(STATE_MEDIAN_SALARIES.MA)} is 27% above the national median. The Boston metro's concentration of biotech, universities, and financial services creates strong wage pressure across sectors.`,
    faqs: [
      { q: "What is the median salary in Massachusetts?", a: `The median annual salary in Massachusetts is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.MA)} based on 2024 BLS data. Massachusetts consistently ranks among the top five states for median wages. Boston's biotech corridor, financial services sector, and university ecosystem drive wages across nearly all professional fields.` },
      { q: "What is a good salary in Boston?", a: "Boston's high cost of living means $80,000-$90,000 is the threshold for comfortable single living without roommates. Cambridge and surrounding areas are even more expensive. A dual-income household earning $150,000-$200,000 combined can afford homeownership in suburban Massachusetts." },
      { q: "How much does the average biotech worker earn in Massachusetts?", a: "Massachusetts is the largest biotech hub in the US outside of San Francisco. Median salaries for research scientists run $90,000-$130,000. Clinical and regulatory professionals earn $100,000-$160,000. Senior researchers and directors often exceed $200,000 in total compensation." },
      { q: "What is Massachusetts income tax?", a: "Massachusetts has a flat state income tax rate of 5% on most income, plus a 4% surtax (Millionaire's Tax) on income above $1 million. This is simpler and often lower than neighboring states like New York and Connecticut. The flat structure means middle-income earners pay a predictable percentage." },
    ],
  },
  IL: {
    intro: "Illinois has a flat income tax of 4.95% and a diverse economy spanning finance, manufacturing, healthcare, and technology. Chicago anchors the state economy, with wages in the metro area well above rural downstate Illinois.",
    keyInsight: `Illinois has a flat 4.95% state income tax. Chicago's median wage is roughly 20% above the state median of ${formatCurrency(STATE_MEDIAN_SALARIES.IL)}, reflecting the economic concentration in the metro area.`,
    faqs: [
      { q: "What is the median salary in Illinois?", a: `The median annual salary in Illinois is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.IL)} based on 2024 BLS data. Chicago dominates the state economy, and its higher wages lift the state median well above downstate Illinois, where wages align more closely with Midwest averages.` },
      { q: "What is considered a good salary in Chicago?", a: "In Chicago, $75,000-$85,000 is considered a comfortable single salary. Chicago's cost of living is lower than New York or San Francisco but higher than most Midwest cities. Housing costs are the primary differentiator — downtown Chicago is expensive, while suburbs and neighborhoods further from the loop offer more value." },
      { q: "How does Illinois compare to other Midwest states for salaries?", a: "Illinois has the highest median salary of the major Midwest states, driven by Chicago's finance, tech, and healthcare sectors. Minnesota ($64,000 median) and Ohio ($54,000 median) are common comparisons. Illinois wages are competitive nationally but the combination of state income tax and cost of living in Chicago reduces effective purchasing power." },
      { q: "What are the highest-paying industries in Illinois?", a: "Finance and insurance (particularly commodities trading on the CME), healthcare, technology, and manufacturing are the top-paying industries in Illinois. The Chicago Board of Trade and Chicago Mercantile Exchange create high concentrations of finance workers earning $100,000-$500,000+. Tech salaries in Chicago have also grown rapidly over the past decade." },
    ],
  },
  PA: {
    intro: "Pennsylvania has a flat 3.07% state income tax — one of the lowest flat rates in the US. The economy spans healthcare, education, finance, and manufacturing, with Philadelphia and Pittsburgh as the primary economic centers.",
    keyInsight: `Pennsylvania's 3.07% flat income tax is one of the lowest in states that have income tax. The state median of ${formatCurrency(STATE_MEDIAN_SALARIES.PA)} sits near the national median, with Philadelphia wages running 20% higher.`,
    faqs: [
      { q: "What is the median salary in Pennsylvania?", a: `The median annual salary in Pennsylvania is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.PA)} based on 2024 BLS data, close to the national median. Philadelphia and Pittsburgh have higher wages than rural central Pennsylvania, where manufacturing and agriculture wages pull the median down.` },
      { q: "What is a good salary in Philadelphia?", a: "In Philadelphia, $65,000-$75,000 provides comfortable single living. Philadelphia is significantly cheaper than New York or Boston, with one-bedroom apartments running $1,400-$2,000/month in desirable neighborhoods. The surrounding suburbs offer lower costs with good access to Philadelphia employers." },
      { q: "How does Pennsylvania income tax work?", a: "Pennsylvania has a flat 3.07% state income tax on all earned income. This is among the lowest flat rates in any state with income tax. Many local municipalities also levy an earned income tax (typically 1-3.9%), so residents of Philadelphia or Pittsburgh pay an additional local tax on top of the state rate." },
      { q: "What industries pay the most in Pennsylvania?", a: "Healthcare is the dominant high-wage sector, with Penn Medicine, UPMC, and Jefferson Health employing tens of thousands of highly paid workers. Finance (particularly in Philadelphia), technology, and pharmaceuticals (GlaxoSmithKline, Merck have significant Pennsylvania operations) round out the top-paying industries." },
    ],
  },
  OH: {
    intro: "Ohio has a moderate cost of living and progressive state income tax. The economy spans healthcare, manufacturing, technology, and financial services, with Columbus, Cleveland, and Cincinnati as the three main metros.",
    keyInsight: `Ohio's state median of ${formatCurrency(STATE_MEDIAN_SALARIES.OH)} is below the national median, but Ohio's lower cost of living means purchasing power is competitive. Columbus is the fastest-growing Ohio market, with wages rising toward the state median.`,
    faqs: [
      { q: "What is the median salary in Ohio?", a: `The median annual salary in Ohio is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.OH)} based on 2024 BLS data, below the national median of ${formatCurrency(NATIONAL_MEDIAN)}. However, Ohio's cost of living index runs 10-15% below the national average, which offsets some of the wage differential.` },
      { q: "What is considered a good salary in Columbus?", a: "Columbus is Ohio's fastest-growing city and has seen significant wage growth. A salary of $60,000-$70,000 provides comfortable living in Columbus. Columbus attracts tech companies like JPMorgan's technology operations and Amazon fulfillment, raising local wages above the Ohio state median." },
      { q: "How does the cost of living in Ohio compare to national averages?", a: "Ohio's cost of living runs 10-15% below the national average. Housing is particularly affordable — median home prices in Cleveland and Columbus run 40-60% below national medians. This means a $54,000 salary in Ohio can provide a standard of living comparable to $60,000-$65,000 in higher-cost states." },
      { q: "What are the best-paying cities in Ohio?", a: "Columbus has the highest median wages in Ohio, driven by tech, finance, and government employment. Dublin (a Columbus suburb) hosts major insurance companies. Cleveland's healthcare sector (Cleveland Clinic is one of the largest employers) offers strong wages. Cincinnati's proximity to Northern Kentucky tech growth is boosting wages there." },
    ],
  },
  GA: {
    intro: "Georgia has no state income tax on retirement income and a flat 5.75% income tax on earned wages. Atlanta is a major business hub with headquarters for Delta, Coca-Cola, Home Depot, and a growing tech scene.",
    keyInsight: `Atlanta's film, logistics, tech, and corporate headquarters create wage concentration well above the Georgia state median of ${formatCurrency(STATE_MEDIAN_SALARIES.GA)}. Georgia is a growing relocation destination for businesses and workers from higher-cost states.`,
    faqs: [
      { q: "What is the median salary in Georgia?", a: `The median annual salary in Georgia is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.GA)} based on 2024 BLS data. Atlanta's concentration of Fortune 500 headquarters and growing tech sector pulls the metro median higher, while rural Georgia averages much lower.` },
      { q: "What is a good salary in Atlanta?", a: "In Atlanta, $65,000-$75,000 provides comfortable single living. Atlanta's cost of living is meaningfully lower than coastal metros — median one-bedroom apartments run $1,600-$2,200 in popular in-town neighborhoods. Suburban Atlanta offers significantly lower housing costs." },
      { q: "Why do companies move to Georgia?", a: "Georgia offers a favorable business climate with competitive tax incentives, a major international airport, and relatively affordable real estate. Film and entertainment production credits have attracted a large media industry. Tech companies including Microsoft, Apple, and numerous startups have expanded Atlanta operations. These corporate relocations drive salary growth across the metro." },
      { q: "How does Georgia income tax work?", a: "Georgia has a flat 5.75% state income tax rate on earned income. Georgia exempts retirement income from state taxation for residents 62 and older, up to $35,000 per person. This makes Georgia an attractive retirement destination for those with pension or retirement account income." },
    ],
  },
  NC: {
    intro: "North Carolina has a flat 4.75% income tax (reducing further in coming years) and a fast-growing economy anchored by the Research Triangle (Raleigh-Durham-Chapel Hill), Charlotte's financial sector, and a large manufacturing base.",
    keyInsight: `North Carolina is one of the fastest-growing states for salary growth. The Research Triangle's technology and life sciences sector is raising wages well above the state median of ${formatCurrency(STATE_MEDIAN_SALARIES.NC)}.`,
    faqs: [
      { q: "What is the median salary in North Carolina?", a: `The median annual salary in North Carolina is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.NC)} based on 2024 BLS data. The Research Triangle (Raleigh-Durham) and Charlotte are significantly above the state median, while rural western North Carolina and smaller metros are well below it.` },
      { q: "Is North Carolina good for tech workers?", a: "Yes. The Research Triangle (home to NC State, Duke, and UNC) has a strong tech and life sciences ecosystem. Companies including Cisco, SAS, Red Hat, and numerous biotech firms cluster here. Tech salaries in the Triangle run 30-40% above the state median and are growing faster than most other metros in the Southeast." },
      { q: "What is a good salary in Charlotte?", a: "Charlotte is a major banking hub, home to Bank of America's headquarters and Wells Fargo's East Coast operations. A salary of $65,000-$75,000 provides comfortable single living in Charlotte. The city's cost of living is moderate — lower than Atlanta or Dallas — but rising rapidly as inbound migration drives up housing costs." },
      { q: "How is North Carolina reducing its income tax?", a: "North Carolina has been progressively reducing its flat state income tax rate. Starting at 5.25% in recent years, the rate has been cut to 4.75% and is scheduled to decrease to 2.49% by 2030 under current legislation. This makes North Carolina increasingly attractive for high earners compared to neighboring states with static tax rates." },
    ],
  },
  MI: {
    intro: "Michigan has a flat 4.25% state income tax and a diverse economy that has evolved from automotive manufacturing to include technology, healthcare, and finance. Detroit is the primary metro, with Ann Arbor's university economy close behind.",
    keyInsight: `Michigan's automotive legacy means manufacturing wages still shape the economy. The state median of ${formatCurrency(STATE_MEDIAN_SALARIES.MI)} reflects a blend of high-paying manufacturing and tech jobs alongside retail and service sectors.`,
    faqs: [
      { q: "What is the median salary in Michigan?", a: `The median annual salary in Michigan is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.MI)} based on 2024 BLS data. Michigan's median has been recovering as the automotive industry has modernized and tech employment has grown, particularly in Ann Arbor, Grand Rapids, and the Detroit suburbs.` },
      { q: "What do automotive workers earn in Michigan?", a: "Michigan's automotive industry remains a significant employer. UAW members at Ford, GM, and Stellantis earn $35-$45/hour in base wages after recent contract increases, translating to $70,000-$90,000 annually for full-time workers. Engineers and software developers working on autonomous vehicles and EV technology earn $100,000-$180,000." },
      { q: "How is Michigan's tech sector growing?", a: "Michigan's tech sector has grown substantially, particularly in Ann Arbor (home to University of Michigan) and the Detroit suburbs. Quicken Loans/Rocket Companies, Ford's software division, GM's Cruise autonomous vehicle unit, and a cluster of startups have created technology hubs. Ann Arbor's median tech salary runs 40-50% above the state median." },
      { q: "What is a good salary in Detroit?", a: "In metropolitan Detroit, $60,000-$70,000 provides comfortable single living. Detroit proper has low housing costs relative to its size — median home prices remain accessible. The suburban communities of Rochester Hills, Troy, and Livonia are more expensive but still competitive with major coastal metros." },
    ],
  },
  AZ: {
    intro: "Arizona has a flat 2.5% income tax — one of the lowest flat rates in the US — and a fast-growing economy driven by semiconductor manufacturing, technology, and finance operations that have relocated from California.",
    keyInsight: `Arizona's 2.5% flat income tax is among the lowest in states that have income tax. Phoenix is experiencing significant corporate relocation from California, pushing the state median of ${formatCurrency(STATE_MEDIAN_SALARIES.AZ)} upward.`,
    faqs: [
      { q: "What is the median salary in Arizona?", a: `The median annual salary in Arizona is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.AZ)} based on 2024 BLS data. Phoenix dominates the Arizona economy. Tucson's university economy and border economy are well below the Phoenix metro median, while Scottsdale runs above it.` },
      { q: "Why are companies moving to Phoenix?", a: "Phoenix offers lower costs, abundant land, and a business-friendly tax environment compared to California. TSMC is building two semiconductor fabs near Phoenix, Intel has a major campus, and dozens of finance, tech, and logistics firms have relocated. This corporate inflow is raising Phoenix wages faster than most US metros." },
      { q: "What is Arizona's income tax rate?", a: "Arizona reduced its state income tax to a flat 2.5% in 2023. Previously Arizona had a graduated rate system. The flat 2.5% rate means high earners benefit most from Arizona's tax structure — someone earning $200,000 saves $10,000+ compared to California's top marginal rate." },
      { q: "What is a good salary in Phoenix?", a: "In Phoenix, $65,000-$75,000 provides comfortable single living. Housing has become more expensive due to population inflow, but remains 30-40% below comparable California metros. The tech salary premium in Phoenix has grown as semiconductor and tech employers compete for workers." },
    ],
  },
  TN: {
    intro: "Tennessee has no state income tax on wages — only a Hall Tax on investment income, which was fully repealed in 2021. Nashville and Memphis are the primary metros, with significant healthcare, music, and logistics sectors.",
    keyInsight: `Tennessee has no state income tax on wages. The state median of ${formatCurrency(STATE_MEDIAN_SALARIES.TN)} is below the national median, but the tax advantage significantly improves effective purchasing power for residents.`,
    faqs: [
      { q: "What is the median salary in Tennessee?", a: `The median annual salary in Tennessee is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.TN)} based on 2024 BLS data, below the national median. The no-income-tax advantage partially offsets lower gross wages. Nashville's healthcare and entertainment sector wages are significantly above the state median.` },
      { q: "What is Nashville's economy based on?", a: "Nashville is the healthcare industry capital of the US by number of headquarters — HCA Healthcare, Community Health Systems, and dozens of healthcare companies are based there. Healthcare IT and music industry are also major employers. Nashville wages in healthcare and tech run 25-35% above the Tennessee state median." },
      { q: "What is a good salary in Nashville?", a: "Nashville's rapid growth has pushed housing costs significantly higher. A salary of $65,000-$75,000 is recommended for comfortable single living in Nashville today. The metro's population growth from inbound migration from higher-cost states has raised rents and home prices faster than wages in many sectors." },
      { q: "Does Tennessee have any state income taxes?", a: "Tennessee has no state income tax on wages or salaries. Tennessee previously had the Hall Tax on investment income (dividends and interest), but that was fully repealed effective January 1, 2021. Tennessee relies primarily on sales tax, which at 7% is one of the highest in the US, partially offsetting the income tax advantage for lower earners." },
    ],
  },
  MN: {
    intro: "Minnesota has a progressive state income tax with a top rate of 9.85% and one of the most robust social safety nets in the country. The Minneapolis-St. Paul metro is a major corporate hub with Target, UnitedHealth Group, 3M, and dozens of Fortune 500 companies.",
    keyInsight: `Minnesota has high income taxes but also high wages. The state median of ${formatCurrency(STATE_MEDIAN_SALARIES.MN)} is 8% above the national median, and Minneapolis' concentration of Fortune 500 companies drives above-average professional salaries.`,
    faqs: [
      { q: "What is the median salary in Minnesota?", a: `The median annual salary in Minnesota is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.MN)} based on 2024 BLS data, above the national median. The Minneapolis-St. Paul metro dominates — Target, UnitedHealth, Medtronic, 3M, and US Bancorp create a dense cluster of high-paying corporate jobs.` },
      { q: "What is a good salary in Minneapolis?", a: "In Minneapolis, $70,000-$80,000 provides comfortable single living. Minneapolis has a lower cost of living than coastal metros but higher than many Midwest cities. The city's high concentration of large employers maintains wage levels well above the national median for professional roles." },
      { q: "How much income tax do you pay in Minnesota?", a: "Minnesota has one of the most progressive state income tax structures in the US. The rate starts at 5.35% and rises to 9.85% on income above $183,340 for single filers (2024). This is among the highest state marginal rates nationally, which is a factor for high earners considering relocation." },
      { q: "What industries pay the most in Minnesota?", a: "Healthcare (led by Mayo Clinic and UnitedHealth Group, the largest US health insurer), medical devices (Medtronic), retail and supply chain (Target), financial services (US Bancorp), and technology are Minnesota's highest-paying industries. These sectors collectively employ a significant portion of Minnesota's above-median earners." },
    ],
  },
  CO: {
    intro: "Colorado has a flat 4.4% state income tax and a strong economy anchored by technology, aerospace, energy, and outdoor industries. Denver and Boulder are major tech hubs with some of the fastest salary growth in the Mountain West.",
    keyInsight: `Colorado's state median of ${formatCurrency(STATE_MEDIAN_SALARIES.CO)} is 14% above the national median. Denver's tech and energy sector, combined with Boulder's startup ecosystem, drive wages well above the US average.`,
    faqs: [
      { q: "What is the median salary in Colorado?", a: `The median annual salary in Colorado is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.CO)} based on 2024 BLS data, above the national median. Denver and Boulder are significantly above the state median, while rural Colorado and smaller mountain towns are well below it.` },
      { q: "What is a good salary in Denver?", a: "Denver's rapid growth has pushed costs higher. A salary of $75,000-$85,000 is recommended for comfortable single living in Denver today. The Denver metro's tech and aerospace salaries are strong, but housing affordability has declined significantly as population growth outpaced housing construction." },
      { q: "What industries pay the most in Colorado?", a: "Technology, aerospace and defense (Lockheed Martin, Raytheon, Boeing all have major Colorado operations), energy (both fossil fuels and renewables), and healthcare are the highest-paying sectors in Colorado. The outdoor recreation and tourism industry employs many, but at below-median wages." },
      { q: "How does Colorado income tax work?", a: "Colorado has a flat 4.4% state income tax on all earned income. This is moderate compared to other high-cost states and has been slightly reduced in recent years through the Taxpayer's Bill of Rights (TABOR) refund mechanism. Colorado also has TABOR-required tax refunds when state revenues exceed a cap, which periodically returns money to taxpayers." },
    ],
  },
  MD: {
    intro: "Maryland has progressive state income taxes plus a county piggyback tax, making the total state and local income tax burden among the highest in the nation. High median salaries are driven by proximity to Washington D.C. and a large federal contractor ecosystem.",
    keyInsight: `Maryland's state median of ${formatCurrency(STATE_MEDIAN_SALARIES.MD)} is 15% above the national median, driven by federal government and contractor jobs. Maryland counties add local income taxes of 2.25-3.2% on top of state rates.`,
    faqs: [
      { q: "What is the median salary in Maryland?", a: `The median annual salary in Maryland is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.MD)} based on 2024 BLS data, significantly above the national median. Maryland's proximity to Washington D.C. creates a large federal government and defense contractor workforce that drives wages higher than most Mid-Atlantic states.` },
      { q: "Why are Maryland salaries so high?", a: "Maryland benefits from proximity to the federal government. The National Security Agency (Fort Meade), NIH (Bethesda), DISA, and hundreds of defense and intelligence contractors employ highly paid workers throughout the state. Montgomery County (home to NIH and FDA) has one of the highest median household incomes of any large county in the US." },
      { q: "How much is Maryland income tax?", a: "Maryland has progressive state income tax rates from 2% to 5.75%, plus a county income tax of 2.25-3.2% that varies by county (Howard and Montgomery counties are near the top). This means Maryland residents can pay 8-9% in combined state and county income taxes, making total tax burden substantial despite high gross wages." },
      { q: "What is a good salary in Baltimore vs. the D.C. suburbs?", a: "The Maryland D.C. suburbs (Montgomery County, Prince George's County) have significantly higher wages and costs than Baltimore. A $90,000 salary is considered solid in Baltimore; the same salary in Bethesda or Rockville is middle class given the cost of living. Federal contractor and government wages in suburban Maryland frequently exceed $150,000." },
    ],
  },
  VA: {
    intro: "Virginia has a progressive state income tax with a top rate of 5.75% and the largest concentration of federal defense and intelligence contractors in the country. Northern Virginia is a global technology hub anchored by Amazon's HQ2 and the world's largest concentration of data centers.",
    keyInsight: `Virginia's state median of ${formatCurrency(STATE_MEDIAN_SALARIES.VA)} is 10% above the national median. Northern Virginia's tech corridor (where Amazon, Capital One, Booz Allen, and SAIC are based) runs 40-50% above the state median.`,
    faqs: [
      { q: "What is the median salary in Virginia?", a: `The median annual salary in Virginia is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.VA)} based on 2024 BLS data, above the national median. Northern Virginia dominates the state economy and pulls the median significantly higher. Richmond and Hampton Roads are closer to the state median; rural southwest Virginia is well below it.` },
      { q: "Why is Northern Virginia so wealthy?", a: "Northern Virginia has the highest concentration of defense and intelligence contractors in the world. The NSA, CIA, Pentagon, and dozens of three-letter agencies create massive demand for cleared technical workers. Amazon's HQ2 (in Arlington) added another major tech employer. Data centers (Ashburn, VA is the largest internet exchange point in the world) and cybersecurity firms round out the tech ecosystem." },
      { q: "What is a good salary in Northern Virginia?", a: "Northern Virginia has become one of the most expensive housing markets in the Mid-Atlantic. A salary of $90,000-$110,000 provides comfortable single living in Northern Virginia. Security-cleared software engineers and defense contractors frequently earn $150,000-$250,000. The Alexandria-Arlington-McLean corridor is particularly high-cost." },
      { q: "How does Virginia's income tax compare to Maryland?", a: "Virginia has a top marginal state income tax rate of 5.75%, similar to Maryland's state rate, but Virginia does not have a county piggyback tax like Maryland. Effective total state income tax in Virginia is typically 3-5% lower than Maryland for most income levels, which is a meaningful difference for high earners comparing the two jurisdictions." },
    ],
  },
  OR: {
    intro: "Oregon has no state sales tax but has progressive income taxes with a top rate of 9.9%. Portland and the Willamette Valley anchor the economy, with strong technology, outdoor retail, and manufacturing sectors.",
    keyInsight: `Oregon's state median of ${formatCurrency(STATE_MEDIAN_SALARIES.OR)} is 7% above the national median. Oregon's no-sales-tax advantage partially offsets high income taxes for middle earners.`,
    faqs: [
      { q: "What is the median salary in Oregon?", a: `The median annual salary in Oregon is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.OR)} based on 2024 BLS data, above the national median. Portland drives the state median, while the Oregon Coast and eastern Oregon are well below it.` },
      { q: "What is a good salary in Portland?", a: "Portland's cost of living has risen significantly. A salary of $75,000-$85,000 is recommended for comfortable single living in Portland. Portland is cheaper than Seattle or San Francisco, but has experienced rapid rent and home price growth over the past decade." },
      { q: "Does Oregon have sales tax?", a: "No. Oregon is one of five US states with no state sales tax. This is a significant advantage for purchasing consumer goods and vehicles. The trade-off is higher income taxes. For middle earners who spend a significant portion of income on taxable goods, the no-sales-tax benefit can partially offset Oregon's relatively high income tax rates." },
      { q: "What are the highest-paying jobs in Oregon?", a: "Technology (Intel, Nike's tech division, and a growing Portland startup scene), healthcare, and manufacturing are Oregon's highest-paying sectors. Nike's headquarters in Beaverton anchors a design and apparel industry cluster. Intel's Hillsboro campus employs thousands of semiconductor engineers at above-state-median wages." },
    ],
  },
  CT: {
    intro: "Connecticut has a progressive income tax with a top rate of 6.99% and one of the highest median household incomes in the US. Fairfield County (the New York City suburbs) drives the state economy, with major finance, insurance, and pharmaceutical employers.",
    keyInsight: `Connecticut's state median of ${formatCurrency(STATE_MEDIAN_SALARIES.CT)} is 19% above the national median, significantly influenced by Fairfield County's finance and hedge fund concentration. Bridgeport-Stamford is one of the wealthiest corridors in the US.`,
    faqs: [
      { q: "What is the median salary in Connecticut?", a: `The median annual salary in Connecticut is approximately ${formatCurrency(STATE_MEDIAN_SALARIES.CT)} based on 2024 BLS data, significantly above the national median. Fairfield County (Stamford, Greenwich, Westport) contains a high concentration of hedge funds, private equity, and financial services, creating extreme wage concentration at the upper end.` },
      { q: "What is a good salary in Connecticut?", a: "Connecticut's cost of living, particularly in Fairfield County, is among the highest in the US. In Stamford or Greenwich, $100,000+ is needed for comfortable single living. In Hartford or New Haven, $70,000-$80,000 is more reasonable. Connecticut's high property taxes add significantly to the total cost of living." },
      { q: "Why do so many hedge funds operate from Connecticut?", a: "Greenwich, CT became the hedge fund capital of the world beginning in the 1980s as firms sought proximity to New York City without the city's income tax. Connecticut offered lower taxes and suburban real estate. Bridgewater (the world's largest hedge fund), AQR, and hundreds of smaller funds operate from Fairfield County, creating extreme wage density at the upper income percentiles." },
      { q: "How does Connecticut income tax work?", a: "Connecticut has a graduated income tax from 3% to 6.99% on earned income. Connecticut also taxes Social Security income above certain thresholds, which is a disadvantage for retirees. The combination of high income taxes, property taxes, and cost of living has contributed to net outmigration from Connecticut over the past decade." },
    ],
  },
};

// Generic content for states without custom content
function getGenericContent(code: string) {
  const name = STATE_NAMES[code];
  const median = STATE_MEDIAN_SALARIES[code] ?? NATIONAL_MEDIAN;
  const vsNational = median > NATIONAL_MEDIAN ? "above" : "below";
  const pctDiff = Math.round(Math.abs(median - NATIONAL_MEDIAN) / NATIONAL_MEDIAN * 100);

  return {
    intro: `${name} has a state median salary of ${formatCurrency(median)}, ${pctDiff}% ${vsNational} the national median of ${formatCurrency(NATIONAL_MEDIAN)}. The calculator below lets you see how your salary ranks against ${name} workers using BLS 2024 data.`,
    keyInsight: `The median salary in ${name} is ${formatCurrency(median)}. Half of all ${name} workers earn less than this amount. Your state percentile measures where you stand relative to other ${name} workers, while your national percentile compares you to all US workers.`,
    faqs: [
      {
        q: `What is the median salary in ${name}?`,
        a: `The median annual salary in ${name} is approximately ${formatCurrency(median)} based on 2024 BLS data. This means half of all ${name} workers earn below this amount and half earn above it. The national median is ${formatCurrency(NATIONAL_MEDIAN)}, making ${name} ${pctDiff}% ${vsNational} the national average.`,
      },
      {
        q: `What is a good salary in ${name}?`,
        a: `A salary above ${formatCurrency(Math.round(median * 1.3 / 1000) * 1000)} puts you in roughly the top quarter of earners in ${name}. The top 10% in most states starts around 2-2.5x the state median. The calculator above shows your exact percentile for any salary in ${name}.`,
      },
      {
        q: `How does ${name} compare to national salary averages?`,
        a: `${name}'s state median of ${formatCurrency(median)} is ${pctDiff}% ${vsNational} the national median of ${formatCurrency(NATIONAL_MEDIAN)}. State salaries vary significantly based on the mix of industries, cost of living, and local demand for workers. Use the calculator to see both your state and national percentile.`,
      },
      {
        q: "Does location within the state affect salary percentile?",
        a: `Yes. Metropolitan areas in ${name} typically have higher wages than rural areas. The calculator uses the state-level median as its benchmark. Workers in ${name}'s major cities likely rank differently against their local peers than against the statewide distribution.`,
      },
    ],
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const code = SLUG_TO_CODE[slug];

  if (!code) {
    return <div>State not found</div>;
  }

  const name = STATE_NAMES[code];
  const median = STATE_MEDIAN_SALARIES[code] ?? NATIONAL_MEDIAN;
  const content = STATE_CONTENT[code] ?? getGenericContent(code);

  const stateTableRows = TABLE_POINTS.map((pt) => ({
    ...pt,
    stateSalary: getStateSalaryAtPercentile(code, pt.national),
  }));

  const allStates = Object.entries(STATE_NAMES).sort((a, b) => a[1].localeCompare(b[1]));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${name} Salary Percentile Calculator`,
    description: `See where your salary ranks in ${name}. BLS 2024 data.`,
    url: `https://salaryfact.com/state/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SalaryFact", item: "https://salaryfact.com" },
        { "@type": "ListItem", position: 2, name: `${name} Salary Percentile`, item: `https://salaryfact.com/state/${slug}` },
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
          <a href="/" style={{ color: "var(--amber-500)", textDecoration: "none" }}>SalaryFact</a>
          {" / "}
          <span>{name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-black mb-3 leading-tight" style={{ fontSize: "clamp(24px, 5vw, 38px)" }}>
            {name} Salary Percentile
            <br />
            <span className="text-gradient-1">Calculator</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {content.intro}
          </p>
        </div>

        {/* Calculator pre-seeded with this state */}
        <Calculator defaultState={code} />

        {/* Data table */}
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">
            {name} salary percentiles — 2024
          </h2>
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border-subtle)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid var(--border-subtle)" }}>
                  <th className="text-left px-4 py-3 terminal-label">Percentile</th>
                  <th className="text-right px-4 py-3 terminal-label">{name}</th>
                  <th className="text-right px-4 py-3 terminal-label">National</th>
                </tr>
              </thead>
              <tbody>
                {stateTableRows.map((row, i) => {
                  const isMedian = row.pct === 50;
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < stateTableRows.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        background: isMedian ? "rgba(212,175,55,0.07)" : "transparent",
                      }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: isMedian ? "var(--amber-400)" : "var(--text-secondary)" }}>
                        {row.label}
                        {isMedian && <span className="ml-2 text-xs" style={{ color: "var(--amber-500)" }}>median</span>}
                      </td>
                      <td className="px-4 py-3 text-right tabular-gold font-mono text-sm">
                        {formatCurrency(row.stateSalary)}
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
            State figures derived from BLS OEWS 2024 state median. National figures from BLS national percentile data.
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
          <h2 className="text-xl font-bold mb-6">{name} salary — frequently asked questions</h2>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <div key={i} className="aura-panel p-5">
                <h3 className="font-semibold mb-2" style={{ fontSize: 15 }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* State navigation grid */}
        <section className="mt-12">
          <h2 className="text-lg font-bold mb-4">Salary percentiles by state</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allStates.map(([stCode, stName]) => {
              const stMedian = STATE_MEDIAN_SALARIES[stCode] ?? NATIONAL_MEDIAN;
              const isActive = stCode === code;
              return (
                <a
                  key={stCode}
                  href={`/state/${stCode.toLowerCase()}`}
                  className="rounded-lg p-3 transition-colors"
                  style={{
                    background: isActive ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                    border: isActive ? "1px solid rgba(212,175,55,0.4)" : "1px solid var(--border-subtle)",
                    textDecoration: "none",
                  }}
                >
                  <p className="text-xs font-bold" style={{ color: isActive ? "var(--amber-400)" : "var(--text-secondary)" }}>
                    {stName}
                  </p>
                  <p className="text-xs mt-0.5 tabular-gold" style={{ color: "var(--text-muted)" }}>
                    {formatCurrency(stMedian)} median
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
