import { render, screen } from "@testing-library/react";
import Modal from "@/app/common/modal";
import '@testing-library/jest-dom';

describe("Modal Component", () => {
  const title = "Modal Title";
  const content = <p>This is the modal content.</p>;

  it("renders the modal with the correct title and content", () => {
    render(<Modal title={title}>{content}</Modal>);

    const titleElement = screen.getByRole("heading", { name: title });
    expect(titleElement).toBeInTheDocument();

    const contentElement = screen.getByText(/This is the modal content/i);
    expect(contentElement).toBeInTheDocument();

    const modalElement = screen.getByText(title);
    expect(modalElement.closest(".modal")).toBeInTheDocument();
  });

  it("renders children elements correctly", () => {
    const customContent = <button>Close</button>;
    render(<Modal title={title}>{customContent}</Modal>);

    const buttonElement = screen.getByRole("button", { name: /close/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
