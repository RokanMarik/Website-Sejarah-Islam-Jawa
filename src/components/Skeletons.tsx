export function SkeletonArticle() {
  return (
    <article className="animate-pulse">
      <div className="h-64 bg-neutral-800 rounded-t-xl w-full" />
      <div className="bg-neutral-900 border border-gray-800 rounded-b-xl p-6 space-y-4">
        <div className="h-4 bg-gray-800 rounded w-1/4" />
        <div className="h-8 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-800 rounded w-2/3" />
      </div>
    </article>
  );
}

export function SkeletonKamus() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="h-10 bg-gray-800 rounded w-full" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-20 bg-gray-800 rounded-full" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-8 bg-gray-800 rounded w-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 space-y-3">
                <div className="h-6 bg-gray-800 rounded w-1/3" />
                <div className="h-4 bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTimeline() {
  return (
    <div className="space-y-12 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-neutral-900 border border-gray-800 p-6 rounded-xl space-y-3">
          <div className="h-8 bg-gray-800 rounded w-1/4" />
          <div className="h-5 bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-800 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
