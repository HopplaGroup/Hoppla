export default function Loading() {

    return (
      <div className="min-h-screen overflow-hidden bg-gray-50/50">
        {/* Dashboard Header Skeleton */}
        <div className="sticky top-0 left-0 z-20 w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-7 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 w-56 bg-gray-200 animate-pulse rounded mt-1"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
  
        {/* Main Content Skeleton */}
        <div className="container mx-auto px-4 py-6">
          {/* Header with Add Button Skeleton */}
          <section className="mb-6">
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </section>
  
          {/* Rules List Skeleton */}
          <section>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Desktop and tablet table skeleton */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700 text-sm">
                    <tr>
                      {[...Array(6)].map((_, i) => (
                        <th key={i} className="px-4 py-3">
                          <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-4">
                          <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="h-5 w-12 bg-gray-200 animate-pulse rounded ml-auto"></div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="h-5 w-20 bg-gray-200 animate-pulse rounded ml-auto"></div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center space-x-2">
                            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
  
              {/* Mobile list skeleton */}
              <div className="md:hidden w-full">
                <div className="bg-gray-50 px-4 py-3">
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-4 w-36 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }