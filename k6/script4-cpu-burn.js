import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    cpu_burn_ramp: {
      executor: "ramping-vus",
      startVUs: 5,
      stages: [
        { duration: "2m", target: 20 },
        { duration: "3m", target: 40 },
        { duration: "4m", target: 70 },
        { duration: "2m", target: 30 },
        { duration: "1m", target: 5 },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<3000"],
  },
};

const BASE_URL = __ENV.BASE_URL || "https://nextk6demo92358.azurewebsites.net";
const BURN_MS = __ENV.BURN_MS || "160";
const COMPLEXITY = __ENV.COMPLEXITY || "6000";
const DEMO_SECRET = __ENV.DEMO_CPU_SECRET;

export default function () {
  const headers = DEMO_SECRET ? { "x-demo-secret": DEMO_SECRET } : {};
  const res = http.get(
    `${BASE_URL}/api/demo/cpu-burn?ms=${encodeURIComponent(BURN_MS)}&complexity=${encodeURIComponent(COMPLEXITY)}`,
    { headers },
  );

  check(res, {
    "cpu endpoint 200": (r) => r.status === 200,
  });

  sleep(0.2);
}
