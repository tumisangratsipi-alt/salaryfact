// lib/routingLogic.ts — salaryfact.com

export const CALCMONEY_GOLD = "#D4AF37" as const;

export interface SalaryRouteResult {
  showCalcMoneyOS: boolean;
  url: string | null;
  label: string;
  sublabel: string;
  colorHex: string;
}

/**
 * threshold: annual_salary >= 250,000 → CalcMoney OS gold CTA
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

  return {
    showCalcMoneyOS: false,
    url: null,
    label: "",
    sublabel: "",
    colorHex: "#A78BFA",
  };
}
