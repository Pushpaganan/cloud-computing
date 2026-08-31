import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "2m",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
  },
};

const BASE_URL = __ENV.BASE_URL || "https://nextk6demo92358.azurewebsites.net";

export default function () {
  const home = http.get(`${BASE_URL}/`);
  check(home, {
    "home status is 200": (r) => r.status === 200,
  });

  const live = http.get(`${BASE_URL}/live`);
  check(live, {
    "live status is 200": (r) => r.status === 200,
  });

  const count = http.get(`${BASE_URL}/api/presence/count`);
  check(count, {
    "count status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
