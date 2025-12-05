import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Cookie } from 'lucide-react';

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
    const stored = localStorage.getItem('masseurmatch-cookie-consent');
    if (!stored) {
      setIsOpen(true);
    } else {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('masseurmatch-cookie-consent', JSON.stringify(preferences));
    setIsOpen(false);
    // Here you would trigger your analytics/pixel init based on preferences
    if (preferences.analytics) {
      console.log('Analytics cookies enabled');
    }
  };

  const handleAcceptAll = () => {
    const allEnabled = { essential: true, analytics: true, marketing: true };
    setPreferences(allEnabled);
    localStorage.setItem('masseurmatch-cookie-consent', JSON.stringify(allEnabled));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50 animate-in slide-in-from-bottom-full duration-500">
      <Card className="border-primary/20 shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cookie className="w-5 h-5 text-primary" />
            Cookie Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            We use cookies to ensure our platform works correctly and to improve your experience.
            See our <a href="/legal/cookies" className="underline hover:text-foreground">Cookies Policy</a>.
          </p>
          
          <div className="space-y-3 border rounded-lg p-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Essential</Label>
                <p className="text-xs">Required for the site to function.</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics" className="text-foreground">Analytics</Label>
                <p className="text-xs">Help us improve our platform.</p>
              </div>
              <Switch 
                id="analytics" 
                checked={preferences.analytics} 
                onCheckedChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing" className="text-foreground">Marketing</Label>
                <p className="text-xs">Used for targeted advertising.</p>
              </div>
              <Switch 
                id="marketing" 
                checked={preferences.marketing} 
                onCheckedChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))} 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleSave} className="text-xs h-8">
            Save Preferences
          </Button>
          <Button onClick={handleAcceptAll} className="text-xs h-8">
            Accept All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
