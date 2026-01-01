/**
 * Unit Tests - BackToTop Component
 * Enterprise-Grade React Component Testing
 */

import { fireEvent, render, screen } from "@testing-library/react";
import BackToTop from "@/src/components/BackToTop";

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: mockScrollTo,
});

describe("BackToTop Component", () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
    });
  });

  it("should render the button", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });

  it("should have correct aria-label for accessibility", () => {
    render(<BackToTop />);
    const button = screen.getByLabelText("Back to top");
    expect(button).toBeInTheDocument();
  });

  it('should contain "Top" text', () => {
    render(<BackToTop />);
    expect(screen.getByText("Top")).toBeInTheDocument();
  });

  it("should call scrollTo when clicked", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });

    fireEvent.click(button);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should be a button type", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button).toHaveAttribute("type", "button");
  });
});
