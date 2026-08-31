import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ENABLED_FLAG = "DEMO_CPU_ENDPOINT_ENABLED";
const SECRET_FLAG = "DEMO_CPU_ENDPOINT_SECRET";

const DEFAULT_BURN_MS = 120;
const MIN_BURN_MS = 10;
const MAX_BURN_MS = 2000;

const DEFAULT_COMPLEXITY = 4000;
const MIN_COMPLEXITY = 1000;
const MAX_COMPLEXITY = 25000;

function clampInt(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function burnCpu(targetMs: number, complexity: number): number {
  const startedAt = performance.now();
  let checksum = 0;

  while (performance.now() - startedAt < targetMs) {
    for (let i = 0; i < complexity; i += 1) {
      checksum = (checksum * 1664525 + i + 1013904223) >>> 0;
      checksum ^= checksum << 13;
      checksum ^= checksum >>> 17;
      checksum ^= checksum << 5;
    }
  }

  return checksum >>> 0;
}

export async function GET(request: Request) {
  if (process.env[ENABLED_FLAG] !== "true") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const configuredSecret = process.env[SECRET_FLAG];
  if (configuredSecret) {
    const headerSecret = request.headers.get("x-demo-secret");
    if (headerSecret !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(request.url);
  const burnMs = clampInt(url.searchParams.get("ms"), DEFAULT_BURN_MS, MIN_BURN_MS, MAX_BURN_MS);
  const complexity = clampInt(
    url.searchParams.get("complexity"),
    DEFAULT_COMPLEXITY,
    MIN_COMPLEXITY,
    MAX_COMPLEXITY,
  );

  const startedAt = performance.now();
  const checksum = burnCpu(burnMs, complexity);
  const elapsedMs = Number((performance.now() - startedAt).toFixed(2));

  return NextResponse.json({
    ok: true,
    mode: "cpu-burn-demo",
    requested: { burnMs, complexity },
    elapsedMs,
    checksum,
    warning: "Demo endpoint only. Keep disabled outside load tests.",
  });
}
