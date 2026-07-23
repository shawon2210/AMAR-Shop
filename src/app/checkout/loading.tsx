export default function CheckoutLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 bg-gray-50/50 dark:bg-gray-950 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Form skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          ))}
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        {/* Order summary skeleton */}
        <div className="space-y-4 border rounded-xl p-4 bg-white dark:bg-gray-900">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          ))}
          <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
}
