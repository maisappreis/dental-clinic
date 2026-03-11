import { DashboardService } from "./dashboard.service";
import { http } from "@/api/http";
import { apiURL } from "@/api/base";

jest.mock("@/api/http");
jest.mock("@/api/base");

describe("DashboardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls correct endpoint and returns dashboard data", async () => {
    const mockData = {
      revenue: [100, 200],
      expenses: [50, 80],
      profit: [50, 120],
      labels: ["Jan", "Feb"],
    };

    (apiURL as jest.Mock).mockReturnValue("http://localhost:8000/api/dental");
    (http.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await DashboardService.list();

    expect(http.get).toHaveBeenCalledWith(
      "http://localhost:8000/api/dental/dashboard_charts/"
    );

    expect(result).toEqual(mockData);
  });
});