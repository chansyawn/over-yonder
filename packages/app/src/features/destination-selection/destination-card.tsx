import { Link } from "@tanstack/react-router";
import type { DestinationSummary } from "@/features/scene-pack/model.ts";

interface DestinationCardProps {
  readonly destination: DestinationSummary;
  readonly priority: boolean;
}

export function DestinationCard({ destination, priority }: DestinationCardProps) {
  return (
    <Link
      className="group border-yonder-rule bg-yonder-paper/80 shadow-yonder-card hover:border-yonder-accent focus-visible:border-yonder-accent focus-visible:ring-yonder-focus focus-visible:ring-offset-yonder-paper active:border-yonder-accent active:shadow-yonder-glow grid grid-cols-1 overflow-hidden rounded-xl border transition-[border-color,box-shadow,transform] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0 sm:max-md:h-44 sm:max-md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:grid-cols-1"
      params={{ destinationId: destination.id }}
      to="/destinations/$destinationId"
    >
      <div className="border-yonder-rule bg-yonder-paper-muted aspect-[2.15/1] overflow-hidden border-b sm:max-md:aspect-auto sm:max-md:h-full sm:max-md:border-r sm:max-md:border-b-0 md:aspect-[2.15/1]">
        <img
          alt={destination.image.alt}
          className="h-full w-full object-cover saturate-[0.9]"
          height={destination.image.height}
          loading={priority ? "eager" : "lazy"}
          src={destination.image.src}
          width={destination.image.width}
        />
      </div>
      <div className="flex h-36 min-w-0 flex-col p-3 sm:max-md:h-full md:p-4">
        <h2 className="font-yonder-display group-focus-visible:text-yonder-accent group-active:text-yonder-accent truncate text-xl leading-tight font-normal transition-colors motion-reduce:transition-none sm:text-2xl">
          {destination.title}
        </h2>
        <p className="text-yonder-muted mt-1 line-clamp-2 text-xs leading-5 sm:text-sm">
          {destination.description}
        </p>
        <div className="border-yonder-rule/70 text-yonder-muted group-focus-visible:text-yonder-accent group-active:text-yonder-accent mt-auto flex items-center justify-between gap-3 border-t pt-2 text-xs tracking-[0.04em] transition-colors motion-reduce:transition-none">
          <p>
            {destination.spotCount} spots
            <span aria-hidden="true" className="text-yonder-rule mx-2">
              ·
            </span>
            {destination.sceneCount} scenes
          </p>
          <span
            aria-hidden="true"
            className="yonder-compass relative size-7 shrink-0 rounded-full border border-current"
          >
            <span className="bg-yonder-paper absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-current" />
          </span>
        </div>
      </div>
    </Link>
  );
}
