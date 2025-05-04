// import http from "k6/http";
// import { sleep } from "k6";

// export const options = {
//   vus: 100,
//   duration: "30s",
//   cloud: {
//     // Project: Flykro
//     projectID: 3729297,
//     // Test runs with the same name groups test runs together.
//     name: "Flight Search",
//   },
// };

// export default function () {
//   http.get(
//     "http://192.168.0.166:8000/api/v1/shopping/search-flights?origin=PAR&destination=ICN&departureDate=2024-12-20&adults=1&children=1&infants=0&travelClass=ECONOMY&nonStop=false&currencyCode=EUR"
//   );
//   sleep(1);
// }

// Grafana Airport Testing

import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 100,
  duration: "30s",
  cloud: {
    // Project: Flykro
    projectID: 3729297,
    // Test runs with the same name groups test runs together.
    name: "Airport Search",
  },
};

export default function () {
  http.get(
    "http://192.168.0.166:8000/api/v1/search/airport/autosuggest?subType=AIRPORT&keyword=Del"
  );
  sleep(1);
}
