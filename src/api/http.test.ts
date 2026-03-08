import axios from "axios";

const requestUse = jest.fn();
const responseUse = jest.fn();

jest.mock("axios", () => {
  const create = jest.fn(() => ({
    interceptors: {
      request: { use: requestUse },
      response: { use: responseUse },
    },
    defaults: { headers: {} },
  }));

  return {
    __esModule: true,
    default: { create, post: jest.fn() },
    create,
    post: jest.fn(),
  };
});

describe("http setup", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("creates axios instance with config", () => {
    const { apiBase } = require("./base");
    const axiosModule = require("axios");

    require("./http");

    expect(axiosModule.create).toHaveBeenCalledWith({
      baseURL: apiBase,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("registers request interceptor", () => {
    require("./http");

    expect(requestUse).toHaveBeenCalledTimes(1);
  });

  it("registers response interceptor", () => {
    require("./http");

    expect(responseUse).toHaveBeenCalledTimes(1);
  });
});