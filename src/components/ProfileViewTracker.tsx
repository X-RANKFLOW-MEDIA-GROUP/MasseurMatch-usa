"use client";

import { useEffect } from "react";

interface ProfileViewTrackerProps {
  therapistId: string;
}

export default function ProfileViewTracker({ therapistId }: ProfileViewTrackerProps) {
  useEffect(() => {
    // Track the view
    const trackView = async () => {
      try {
        await fetch("/api/profile/views", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ therapist_id: therapistId }),
        });
      } catch (error) {
        // Silently fail - view tracking should not affect user experience
        console.debug("View tracking failed:", error);
      }
    };

    trackView();
  }, [therapistId]);

  // This component doesn't render anything
  return null;
}
