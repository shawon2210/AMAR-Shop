export default function CartLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 bg-gray-50/50 dark:bg-gray-950 animate-pulse">
      <div className="space-y-6 w-full max-w-2xl">
        {/* Cart items list skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 border-b pb-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
        {/* Summary block skeleton */}
        <div className="pt-4 space-y-2">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
}
