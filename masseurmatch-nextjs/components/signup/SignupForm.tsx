"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  "Relaxing Massage",
  "Deep Tissue",
  "Sports",
  "Lymphatic Drainage",
  "Reflexology",
  "Shiatsu",
  "Mobile service"
];

interface FormData {
  fullName: string;
  email: string;
  city: string;
  state: string;
  services: string[];
  incallOutcall: string[];
  password: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    city: "",
    state: "",
    services: [],
    incallOutcall: [],
    password: ""
  });

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Required field checks
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Array validations
    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
    }
    if (formData.incallOutcall.length === 0) {
      newErrors.incallOutcall = "Please select incall and/or outcall";
    }

    // Terms agreement
    if (!agree) {
      newErrors.agree = "You must agree to the terms to continue";
    }

    return newErrors;
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleIncallOutcall = (option: string) => {
    setFormData(prev => ({
      ...prev,
      incallOutcall: prev.incallOutcall.includes(option)
        ? prev.incallOutcall.filter(o => o !== option)
        : [...prev.incallOutcall, option]
    }));
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    // Clear errors and set loading
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/therapist/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          fullName: formData.fullName.trim(),
          displayName: formData.fullName.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          location: `${formData.city.trim()}, ${formData.state.trim()}`,
          services: formData.services,
          languages: ["English"],
          agree: agree,
          plan: "free",
          planName: "Free",
          priceMonthly: 0
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error - please try again later");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Success - redirect to onboarding
      router.push("/onboarding");
    } catch (error: any) {
      setSubmitError(
        error.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="mb-12 rounded-2xl p-8"
      style={{
        background: "var(--panel)",
        border: "1px solid var(--stroke)"
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global Error */}
        {submitError && (
          <div
            className="flex items-start gap-3 rounded-lg p-4"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)"
            }}
          >
            <AlertCircle
              className="h-5 w-5 shrink-0"
              style={{ color: "var(--danger)" }}
            />
            <div>
              <p
                className="font-medium"
                style={{ color: "var(--danger)" }}
              >
                Error
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {submitError}
              </p>
            </div>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange("fullName")}
            className="w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2"
            style={{
              background: "var(--panel-2)",
              borderColor: errors.fullName
                ? "var(--danger)"
                : "var(--stroke)",
              color: "var(--text)"
            }}
            placeholder="e.g., John Smith"
            disabled={isSubmitting}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="mt-1 text-sm"
              style={{ color: "var(--danger)" }}
              role="alert"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            className="w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2"
            style={{
              background: "var(--panel-2)",
              borderColor: errors.email ? "var(--danger)" : "var(--stroke)",
              color: "var(--text)"
            }}
            placeholder="your@email.com"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 text-sm"
              style={{ color: "var(--danger)" }}
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* City & State */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              City
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange("city")}
              className="w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2"
              style={{
                background: "var(--panel-2)",
                borderColor: errors.city ? "var(--danger)" : "var(--stroke)",
                color: "var(--text)"
              }}
              placeholder="e.g., Miami"
              disabled={isSubmitting}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
            />
            {errors.city && (
              <p
                id="city-error"
                className="mt-1 text-sm"
                style={{ color: "var(--danger)" }}
                role="alert"
              >
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              State
            </label>
            <input
              id="state"
              type="text"
              value={formData.state}
              onChange={handleInputChange("state")}
              className="w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2"
              style={{
                background: "var(--panel-2)",
                borderColor: errors.state ? "var(--danger)" : "var(--stroke)",
                color: "var(--text)"
              }}
              placeholder="e.g., FL"
              disabled={isSubmitting}
              aria-invalid={!!errors.state}
              aria-describedby={errors.state ? "state-error" : undefined}
            />
            {errors.state && (
              <p
                id="state-error"
                className="mt-1 text-sm"
                style={{ color: "var(--danger)" }}
                role="alert"
              >
                {errors.state}
              </p>
            )}
          </div>
        </div>

        {/* Services Offered */}
        <fieldset>
          <legend
            className="mb-3 text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Services Offered
          </legend>
          <div className="grid gap-2 md:grid-cols-2">
            {SERVICES.map(service => (
              <label
                key={service}
                className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition hover:border-opacity-50"
                style={{
                  background: "var(--panel-2)",
                  borderColor: "var(--stroke)",
                  color: "var(--text)"
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => toggleService(service)}
                  className="h-4 w-4 rounded"
                  disabled={isSubmitting}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
          {errors.services && (
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--danger)" }}
              role="alert"
            >
              {errors.services}
            </p>
          )}
        </fieldset>

        {/* Incall/Outcall */}
        <fieldset>
          <legend
            className="mb-3 text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Service Location
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition hover:border-opacity-50"
              style={{
                background: "var(--panel-2)",
                borderColor: "var(--stroke)",
                color: "var(--text)"
              }}
            >
              <input
                type="checkbox"
                checked={formData.incallOutcall.includes("incall")}
                onChange={() => toggleIncallOutcall("incall")}
                className="h-4 w-4 rounded"
                disabled={isSubmitting}
              />
              <div>
                <div className="font-medium">Incall</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  Clients visit your location
                </div>
              </div>
            </label>

            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition hover:border-opacity-50"
              style={{
                background: "var(--panel-2)",
                borderColor: "var(--stroke)",
                color: "var(--text)"
              }}
            >
              <input
                type="checkbox"
                checked={formData.incallOutcall.includes("outcall")}
                onChange={() => toggleIncallOutcall("outcall")}
                className="h-4 w-4 rounded"
                disabled={isSubmitting}
              />
              <div>
                <div className="font-medium">Outcall</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  You travel to clients
                </div>
              </div>
            </label>
          </div>
          {errors.incallOutcall && (
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--danger)" }}
              role="alert"
            >
              {errors.incallOutcall}
            </p>
          )}
        </fieldset>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Create Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange("password")}
              className="w-full rounded-xl border px-4 py-3 pr-12 text-sm transition focus:outline-none focus:ring-2"
              style={{
                background: "var(--panel-2)",
                borderColor: errors.password
                  ? "var(--danger)"
                  : "var(--stroke)",
                color: "var(--text)"
              }}
              placeholder="Min 6 characters"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="mt-1 text-sm"
              style={{ color: "var(--danger)" }}
              role="alert"
            >
              {errors.password}
            </p>
          )}
        </div>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded"
              disabled={isSubmitting}
              aria-invalid={!!errors.agree}
              aria-describedby={errors.agree ? "agree-error" : undefined}
            />
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              I agree to the{" "}
              <Link
                href="/legal/terms"
                className="underline"
                style={{ color: "var(--violet)" }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy-policy"
                className="underline"
                style={{ color: "var(--violet)" }}
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agree && (
            <p
              id="agree-error"
              className="mt-1 text-sm"
              style={{ color: "var(--danger)" }}
              role="alert"
            >
              {errors.agree}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-4 text-base font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating your account...
              </span>
            ) : (
              "Create My Profile"
            )}
          </button>
          <p
            className="text-center text-sm"
            style={{ color: "var(--muted)" }}
          >
            Takes less than 3 minutes
          </p>
        </div>

        {/* Disclaimer Microcopy */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: "var(--muted)" }}
        >
          MasseurMatch is a directory platform only. We do not process bookings,
          payments, or verify professional licenses.
        </p>
      </form>
    </section>
  );
}
