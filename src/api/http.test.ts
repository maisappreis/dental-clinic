import axios from "axios";

let requestSuccess: any;
let requestError: any;
let responseSuccess: any;
let responseError: any;

const httpMock = jest.fn();

jest.mock("axios", () => {
  const create = jest.fn(() => {
    const instance: any = (...args: any[]) => httpMock(...args);

    instance.interceptors = {
      request: {
        use: jest.fn((success, error) => {
          requestSuccess = success;
          requestError = error;
        }),
      },
      response: {
        use: jest.fn((success, error) => {
          responseSuccess = success;
          responseError = error;
        }),
      },
    };

    instance.defaults = { headers: {} };

    return instance;
  });

  return {
    __esModule: true,
    default: { create, post: jest.fn() },
    create,
    post: jest.fn(),
  };
});


describe("http", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    localStorage.clear();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("creates axios instance", () => {
    const { apiBase } = require("./base");
    const axiosModule = require("axios");

    require("./http");

    expect(axiosModule.create).toHaveBeenCalledWith({
      baseURL: apiBase,
      headers: { "Content-Type": "application/json" },
    });
  });

  it("adds authorization header when token exists", () => {
    require("./http");

    localStorage.setItem("accessToken", "token123");

    const config: any = { headers: {} };

    const result = requestSuccess(config);

    expect(result.headers.Authorization).toBe("Bearer token123");
  });

  it("does not add authorization header without token", () => {
    require("./http");

    const config: any = { headers: {} };

    const result = requestSuccess(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it("passes response through when successful", () => {
    require("./http");

    const response = { data: { ok: true } };

    expect(responseSuccess(response)).toBe(response);
  });

  it("rejects error when no refresh token", async () => {
    require("./http");

    const error: any = {
      response: { status: 401 },
      config: {},
    };

    await expect(responseError(error)).rejects.toBe(error);
  });

  it("handles refresh failure", async () => {
    const axiosModule = require("axios");
    const postMock = axiosModule.post;

    require("./http");

    localStorage.setItem("refreshToken", "refresh123");

    postMock.mockRejectedValue(new Error("refresh failed"));

    const error: any = {
      response: { status: 401 },
      config: {},
    };

    await expect(responseError(error)).rejects.toBe(error);
  });
});