export default function WalletLoading() {
  return (
    <div className="app-container py-6 space-y-6 pb-24 animate-pulse">
      {/* Balance Card Skeleton */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-9 w-44 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="flex gap-6 pt-2">
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 rounded-xl py-4 border border-gray-100 dark:border-gray-800"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      {/* Month Summary Skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="flex gap-6">
          <div className="h-8 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-8 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>

      {/* Transaction Filter Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0" />
        ))}
      </div>

      {/* Transaction List Skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded ml-auto" />
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
