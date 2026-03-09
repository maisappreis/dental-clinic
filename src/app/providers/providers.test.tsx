import { render, screen } from "@testing-library/react";
import { Providers } from "./providers";
import { useAlertStore } from "@/stores/alert.store";
import { useLoadingStore } from "@/stores/loading.store";

jest.mock("@/stores/alert.store");
jest.mock("@/stores/loading.store");

jest.mock("@/components/alert/alert", () => ({
  Alert: ({ message, variant }: any) => (
    <div data-testid="alert">
      {message}-{variant}
    </div>
  ),
}));

jest.mock("@/components/loading/loading", () => ({
  Loading: ({ label }: any) => <div data-testid="loading">{label}</div>,
}));

describe("Providers", () => {
  const hide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children", () => {
    (useAlertStore as unknown as jest.Mock).mockReturnValue({
      message: "",
      variant: "info",
      autoCloseAfter: 0,
      hide,
    });

    (useLoadingStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      label: "",
    });

    render(
      <Providers>
        <div data-testid="child">child</div>
      </Providers>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("shows loading when isLoading is true", () => {
    (useAlertStore as unknown as jest.Mock).mockReturnValue({
      message: "",
      variant: "info",
      autoCloseAfter: 0,
      hide,
    });

    (useLoadingStore as unknown as jest.Mock).mockReturnValue({
      isLoading: true,
      label: "Carregando...",
    });

    render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("Carregando...");
  });

  it("renders alert with message", () => {
    (useAlertStore as unknown as jest.Mock).mockReturnValue({
      message: "Erro",
      variant: "error",
      autoCloseAfter: 3000,
      hide,
    });

    (useLoadingStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      label: "",
    });

    render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    expect(screen.getByTestId("alert")).toHaveTextContent("Erro-error");
  });
});