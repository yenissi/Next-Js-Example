"use client";

type SkeletonType = "products" | "authors" | "users";

export default function LoadingSkeleton({
  type,
}: {
  type: SkeletonType;
}) {
  return (
    <div className="animate-pulse">

      {type === "products" && (
        <div className="fixed inset-0 bg-gray-100 flex justify-center pt-18 overflow-hidden">
          <div className="w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-xl p-6 flex flex-col mt-6">
            
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-40 bg-gray-300 rounded" />
              <div className="h-10 w-[200px] bg-gray-300 rounded" />
            </div>

            {/* LIST */}
            <div className="flex-1 space-y-3 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="h-4 w-48 bg-gray-300 rounded" />
                  <div className="h-8 w-16 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {type === "authors" && (
        <div className="p-6">
          <div className="h-8 w-40 bg-gray-300 rounded mx-auto mb-6" />
          <div className="space-y-3 max-w-xl mx-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      )}

      {type === "users" && (
        <div className="p-6">
          <div className="h-8 w-40 bg-gray-300 rounded mx-auto mb-6" />
          <div className="space-y-3 max-w-2xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-200 rounded space-y-2">
                <div className="h-4 w-40 bg-gray-300 rounded" />
                <div className="h-3 w-60 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}