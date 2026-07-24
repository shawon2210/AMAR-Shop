export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-3 sm:px-4 py-6 sm:py-8 animate-pulse">
      <div className="w-full max-w-[440px] bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
        {/* Header Skeleton */}
        <div className="text-center space-y-2 mb-2">
          <div className="h-7 w-44 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto" />
          <div className="h-4 w-56 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>

          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>

          {/* Checkbox / Link Skeleton */}
          <div className="flex items-center justify-between pt-1">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>

          {/* Primary Button Skeleton */}
          <div className="h-11 w-full bg-gray-200 dark:bg-gray-800 rounded-lg pt-2" />
        </div>

        {/* Footer Link Skeleton */}
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto mt-4" />

        {/* Divider Skeleton */}
        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded mx-auto my-4" />

        {/* Social / Demo Action Buttons Skeleton */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
