import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("starts with default page 1", () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(1);
  });

  it("starts with custom initial page", () => {
    const { result } = renderHook(() => usePagination(5));

    expect(result.current.page).toBe(5);
  });

  it("goes to next page", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.next();
    });

    expect(result.current.page).toBe(2);
  });

  it("goes to previous page", () => {
    const { result } = renderHook(() => usePagination(3));

    act(() => {
      result.current.prev();
    });

    expect(result.current.page).toBe(2);
  });

  it("does not go below page 1", () => {
    const { result } = renderHook(() => usePagination(1));

    act(() => {
      result.current.prev();
    });

    expect(result.current.page).toBe(1);
  });

  it("goes to a specific page", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(10);
    });

    expect(result.current.page).toBe(10);
  });
});