#!/usr/bin/env python3
"""
Auto-update salaryfact/lib/salary-data.ts from BLS Current Population Survey.

Data source: BLS CPS, Median usual weekly earnings, employed full-time,
wage and salary workers, 16 years and over.
BLS series: LEU0252881600Q (quarterly)

Runs via GitHub Actions on a weekly schedule. Commits are made only when
the national median shifts by more than $1,000 from the current value.
All other percentile breakpoints and state medians are scaled proportionally.
"""

import json
import os
import re
import sys
from pathlib import Path

import requests

BLS_API = "https://api.bls.gov/publicAPI/v2/timeseries/data/"
# Quarterly median usual weekly earnings for full-time wage and salary workers
BLS_SERIES = ["LEU0252881600Q"]

SALARY_DATA_FILE = Path("lib/salary-data.ts")
SLACK_WEBHOOK = os.environ.get("SLACK_WEBHOOK_URL", "")

CHANGE_THRESHOLD = 1000  # minimum $ change before updating


def slack(msg: str) -> None:
    if SLACK_WEBHOOK:
        try:
            requests.post(SLACK_WEBHOOK, json={"text": msg}, timeout=10)
        except Exception:
            pass
    print(msg)


def fetch_bls_median_annual() -> tuple[int, str]:
    """
    Returns (annualized_median, data_year).
    Takes Q4 of the most recent complete year (i.e. Q4 = Oct-Dec, proxy for full year).
    """
    payload = {
        "seriesid": BLS_SERIES,
        "startyear": "2022",
        "endyear": "2026",
    }
    resp = requests.post(BLS_API, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    status = data.get("status", "")
    if status != "REQUEST_SUCCEEDED":
        messages = data.get("message", [])
        raise RuntimeError(f"BLS API returned status={status!r}. Messages: {messages}")

    series_list = data.get("Results", {}).get("series", [])
    if not series_list:
        raise RuntimeError("BLS API returned empty series list")

    observations = series_list[0].get("data", [])
    if not observations:
        raise RuntimeError("BLS series has no data points")

    # Sort descending by year then period to find the most recent entry
    observations.sort(key=lambda x: (x["year"], x["period"]), reverse=True)

    # Prefer Q4 of the most recent year for a full-year proxy
    most_recent_year = observations[0]["year"]
    for obs in observations:
        if obs["year"] == most_recent_year and obs["period"] == "Q04":
            weekly = float(obs["value"])
            return round(weekly * 52), obs["year"]

    # Fallback: just use the most recent quarter available
    obs = observations[0]
    weekly = float(obs["value"])
    return round(weekly * 52), obs["year"]


def read_current_median() -> int:
    content = SALARY_DATA_FILE.read_text(encoding="utf-8")
    m = re.search(r"export const NATIONAL_MEDIAN = (\d+);", content)
    if not m:
        raise RuntimeError("Could not locate NATIONAL_MEDIAN in salary-data.ts")
    return int(m.group(1))


def scale_to_nearest(value: float, nearest: int) -> int:
    return round(value / nearest) * nearest


def update_salary_data(new_median: int, current_median: int, year: str) -> bool:
    """Rewrite salary-data.ts with updated median and proportionally scaled values."""
    ratio = new_median / current_median
    content = SALARY_DATA_FILE.read_text(encoding="utf-8")

    # Update header year
    content = re.sub(
        r"(// SALARY PERCENTILE DATA — BLS/Census-based )\d+",
        rf"\g<1>{year}",
        content,
    )

    # Update NATIONAL_MEDIAN constant
    content = re.sub(
        r"(export const NATIONAL_MEDIAN = )\d+;",
        rf"\g<1>{new_median};",
        content,
    )

    # Scale NATIONAL_PERCENTILES values (keys p10..p99), round to nearest $1,000
    def scale_percentile_value(m: re.Match) -> str:
        key = m.group(1)
        old_val = int(m.group(2))
        if key == "p50":
            new_val = new_median
        else:
            new_val = scale_to_nearest(old_val * ratio, 1000)
        return f"{key}: {new_val},"

    content = re.sub(
        r"(p\d+): (\d+),",
        scale_percentile_value,
        content,
    )

    # Scale STATE_MEDIAN_SALARIES values, round to nearest $1,000
    def scale_state_value(m: re.Match) -> str:
        old_val = int(m.group(2))
        new_val = scale_to_nearest(old_val * ratio, 1000)
        return f"{m.group(1)}{new_val},"

    content = re.sub(
        r"([A-Z]{2,3}: )(\d+),",
        scale_state_value,
        content,
    )

    SALARY_DATA_FILE.write_text(content, encoding="utf-8")
    return True


def main() -> None:
    print("Fetching BLS median weekly earnings...")
    try:
        new_median, data_year = fetch_bls_median_annual()
    except Exception as exc:
        # BLS API failures (rate limit, network, service unavailable) are transient.
        # Exit 0 so the workflow doesn't show as failed — data updates are optional.
        msg = f":information_source: salaryfact BLS fetch skipped (transient error): {exc}"
        slack(msg)
        print(f"BLS fetch skipped: {exc}")
        sys.exit(0)

    print(f"BLS annualized median ({data_year}): ${new_median:,}")

    try:
        current_median = read_current_median()
    except Exception as exc:
        msg = f":warning: salaryfact data update FAILED — could not read current median: {exc}"
        slack(msg)
        sys.exit(1)

    print(f"Current NATIONAL_MEDIAN: ${current_median:,}")
    delta = abs(new_median - current_median)

    if delta < CHANGE_THRESHOLD:
        print(f"No significant change (delta ${delta:,} < threshold ${CHANGE_THRESHOLD:,}). No update needed.")
        slack(f":white_check_mark: salaryfact salary check: BLS {data_year} median ${new_median:,} vs current ${current_median:,}. No update (delta ${delta:,}).")
        return

    print(f"Significant change detected: ${current_median:,} -> ${new_median:,}. Updating...")
    try:
        update_salary_data(new_median, current_median, data_year)
    except Exception as exc:
        msg = f":warning: salaryfact data update FAILED during file rewrite: {exc}"
        slack(msg)
        sys.exit(1)

    msg = (
        f":chart_with_upwards_trend: salaryfact auto-updated BLS salary data ({data_year}): "
        f"NATIONAL_MEDIAN ${current_median:,} -> ${new_median:,}. "
        f"All percentile breakpoints and state medians scaled proportionally."
    )
    slack(msg)
    print("Done.")


if __name__ == "__main__":
    main()
