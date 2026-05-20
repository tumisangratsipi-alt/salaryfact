// lib/routingLogic.ts — salaryfact.com

export const CALCMONEY_GOLD = "#D4AF37" as const;

const URLS = {
  sofi: process.env.NEXT_PUBLIC_SOFI_URL ?? "https://calcmoney.io/go/sofi",
  rocketMoney: process.env.NEXT_PUBLIC_ROCKET_MONEY_URL ?? "https://calcmoney.io/go/rocket-money",
} as const;

export interface SalaryRouteResult {
  showCalcMoneyOS: boolean;
  url: string;
  label: string;
  sublabel: string;
  colorHex: string;
}

/**
 * >= $250k → CalcMoney OS (HNW)
 * $75k–$250k → SoFi Invest (investing surplus)
 * < $75k → Rocket Money (budgeting + savings)
 */
export function resolveSalaryRoute(annualSalary: number): SalaryRouteResult {
  if (annualSalary >= 250_000) {
    return {
      showCalcMoneyOS: true,
      url: "https://calcmoney.io/os",
      label: "Get the Family Office OS — $99",
      sublabel:
        "At your income level, entity structuring, tax optimization, and wealth tracking pay for themselves. Built for top earners.",
      colorHex: CALCMONEY_GOLD,
    };
  }

  if (annualSalary >= 75_000) {
    return {
      showCalcMoneyOS: false,
      url: URLS.sofi,
      label: "Start Investing with SoFi",
      sublabel:
        "Automate investing on your salary surplus. No account minimums, no management fees.",
      colorHex: "#6366F1",
    };
  }

  return {
    showCalcMoneyOS: false,
    url: URLS.rocketMoney,
    label: "Track Every Dollar — Rocket Money",
    sublabel:
      "See exactly where your paycheck goes, cancel unused subscriptions, and build a savings buffer.",
    colorHex: "#22C55E",
  };
}
