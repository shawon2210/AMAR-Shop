export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>

      {/* Admin KPI Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      {/* Admin Data Table Skeleton */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-9 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-9 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800/60 rounded-lg w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
