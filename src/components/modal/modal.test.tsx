import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/modal/modal";

describe("Modal Component", () => {
  it("does not render when open is false", () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders modal when open is true", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText(/Modal Content/i)).toBeInTheDocument();
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = jest.fn();

    render(
      <Modal open={true} onClose={handleClose}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("locks body scroll when open", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("renders header section", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Header>Header</Modal.Header>
      </Modal>
    );

    expect(screen.getByText(/Header/i)).toBeInTheDocument();
  });

  it("renders body section", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Body>Body content</Modal.Body>
      </Modal>
    );

    expect(screen.getByText(/Body content/i)).toBeInTheDocument();
  });

  it("renders footer section", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Footer>Footer content</Modal.Footer>
      </Modal>
    );

    expect(screen.getByText(/Footer content/i)).toBeInTheDocument();
  });
});