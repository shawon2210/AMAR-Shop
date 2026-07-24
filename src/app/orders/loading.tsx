export default function OrdersLoading() {
  return (
    <div className="app-container py-6 pb-24 space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto hide-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-md shrink-0" />
        ))}
      </div>

      {/* Order Cards Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Card Content */}
            <div className="p-4 flex gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
