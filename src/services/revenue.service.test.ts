import { RevenueService } from "./revenue.service";
import { http } from "@/api/http";
import { apiURL } from "@/api/base";

jest.mock("@/api/http", () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/api/base", () => ({
  apiURL: jest.fn(),
}));

describe("RevenueService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiURL as jest.Mock).mockReturnValue("http://api.test");
  });

  describe("list", () => {
    it("returns revenue list", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];

      (http.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await RevenueService.list();

      expect(http.get).toHaveBeenCalledWith(
        "http://api.test/revenue/"
      );

      expect(result).toEqual(mockData);
    });
  });

  describe("create", () => {
    it("creates revenue", async () => {
      const payload = { name: "Venda", value: 1000 };

      (http.post as jest.Mock).mockResolvedValue({ data: {} });

      const result = await RevenueService.create(payload as any);

      expect(http.post).toHaveBeenCalledWith(
        "http://api.test/revenue/create/",
        payload
      );

      expect(result).toEqual({});
    });
  });

  describe("update", () => {
    it("updates revenue", async () => {
      const payload = { id: 1, name: "Venda Atualizada" };

      (http.patch as jest.Mock).mockResolvedValue({ data: {} });

      const result = await RevenueService.update(payload as any);

      expect(http.patch).toHaveBeenCalledWith(
        "http://api.test/revenue/1/",
        payload
      );

      expect(result).toEqual({});
    });
  });

  describe("remove", () => {
    it("deletes revenue", async () => {
      (http.delete as jest.Mock).mockResolvedValue({});

      await RevenueService.remove(1);

      expect(http.delete).toHaveBeenCalledWith(
        "http://api.test/revenue/1/"
      );
    });
  });
});