import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Cookie } from "lucide-react";

import "./CookieConsent.css";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("masseurmatch-cookie-consent");
    if (!stored) {
      setIsOpen(true);
    } else {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      "masseurmatch-cookie-consent",
      JSON.stringify(preferences),
    );
    setIsOpen(false);

    if (preferences.analytics) {
      console.log("Analytics cookies enabled");
    }
  };

  const handleAcceptAll = () => {
    const allEnabled = { essential: true, analytics: true, marketing: true };
    setPreferences(allEnabled);
    localStorage.setItem(
      "masseurmatch-cookie-consent",
      JSON.stringify(allEnabled),
    );
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="cookie-consent-root">
      <Card className="cookie-consent-card">
        <CardHeader className="cookie-consent-header">
          <CardTitle className="cookie-consent-title">
            <Cookie className="cookie-consent-icon" />
            <span>Cookie Preferences</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="cookie-consent-content">
          <p className="cookie-consent-text">
            We use cookies to ensure our platform works correctly and to improve
            your experience. See our{" "}
            <a href="/legal/cookie-policy" className="cookie-consent-link">
              Cookie Policy
            </a>
            .
          </p>

          <div className="cookie-consent-options">
            {/* Essential */}
            <div className="cookie-consent-row">
              <div className="cookie-consent-row-text">
                <Label className="cookie-consent-label">Essential</Label>
                <p className="cookie-consent-description">
                  Required for the site to function.
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            {/* Analytics */}
            <div className="cookie-consent-row">
              <div className="cookie-consent-row-text">
                <Label
                  htmlFor="analytics"
                  className="cookie-consent-label"
                >
                  Analytics
                </Label>
                <p className="cookie-consent-description">
                  Help us improve our platform.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((p) => ({ ...p, analytics: checked }))
                }
              />
            </div>

            {/* Marketing */}
            <div className="cookie-consent-row">
              <div className="cookie-consent-row-text">
                <Label
                  htmlFor="marketing"
                  className="cookie-consent-label"
                >
                  Marketing
                </Label>
                <p className="cookie-consent-description">
                  Used for targeted advertising.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((p) => ({ ...p, marketing: checked }))
                }
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="cookie-consent-footer">
          <Button
            variant="outline"
            onClick={handleSave}
            className="cookie-consent-btn cookie-consent-btn-outline"
          >
            Save Preferences
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="cookie-consent-btn cookie-consent-btn-primary"
          >
            Accept All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
