/** Read-only latency/payload probe; the second request measures the warm cache. */
export {};
const base = process.argv[2] || "http://127.0.0.1:3000";
for (const path of [
  "/api/crimes/stats?year=2026",
  "/api/crimes?year=2026&limit=2000&view=analysis",
  "/api/crimes/barangay-counts?year=2026",
  "/api/crimes/hourly-timeline?year=2026",
]) {
  for (let run = 0; run < 2; run++) {
    const start = performance.now();
    const response = await fetch(new URL(path, base), {
      signal: AbortSignal.timeout(60000),
    });
    const body = await response.text();
    const result = JSON.parse(body);
    console.log(
      JSON.stringify({
        path,
        run,
        status: response.status,
        elapsedMs: Math.round(performance.now() - start),
        bytes: Buffer.byteLength(body),
        rows: Array.isArray(result.data) ? result.data.length : undefined,
        offenses: result.data?.totalOffenses,
      }),
    );
    if (!response.ok || !result.success)
      throw new Error(`Benchmark request failed: ${path}`);
  }
}
