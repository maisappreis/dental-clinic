import { redirect } from "next/navigation";
import MonthClosingPage from "./page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("MonthClosingPage", () => {
  it("redirects to reports page", () => {
    MonthClosingPage();

    expect(redirect).toHaveBeenCalledWith("/monthclosing/reports");
  });
});