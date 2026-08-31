import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    ramp_test: {
      executor: "ramping-vus",
      startVUs: 5,
      stages: [
        { duration: "2m", target: 15 },
        { duration: "3m", target: 30 },
        { duration: "3m", target: 45 },
        { duration: "2m", target: 20 },
        { duration: "2m", target: 5 },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.03"],
    http_req_duration: ["p(95)<1200", "p(99)<2500"],
  },
};

const BASE_URL = __ENV.BASE_URL || "https://nextk6demo92358.azurewebsites.net";

export default function () {
  const choice = Math.random();

  if (choice < 0.5) {
    const res = http.get(`${BASE_URL}/`);
    check(res, { "home 200": (r) => r.status === 200 });
  } else if (choice < 0.8) {
    const res = http.get(`${BASE_URL}/live`);
    check(res, { "live 200": (r) => r.status === 200 });
  } else {
    const res = http.get(`${BASE_URL}/api/presence/count`);
    check(res, { "count 200": (r) => r.status === 200 });
  }

  sleep(Math.random() * 1.5 + 0.3);
}
