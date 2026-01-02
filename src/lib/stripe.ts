import Stripe from "stripe";

// Server-side Stripe instance
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    })
  : null;

// Price IDs for subscription plans
export const STRIPE_PRICES = {
  free: null,
  standard: process.env.STRIPE_PRICE_STANDARD || "price_standard_monthly",
  pro: process.env.STRIPE_PRICE_PRO || "price_pro_monthly",
  elite: process.env.STRIPE_PRICE_ELITE || "price_elite_monthly",
} as const;

// Plan prices in cents for display
export const PLAN_PRICES = {
  free: 0,
  standard: 4900, // $49
  pro: 8900, // $89
  elite: 14900, // $149
} as const;

// Stripe publishable key for client-side
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
