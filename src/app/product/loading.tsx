export default function ProductLoading() {
  return (
    <div className="app-container py-6 space-y-6 pb-24 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      {/* Product Gallery + Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Gallery Skeleton */}
        <section className="md:col-span-5 space-y-3">
          <div className="aspect-square w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 shrink-0" />
            ))}
          </div>
        </section>

        {/* Info Skeleton */}
        <section className="md:col-span-7">
          <div className="bg-white dark:bg-gray-900 p-4 md:p-5 rounded-xl space-y-4 border border-gray-100 dark:border-gray-800">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-14 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded-md" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>

            {/* Rating */}
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />

            {/* Price */}
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />

            {/* Seller Info */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>

            {/* Specs Skeleton */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="h-9 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="flex gap-3 pt-1">
                <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-4 pt-6">
        <div className="h-6 w-44 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 space-y-3">
              <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
