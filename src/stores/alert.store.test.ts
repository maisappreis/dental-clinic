import { act } from "react";
import { useAlertStore } from "./alert.store";

describe("useAlertStore", () => {
  beforeEach(() => {
    useAlertStore.setState({
      message: "",
      variant: "success",
      autoCloseAfter: 2000,
    });
  });

  it("shows alert with default values", () => {
    act(() => {
      useAlertStore.getState().show({
        message: "Saved successfully",
      });
    });

    const state = useAlertStore.getState();

    expect(state.message).toBe("Saved successfully");
    expect(state.variant).toBe("success");
    expect(state.autoCloseAfter).toBe(2000);
  });

  it("shows alert with custom variant and timeout", () => {
    act(() => {
      useAlertStore.getState().show({
        message: "Error occurred",
        variant: "error",
        autoCloseAfter: 5000,
      });
    });

    const state = useAlertStore.getState();

    expect(state.message).toBe("Error occurred");
    expect(state.variant).toBe("error");
    expect(state.autoCloseAfter).toBe(5000);
  });

  it("hides alert", () => {
    act(() => {
      useAlertStore.getState().show({
        message: "Temporary",
      });
    });

    act(() => {
      useAlertStore.getState().hide();
    });

    const state = useAlertStore.getState();

    expect(state.message).toBe("");
    expect(state.autoCloseAfter).toBeUndefined();
  });
});