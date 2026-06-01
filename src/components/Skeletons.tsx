export function MapSkeleton() {
  return (
    <div className="w-full h-64 bg-neutral-900 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Memuat peta interaktif...</span>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 bg-neutral-900 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
