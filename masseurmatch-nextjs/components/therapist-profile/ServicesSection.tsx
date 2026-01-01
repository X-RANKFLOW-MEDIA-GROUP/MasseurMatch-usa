"use client";

import { Check } from "lucide-react";

interface ServicesSectionProps {
  services?: string[];
  massageTechniques?: string[];
  additionalServices?: string[];
}

export function ServicesSection({
  services,
  massageTechniques,
  additionalServices,
}: ServicesSectionProps) {
  if (!services?.length && !massageTechniques?.length && !additionalServices?.length) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Services & Techniques
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Specialized massage therapy services tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Services */}
          {services && services.length > 0 && (
            <ServiceCard
              title="Services"
              items={services}
              icon="💆"
              color="purple"
            />
          )}

          {/* Massage Techniques */}
          {massageTechniques && massageTechniques.length > 0 && (
            <ServiceCard
              title="Techniques"
              items={massageTechniques}
              icon="✋"
              color="blue"
            />
          )}

          {/* Additional Services */}
          {additionalServices && additionalServices.length > 0 && (
            <ServiceCard
              title="Additional"
              items={additionalServices}
              icon="➕"
              color="pink"
            />
          )}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  title: string;
  items: string[];
  icon: string;
  color: "purple" | "blue" | "pink";
}

function ServiceCard({ title, items, icon, color }: ServiceCardProps) {
  const colorClasses = {
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      icon: "text-purple-600 dark:text-purple-400",
      check: "text-purple-600 dark:text-purple-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      check: "text-blue-600 dark:text-blue-400",
    },
    pink: {
      bg: "bg-pink-50 dark:bg-pink-900/20",
      border: "border-pink-200 dark:border-pink-800",
      icon: "text-pink-600 dark:text-pink-400",
      check: "text-pink-600 dark:text-pink-400",
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`${classes.bg} ${classes.border} border rounded-xl p-6 h-full`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`w-5 h-5 ${classes.check} flex-shrink-0 mt-0.5`} />
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
