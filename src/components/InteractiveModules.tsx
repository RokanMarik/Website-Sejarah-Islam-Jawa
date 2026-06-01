'use client';

import dynamic from "next/dynamic";
import { MapSkeleton, TimelineSkeleton } from "@/components/Skeletons";

const JavaMap = dynamic(() => import("@/components/JavaMap"), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

const Timeline = dynamic(() => import("@/components/Timeline"), {
  loading: () => <TimelineSkeleton />,
  ssr: false,
});

export function InteractiveModules() {
  return (
    <>
      <div className="w-full">
        <JavaMap />
      </div>
      <div className="w-full">
        <Timeline />
      </div>
    </>
  );
}
