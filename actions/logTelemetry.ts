"use server";

// actions/logTelemetry.ts — salaryfact.com

import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export interface SalaryTelemetry {
  annual_salary: number;
  state_code: string;
  job_category_key: string;
}

export async function logTelemetry(data: SalaryTelemetry): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;

  const { error } = await supabase.from("calculator_telemetry").insert({
    app_source: "salaryfact.com",
    input_data: data,
  });

  if (error) {
    console.error("[telemetry:salaryfact]", error.message);
  }
}
