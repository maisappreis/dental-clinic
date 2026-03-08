import { ProfitService } from "./profit.service";
import { http } from "@/api/http";
import { apiURL } from "@/api/base";

jest.mock("@/api/http", () => ({
  http: {
    get: jest.fn(),
  },
}));

jest.mock("@/api/base", () => ({
  apiURL: jest.fn(),
}));

describe("ProfitService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiURL as jest.Mock).mockReturnValue("http://api.test");
  });

  it("fetches profit data", async () => {
    const mockData = {
      months: ["Jan", "Fev"],
      profits: [1000, 2000],
    };

    (http.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await ProfitService.list();

    expect(http.get).toHaveBeenCalledWith(
      "http://api.test/profit_list/"
    );

    expect(result).toEqual(mockData);
  });
});