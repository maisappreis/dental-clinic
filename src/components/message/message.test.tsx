import { render, screen } from "@testing-library/react";
import { MessageCard } from "@/components/message/message";

describe("MessageCard Component", () => {
  it("renders the title", () => {
    render(<MessageCard title="Operation completed" />);

    expect(screen.getByText(/Operation completed/i)).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <MessageCard
        title="Saved"
        subtitle="Your data has been stored"
      />
    );

    expect(screen.getByText(/Saved/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Your data has been stored/i)
    ).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    render(<MessageCard title="Only title" />);

    expect(screen.queryByText(/Your data has been stored/i)).not.toBeInTheDocument();
  });

  it("renders with success variant", () => {
    render(
      <MessageCard
        title="Success"
        subtitle="Everything worked"
        variant="success"
      />
    );

    expect(screen.getByText(/Success/i)).toBeInTheDocument();
    expect(screen.getByText(/Everything worked/i)).toBeInTheDocument();
  });

  it("renders with error variant", () => {
    render(
      <MessageCard
        title="Error"
        subtitle="Something went wrong"
        variant="error"
      />
    );

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("renders with default variant when none is provided", () => {
    render(<MessageCard title="Default message" />);

    expect(screen.getByText(/Default message/i)).toBeInTheDocument();
  });
});