export default function AccountLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 bg-gray-50/50 dark:bg-gray-950 animate-pulse">
      <div className="max-w-md w-full space-y-6">
        {/* Profile card skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
        {/* Navigation placeholders */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
