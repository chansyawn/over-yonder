import { Link } from "@tanstack/react-router";
import type { DestinationSummary } from "@/features/scene-pack/model.ts";

interface DestinationCardProps {
  readonly destination: DestinationSummary;
  readonly priority: boolean;
}

export function DestinationCard({ destination, priority }: DestinationCardProps) {
  return (
    <Link
      className="group border-yonder-rule bg-yonder-paper/80 hover:border-yonder-accent focus-visible:border-yonder-accent focus-visible:ring-yonder-focus focus-visible:ring-offset-yonder-paper active:border-yonder-accent grid grid-cols-1 overflow-hidden rounded-xl border transition-[border-color,transform] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0"
      params={{ destinationId: destination.id }}
      to="/destinations/$destinationId"
    >
      <div className="border-yonder-rule bg-yonder-paper-muted aspect-[2.15/1] overflow-hidden border-b">
        <img
          alt={destination.image.alt}
          className="h-full w-full object-cover saturate-[0.9]"
          height={destination.image.height}
          loading={priority ? "eager" : "lazy"}
          src={destination.image.src}
          width={destination.image.width}
        />
      </div>
      <div className="flex h-36 min-w-0 flex-col p-3 md:p-4">
        <h2 className="font-yonder-display group-focus-visible:text-yonder-accent group-active:text-yonder-accent truncate text-xl leading-tight font-normal transition-colors motion-reduce:transition-none md:text-2xl">
          {destination.title}
        </h2>
        <p className="text-yonder-muted mt-1 line-clamp-2 text-xs leading-5 md:text-sm">
          {destination.description}
        </p>
        <div className="border-yonder-rule/70 text-yonder-muted group-focus-visible:text-yonder-accent group-active:text-yonder-accent mt-auto flex items-center justify-between gap-2 border-t pt-2 text-xs tracking-[0.04em] transition-colors motion-reduce:transition-none md:gap-3">
          <p>
            {destination.spotCount} spots
            <span aria-hidden="true" className="text-yonder-rule mx-1.5 md:mx-2">
              ·
            </span>
            {destination.sceneCount} scenes
          </p>
          <span
            aria-hidden="true"
            className="yonder-compass relative size-6 shrink-0 rounded-full border border-current md:size-7"
          >
            <span className="bg-yonder-paper absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-current" />
          </span>
        </div>
      </div>
    </Link>
  );
}
