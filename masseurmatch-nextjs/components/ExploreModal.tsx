"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import UnifiedExplore from "./UnifiedExplore";

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "ai" | "grid";
}

export default function ExploreModal({ isOpen, onClose, defaultMode = "ai" }: ExploreModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <UnifiedExplore defaultMode={defaultMode} isModal onClose={onClose} />,
    document.body
  );
}
