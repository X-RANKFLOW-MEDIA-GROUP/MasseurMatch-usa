"use client";

import React from "react";
import Link from "next/link";
import "./CitiesSection.css";

const TOP_CITIES = [
  "New York",
  "San Francisco",
  "Los Angeles",
  "Chicago",
  "Dallas",
  "Miami",
  "Austin",
  "Seattle",
  "Atlanta",
  "Boston",
];

export function CitiesSection() {
  return (
    <section className="cities-section">
      <h2 className="cities-title">Find Gay Massage in Your City</h2>

      <div className="cities-grid">
        {TOP_CITIES.map((city) => (
          <Link
            key={city}
            href={`/explore?city=${encodeURIComponent(city)}`}
            className="city-card"
          >
            {city}
          </Link>
        ))}
      </div>

      {/*<a href="/cities" className="cities-link">
        View All 300+ Cities →
      </a>*/}
    </section>
  );
}
