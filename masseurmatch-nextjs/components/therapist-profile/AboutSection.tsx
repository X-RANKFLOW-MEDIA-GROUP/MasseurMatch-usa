"use client";

interface AboutSectionProps {
  about?: string;
  philosophy?: string;
  specialties?: string[];
  languages?: string[];
}

export function AboutSection({
  about,
  philosophy,
  specialties,
  languages,
}: AboutSectionProps) {
  if (!about && !philosophy && !specialties?.length && !languages?.length) {
    return null;
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {about && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  About Me
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {about}
                  </p>
                </div>
              </div>
            )}

            {/* Philosophy */}
            {philosophy && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  My Philosophy
                </h3>
                <div className="bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-600 dark:border-purple-400 p-6 rounded-r-xl">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    {philosophy}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Specialties */}
            {specialties && specialties.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>✨</span>
                  <span>Specialties</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🌍</span>
                  <span>Languages</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
