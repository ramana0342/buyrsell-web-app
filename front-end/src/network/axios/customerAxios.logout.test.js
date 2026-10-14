import { waitFor } from "@testing-library/react";

test("a 401 received after intentional logout cannot run token refresh", async () => {
  jest.resetModules();
  const axiosModule = jest.requireActual("axios");
  const axiosDefault = axiosModule.default || axiosModule;
  let rejectOfferRequest;
  let offerRequestConfig;
  const mockAdapter = jest.fn(config => {
    if (String(config.url).includes("refresh-token")) return Promise.resolve({ data: { response: { accessToken: "unexpected-token" } }, status: 200, statusText: "OK", headers: {}, config });
    offerRequestConfig = config;
    return new Promise((resolve, reject) => { rejectOfferRequest = reject; });
  });
  jest.doMock("axios", () => {
    const actual = jest.requireActual("axios");
    (actual.default || actual).defaults.adapter = mockAdapter;
    return actual;
  });
  let customerAxios;
  jest.isolateModules(() => { customerAxios = require("./customerAxios").default; });

  localStorage.setItem("customerAccessToken", "before-logout");
  const request = customerAxios.get("/customer/offers").catch(error => error);
  await waitFor(() => expect(offerRequestConfig).toBeDefined());
  localStorage.removeItem("customerAccessToken");
  window.dispatchEvent(new Event("customerSessionEnded"));
  const response = { status: 401, data: {}, headers: {}, config: offerRequestConfig };
  rejectOfferRequest(new axiosDefault.AxiosError("Unauthorized", "ERR_BAD_REQUEST", offerRequestConfig, null, response));

  await request;
  expect(mockAdapter).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem("customerAccessToken")).toBeNull();
  jest.dontMock("axios");
});
