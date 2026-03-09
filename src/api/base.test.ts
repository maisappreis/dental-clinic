import { apiURL, isAuthenticated, apiBase } from "./base";

describe("api base utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("isAuthenticated", () => {
    it("returns false when there is no token", () => {
      expect(isAuthenticated()).toBe(false);
    });

    it("returns true when token exists", () => {
      localStorage.setItem("accessToken", "token123");

      expect(isAuthenticated()).toBe(true);
    });
  });

  describe("apiURL", () => {
    it("returns test url when not authenticated", () => {
      const url = apiURL();

      expect(url).toBe(`${apiBase}/dental/test`);
    });

    it("returns private url when authenticated", () => {
      localStorage.setItem("accessToken", "token123");

      const url = apiURL();

      expect(url).toBe(`${apiBase}/dental`);
    });
  });
});