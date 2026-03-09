import { render, screen } from "@testing-library/react";
import { Loading } from "@/components/loading__/loading";

describe("Loading Component", () => {
  it("renders loading status", () => {
    render(<Loading />);

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
  });

  it("renders default label", () => {
    render(<Loading />);

    expect(screen.getByText("Carregando…")).toBeInTheDocument();
  });

  it("renders custom label", () => {
    render(<Loading label="Loading data..." />);

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("does not render label when label is null", () => {
    render(<Loading label={null} />);

    expect(screen.queryByText("Carregando…")).not.toBeInTheDocument();
  });

  it("applies inline variant", () => {
    render(<Loading variant="inline" />);

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
  });
});