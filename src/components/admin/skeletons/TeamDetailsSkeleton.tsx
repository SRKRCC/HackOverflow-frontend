export default function TeamDetailsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Team Basic Info Skeleton */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
        <div className="h-5 bg-orange-200 dark:bg-orange-800 rounded w-32 mb-3"></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="col-span-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Team Members Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-3"></div>
        <div className="space-y-4">
          {/* Member cards skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-1"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-10 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-14 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                </div>
                <div className="sm:col-span-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-14 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status Skeleton */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="h-5 bg-blue-300 dark:bg-blue-700 rounded w-32 mb-3"></div>
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}