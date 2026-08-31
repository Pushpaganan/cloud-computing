import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    spike: {
      executor: "ramping-vus",
      startVUs: 5,
      stages: [
        { duration: "1m", target: 10 },
        { duration: "45s", target: 60 },
        { duration: "1m", target: 60 },
        { duration: "1m", target: 15 },
        { duration: "1m", target: 5 },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1800"],
  },
};

const BASE_URL = __ENV.BASE_URL || "https://nextk6demo92358.azurewebsites.net";

export default function () {
  const res = http.get(`${BASE_URL}/live`);
  check(res, { "live 200": (r) => r.status === 200 });
  sleep(0.5);
}
