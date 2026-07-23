export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors">
      <div className="app-container py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-48 md:h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 w-full" />

        {/* Categories Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="h-7 w-56 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 space-y-3"
              >
                <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-full pt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
