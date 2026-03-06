import { act } from "react";
import { useLoadingStore } from "./loading.store";

describe("useLoadingStore", () => {
  beforeEach(() => {
    useLoadingStore.setState({
      isLoading: false,
      label: undefined,
    });
  });

  it("shows loading without label", () => {
    act(() => {
      useLoadingStore.getState().show();
    });

    const state = useLoadingStore.getState();

    expect(state.isLoading).toBe(true);
    expect(state.label).toBeUndefined();
  });

  it("shows loading with label", () => {
    act(() => {
      useLoadingStore.getState().show("Carregando dados...");
    });

    const state = useLoadingStore.getState();

    expect(state.isLoading).toBe(true);
    expect(state.label).toBe("Carregando dados...");
  });

  it("hides loading", () => {
    act(() => {
      useLoadingStore.getState().show("Processing...");
    });

    act(() => {
      useLoadingStore.getState().hide();
    });

    const state = useLoadingStore.getState();

    expect(state.isLoading).toBe(false);
    expect(state.label).toBeUndefined();
  });
});