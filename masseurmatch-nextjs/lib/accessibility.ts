/**
 * Accessibility utilities for improving keyboard navigation and screen reader support
 */

/**
 * Generate ARIA label for a link or button
 */
export function generateAriaLabel(text: string, context?: string): string {
  return context ? `${text} - ${context}` : text;
}

/**
 * Handle keyboard navigation for custom components
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  callback: () => void
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

/**
 * Get readable status text for screen readers
 */
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    active: "Active and visible to users",
    pending: "Pending approval",
    blocked: "Currently blocked",
    draft: "In draft mode, not published",
  };
  return statusMap[status] || status;
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Create focus trap for modals and dialogs
 */
export function createFocusTrap(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener("keydown", handleTabKey);

  // Focus first element
  firstElement?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
}

/**
 * Announce message to screen readers using live region
 */
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * ARIA attributes for skip links
 */
export const skipLinkAttrs = {
  className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-500 focus:text-white focus:rounded-lg",
};
