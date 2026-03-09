import Home from "./page";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Home", () => {
  it("redirects to /revenue", () => {
    Home();

    expect(redirect).toHaveBeenCalledWith("/revenue");
  });
});