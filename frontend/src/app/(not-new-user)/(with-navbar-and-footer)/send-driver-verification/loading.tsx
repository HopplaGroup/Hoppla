// send-driver-verification/loading.tsx
export default function Loading() {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex justify-center mb-6">
                <div className="h-8 w-40 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              
              <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4"></div>
              <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse mx-auto mb-8"></div>
              
              <div className="space-y-6">
                <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }