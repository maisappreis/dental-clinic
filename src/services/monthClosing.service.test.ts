import { MonthClosingService } from "./monthClosing.service";
import { http } from "@/api/http";
import { apiURL } from "@/api/base";

jest.mock("@/api/http", () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock("@/api/base", () => ({
  apiURL: jest.fn(),
}));

describe("MonthClosingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiURL as jest.Mock).mockReturnValue("http://api.test");
  });

  describe("list", () => {
    it("fetches month closing list by year", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      (http.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await MonthClosingService.list(2025);

      expect(http.get).toHaveBeenCalledWith(
        "http://api.test/month_closing/?year=2025"
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("create", () => {
    it("creates a month closing", async () => {
      const payload = { month: "Janeiro", year: 2025 };
      const mockResponse = { id: 1, ...payload };

      (http.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await MonthClosingService.create(payload as any);

      expect(http.post).toHaveBeenCalledWith(
        "http://api.test/month_closing/create/",
        payload
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("updates a month closing", async () => {
      const payload = { id: 1, month: "Janeiro", year: 2025 };
      const mockResponse = { ...payload };

      (http.put as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await MonthClosingService.update(payload as any);

      expect(http.put).toHaveBeenCalledWith(
        "http://api.test/month_closing/1/",
        payload
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateNetValues", () => {
    it("updates net values", async () => {
      const payload = [
        { id: 1, net_value: 100 },
        { id: 2, net_value: 200 },
      ];

      (http.put as jest.Mock).mockResolvedValue({});

      await MonthClosingService.updateNetValues(payload as any);

      expect(http.put).toHaveBeenCalledWith(
        "http://api.test/update_net_values/",
        payload
      );
    });
  });
});