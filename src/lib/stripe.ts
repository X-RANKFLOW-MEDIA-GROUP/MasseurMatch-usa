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
  pro: process.env.STRIPE_PRICE_PRO || "price_pro_monthly",
  premium: process.env.STRIPE_PRICE_PREMIUM || "price_premium_monthly",
} as const;

// Stripe publishable key for client-side
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
