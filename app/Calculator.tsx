"use client";

import { useState } from "react";
import {
  calculateSalary,
  formatCurrency,
  STATE_NAMES,
  JOB_CATEGORIES,
  NATIONAL_MEDIAN,
  type SalaryResult,
  type JobCategoryKey,
} from "@/lib/salary-data";
import { resolveSalaryRoute, type SalaryRouteResult } from "@/lib/routingLogic";
import { logTelemetry } from "@/actions/logTelemetry";

function DiffBadge({ amount }: { amount: number }) {
  const isPos = amount >= 0;
  return (
    <span
      className="font-bold font-mono text-sm"
      style={{ color: isPos ? "var(--emerald-500)" : "var(--rose-500)" }}
    >
      {isPos ? "+" : ""}{formatCurrency(amount)}&nbsp;{isPos ? "above" : "below"}
    </span>
  );
}

function PercentileBar({ percentile }: { percentile: number }) {
  // Quartile markers at 25, 50, 75
  return (
    <div className="mt-5">
      <div className="flex justify-between mb-2">
        <span className="terminal-label">0th</span>
        <span className="terminal-label" style={{ color: "var(--amber-500)" }}>
          {percentile}th percentile
        </span>
        <span className="terminal-label">99th</span>
      </div>
      <div
        className="relative h-3 rounded-full overflow-visible"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {/* Filled bar */}
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentile}%`,
            background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)",
          }}
        />
        {/* Position marker */}
        <div
          className="absolute top-0 h-full w-0.5 -translate-x-1/2"
          style={{ left: `${percentile}%`, background: "#ffffff", opacity: 0.9 }}
        />
        {/* Quartile ticks */}
        {[25, 50, 75].map((q) => (
          <div
            key={q}
            className="absolute top-0 h-full w-px opacity-30"
            style={{ left: `${q}%`, background: "rgba(255,255,255,0.4)" }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="terminal-label" style={{ opacity: 0.4 }}>25th</span>
        <span className="terminal-label" style={{ opacity: 0.4 }}>50th</span>
        <span className="terminal-label" style={{ opacity: 0.4 }}>75th</span>
      </div>
    </div>
  );
}

function ShareButtons({ result, salary }: { result: SalaryResult; salary: number }) {
  const [copied, setCopied] = useState(false);

  const shareText = `My ${formatCurrency(salary)} salary ranks in the ${result.nationalPercentile}th percentile nationally (${result.percentileLabel}). Checked at salaryfact.com`;

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    "https://salaryfact.com"
  )}&summary=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex gap-3 mt-6">
      <button onClick={copyResult} className="btn-orbital flex-1 text-sm py-2.5">
        {copied ? "Copied!" : "Copy result"}
      </button>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-orbital flex-1 text-sm py-2.5 text-center"
        style={{ textDecoration: "none" }}
      >
        Share on LinkedIn
      </a>
    </div>
  );
}

function ResultCard({ result, salary }: { result: SalaryResult; salary: number }) {
  return (
    <div className="gradient-border-result rounded-xl p-6 mt-8">
      <p className="terminal-label mb-4">Your salary rank</p>

      {/* Big percentile number */}
      <div className="text-center my-6">
        <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
          You rank in the
        </p>
        <p
          className="text-gradient-1 font-black leading-none glow-amber"
          style={{ fontSize: "clamp(56px, 14vw, 96px)" }}
        >
          {result.nationalPercentile}th
        </p>
        <p className="mt-1 text-base font-semibold" style={{ color: "var(--text-secondary)" }}>
          Percentile nationally
        </p>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full"
          style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }}>
          <span className="text-xs font-bold" style={{ color: "#A78BFA" }}>
            {result.percentileLabel}
          </span>
        </div>
      </div>

      <PercentileBar percentile={result.nationalPercentile} />

      {/* Comparison grid */}
      <div className="holo-panel p-4 mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="terminal-label">Your salary</span>
          <span className="tabular-gold text-sm">{formatCurrency(salary)}</span>
        </div>
        <div
          className="flex justify-between items-center pt-2"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <span className="terminal-label">vs. national median ({formatCurrency(NATIONAL_MEDIAN)})</span>
          <DiffBadge amount={result.vsNationalMedian} />
        </div>
        <div
          className="flex justify-between items-center pt-2"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <span className="terminal-label">vs. {result.stateName} median</span>
          <DiffBadge amount={result.vsStateMedian} />
        </div>
        <div
          className="flex justify-between items-center pt-2"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <span className="terminal-label">vs. {result.jobCategoryLabel} median ({formatCurrency(result.jobMedian)})</span>
          <DiffBadge amount={result.vsJobMedian} />
        </div>
      </div>

      {/* State percentile card */}
      <div className="mt-4 p-3 rounded-lg flex justify-between items-center"
        style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
        <span className="terminal-label">Percentile in {result.stateName}</span>
        <span className="font-bold font-mono text-sm" style={{ color: "#A78BFA" }}>
          {result.statePercentile}th
        </span>
      </div>

      {/* Insight */}
      <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {result.insight}
      </p>

      <ShareButtons result={result} salary={salary} />

      {/* CTAs */}
      <div className="mt-6 space-y-3">
        <a
          href="https://calcmoney.io"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-orbital block w-full text-center py-3"
          style={{ textDecoration: "none" }}
        >
          More financial tools at CalcMoney &rarr;
        </a>
      </div>
    </div>
  );
}

function AffiliateCTA({ route }: { route: SalaryRouteResult }) {
  return (
    <div
      className="mt-6 p-4 rounded-xl"
      style={{
        background: `${route.colorHex}0f`,
        border: `1px solid ${route.colorHex}40`,
      }}
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: route.colorHex }}>
        {route.showCalcMoneyOS ? "Top-earner resources" : "Make your salary work harder"}
      </p>
      <p className="text-sm mb-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {route.sublabel}
      </p>
      <a
        href={route.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full text-center py-3 rounded-lg font-bold text-sm transition-all"
        style={{ background: route.colorHex, color: "#09090B", textDecoration: "none" }}
      >
        {route.label} &rarr;
      </a>
    </div>
  );
}

export default function Calculator({ defaultState }: { defaultState?: string }) {
  const [salaryInput, setSalaryInput] = useState("");
  const [stateCode, setStateCode] = useState(defaultState ?? "");
  const [jobCategory, setJobCategory] = useState<JobCategoryKey | "">("");
  const [result, setResult] = useState<{ data: SalaryResult; salary: number } | null>(null);
  const [route, setRoute] = useState<SalaryRouteResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const raw = salaryInput.replace(/[$,\s]/g, "");
    const sal = parseFloat(raw);
    if (isNaN(sal) || sal < 0) {
      setError("Enter a valid annual salary, e.g. 75000.");
      return;
    }
    if (!stateCode) {
      setError("Select your state.");
      return;
    }
    if (!jobCategory) {
      setError("Select a job category.");
      return;
    }
    const data = calculateSalary(sal, stateCode, jobCategory);
    const routeResult = resolveSalaryRoute(sal);
    setResult({ data, salary: sal });
    setRoute(routeResult);

    // Fire-and-forget telemetry
    void logTelemetry({
      annual_salary: sal,
      state_code: stateCode,
      job_category_key: jobCategory,
    });

    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  return (
    <div>
      {/* Form */}
      <div className="aura-panel p-6">
        <div className="space-y-5">
          <div>
            <label className="terminal-label block mb-2">
              Annual salary (before taxes)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="75000"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              className="w-full rounded-md px-4 py-3 text-base font-mono tracking-wider transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-default)",
                color: "var(--amber-400)",
              }}
            />
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Enter your gross annual salary (pre-tax). Hourly workers: multiply hourly rate by 2,080.
            </p>
          </div>

          <div>
            <label className="terminal-label block mb-2">Job category</label>
            <select
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value as JobCategoryKey | "")}
              className="w-full rounded-md px-4 py-3 text-base transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            >
              <option value="" style={{ background: "#16181F" }}>Select your field</option>
              {Object.entries(JOB_CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key} style={{ background: "#16181F" }}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="terminal-label block mb-2">State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full rounded-md px-4 py-3 text-base transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            >
              <option value="" style={{ background: "#16181F" }}>Select your state</option>
              {Object.entries(STATE_NAMES).map(([code, name]) => (
                <option key={code} value={code} style={{ background: "#16181F" }}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--rose-500)" }}>
              {error}
            </p>
          )}

          <button className="btn-primary-gold" onClick={handleCalculate}>
            Calculate My Percentile
          </button>
        </div>
      </div>

      {/* Result */}
      <div id="result">
        {result && <ResultCard result={result.data} salary={result.salary} />}
        {route && <AffiliateCTA route={route} />}
      </div>
    </div>
  );
}
