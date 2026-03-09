import { ExpenseService } from "./expense.service";
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

describe("ExpenseService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiURL as jest.Mock).mockReturnValue("http://api.test");
  });

  describe("list", () => {
    it("returns expenses list", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      (http.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await ExpenseService.list();

      expect(http.get).toHaveBeenCalledWith("http://api.test/expense/");
      expect(result).toEqual(mockData);
    });
  });

  describe("create", () => {
    it("creates an expense", async () => {
      const payload = { name: "Conta", value: 100 };
      const mockResponse = { id: 1, ...payload };

      (http.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await ExpenseService.create(payload as any);

      expect(http.post).toHaveBeenCalledWith(
        "http://api.test/expense/create/",
        payload
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("updates an expense", async () => {
      const payload = { id: 1, name: "Conta Atualizada" };
      const mockResponse = { ...payload };

      (http.patch as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await ExpenseService.update(payload as any);

      expect(http.patch).toHaveBeenCalledWith(
        "http://api.test/expense/1/",
        payload
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("remove", () => {
    it("deletes an expense", async () => {
      (http.delete as jest.Mock).mockResolvedValue({});

      await ExpenseService.remove(1);

      expect(http.delete).toHaveBeenCalledWith(
        "http://api.test/expense/1/"
      );
    });
  });
});