export default function SellerLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4" />
        ))}
      </div>
      <div className="h-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4" />
    </div>
  );
}
