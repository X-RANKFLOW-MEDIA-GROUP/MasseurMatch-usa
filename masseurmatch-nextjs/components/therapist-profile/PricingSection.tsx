"use client";

import { Clock, DollarSign, Home, MapPin } from "lucide-react";

interface Rate {
  duration: string;
  price: string;
  type: "incall" | "outcall";
}

interface PricingSectionProps {
  rate60?: string;
  rate90?: string;
  rate120?: string;
  rateOutcall?: string;
  incallEnabled?: boolean;
  outcallEnabled?: boolean;
  mobileServiceRadius?: number;
}

export function PricingSection({
  rate60,
  rate90,
  rate120,
  rateOutcall,
  incallEnabled = true,
  outcallEnabled = false,
  mobileServiceRadius,
}: PricingSectionProps) {
  const incallRates: Rate[] = [];
  const outcallRates: Rate[] = [];

  if (incallEnabled) {
    if (rate60) incallRates.push({ duration: "60 min", price: rate60, type: "incall" });
    if (rate90) incallRates.push({ duration: "90 min", price: rate90, type: "incall" });
    if (rate120) incallRates.push({ duration: "120 min", price: rate120, type: "incall" });
  }

  if (outcallEnabled && rateOutcall) {
    outcallRates.push({ duration: "60 min", price: rateOutcall, type: "outcall" });
  }

  if (!incallRates.length && !outcallRates.length) {
    return null;
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Transparent pricing for quality service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* In-Call Rates */}
          {incallRates.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600 dark:bg-purple-500 rounded-xl">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    In-Call
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visit my studio
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {incallRates.map((rate, index) => (
                  <RateCard key={index} rate={rate} />
                ))}
              </div>
            </div>
          )}

          {/* Out-Call Rates */}
          {outcallRates.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Out-Call
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    I come to you
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {outcallRates.map((rate, index) => (
                  <RateCard key={index} rate={rate} />
                ))}
                {mobileServiceRadius && (
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Service radius:</span> {mobileServiceRadius} miles
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prices are subject to change. Please confirm when booking.
          </p>
        </div>
      </div>
    </section>
  );
}

function RateCard({ rate }: { rate: Rate }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {rate.duration}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {rate.price}
          </span>
        </div>
      </div>
    </div>
  );
}
