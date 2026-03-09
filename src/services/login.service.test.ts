import { LoginService } from "./login.service";
import { http } from "@/api/http";
import { apiBase } from "@/api/base";

jest.mock("@/api/http", () => ({
  http: {
    post: jest.fn(),
  },
}));

jest.mock("@/api/base", () => ({
  apiBase: "http://api.test",
}));

describe("LoginService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls login endpoint and returns access data", async () => {
    const payload = {
      username: "user",
      password: "pass",
    };

    const mockResponse = {
      access: "token123",
      refresh: "token456",
    };

    (http.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await LoginService.login(payload as any);

    expect(http.post).toHaveBeenCalledWith(
      "http://api.test/accounts/token/",
      payload
    );

    expect(result).toEqual(mockResponse);
  });
});