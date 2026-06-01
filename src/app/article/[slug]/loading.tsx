import { SkeletonArticle } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <SkeletonArticle />
      </div>
    </div>
  );
}
