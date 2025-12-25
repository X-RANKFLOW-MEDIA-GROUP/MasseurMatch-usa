"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { User, Loader2, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileBuilderProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProfileBuilder({ onNext, onBack }: ProfileBuilderProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    city: "",
    state: "",
    phone: "",
    bio: "",
    languages: [] as string[],
    services: [] as string[],
    setups: [] as string[],
  });

  const [rates, setRates] = useState({
    incall: [{ duration: 60, price: 100 }],
    outcall: [{ duration: 60, price: 150 }],
  });

  const [hours, setHours] = useState<Record<string, { open: string; close: string }>>({
    monday: { open: "09:00", close: "17:00" },
    tuesday: { open: "09:00", close: "17:00" },
    wednesday: { open: "09:00", close: "17:00" },
    thursday: { open: "09:00", close: "17:00" },
    friday: { open: "09:00", close: "17:00" },
  });

  const { updateProfile, updateRates, updateHours, loading, error } = useOnboarding();

  const [currentTab, setCurrentTab] = useState<"basic" | "rates" | "hours">("basic");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: "languages" | "services" | "setups", value: string) => {
    const items = value.split(",").map((item) => item.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async () => {
    try {
      // Update profile info
      await updateProfile(formData);

      // Update rates
      await updateRates(rates);

      // Update hours
      await updateHours(hours);

      onNext();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const isFormValid = () => {
    return (
      formData.displayName.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.bio.trim() !== "" &&
      formData.languages.length > 0 &&
      formData.services.length > 0 &&
      formData.setups.length > 0
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Build Your Profile</h2>
        <p className="text-slate-400">Tell us about yourself and your services</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {[
          { id: "basic", label: "Basic Info", icon: User },
          { id: "rates", label: "Rates", icon: DollarSign },
          { id: "hours", label: "Hours", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as typeof currentTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                currentTab === tab.id
                  ? "border-purple-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Card className="glass-effect border-slate-800">
        <CardContent className="pt-6">
          {/* Basic Info Tab */}
          {currentTab === "basic" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-white">
                    Display Name *
                  </Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    placeholder="John Doe"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    Phone (E.164 format) *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1234567890"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="San Francisco"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">
                    State *
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="CA"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Bio *
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell potential clients about yourself and your experience..."
                  rows={4}
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages" className="text-white">
                  Languages (comma-separated) *
                </Label>
                <Input
                  id="languages"
                  onChange={(e) => handleArrayInput("languages", e.target.value)}
                  placeholder="English, Spanish, French"
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services" className="text-white">
                  Services (comma-separated) *
                </Label>
                <Input
                  id="services"
                  onChange={(e) => handleArrayInput("services", e.target.value)}
                  placeholder="Swedish Massage, Deep Tissue, Sports Massage"
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setups" className="text-white">
                  Available Setups (comma-separated) *
                </Label>
                <Input
                  id="setups"
                  onChange={(e) => handleArrayInput("setups", e.target.value)}
                  placeholder="Incall, Outcall, Mobile"
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
          )}

          {/* Rates Tab */}
          {currentTab === "rates" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Incall Rates</h3>
                {rates.incall.map((rate, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-white">Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={rate.duration}
                        onChange={(e) => {
                          const newRates = [...rates.incall];
                          newRates[index].duration = parseInt(e.target.value);
                          setRates({ ...rates, incall: newRates });
                        }}
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Price ($)</Label>
                      <Input
                        type="number"
                        value={rate.price}
                        onChange={(e) => {
                          const newRates = [...rates.incall];
                          newRates[index].price = parseInt(e.target.value);
                          setRates({ ...rates, incall: newRates });
                        }}
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Outcall Rates</h3>
                {rates.outcall.map((rate, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-white">Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={rate.duration}
                        onChange={(e) => {
                          const newRates = [...rates.outcall];
                          newRates[index].duration = parseInt(e.target.value);
                          setRates({ ...rates, outcall: newRates });
                        }}
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Price ($)</Label>
                      <Input
                        type="number"
                        value={rate.price}
                        onChange={(e) => {
                          const newRates = [...rates.outcall];
                          newRates[index].price = parseInt(e.target.value);
                          setRates({ ...rates, outcall: newRates });
                        }}
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-200">
                  Note: Price per minute cannot exceed 33% of your base rate
                </p>
              </div>
            </div>
          )}

          {/* Hours Tab */}
          {currentTab === "hours" && (
            <div className="space-y-4">
              {Object.entries(hours).map(([day, time]) => (
                <div key={day} className="grid grid-cols-3 gap-4 items-center">
                  <Label className="text-white capitalize">{day}</Label>
                  <Input
                    type="time"
                    value={time.open}
                    onChange={(e) =>
                      setHours({ ...hours, [day]: { ...time, open: e.target.value } })
                    }
                    className="bg-slate-900 border-slate-700"
                  />
                  <Input
                    type="time"
                    value={time.close}
                    onChange={(e) =>
                      setHours({ ...hours, [day]: { ...time, close: e.target.value } })
                    }
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
