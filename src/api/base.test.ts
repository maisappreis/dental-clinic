import { apiURL, apiBase } from "./base";

describe("api base utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("apiURL", () => {
    it("returns correct url when authenticated", () => {
      localStorage.setItem("accessToken", "token123");

      const url = apiURL();

      expect(url).toBe(`${apiBase}/dental`);
    });
  });
});