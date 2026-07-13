import { Link } from "@tanstack/react-router";
import type { DestinationSummary } from "@/features/scene-pack/model.ts";

interface DestinationCardProps {
  readonly destination: DestinationSummary;
  readonly priority: boolean;
}

export function DestinationCard({ destination, priority }: DestinationCardProps) {
  return (
    <Link
      className="group border-yonder-rule bg-yonder-paper/80 hover:border-yonder-accent focus-visible:border-yonder-accent focus-visible:ring-yonder-focus focus-visible:ring-offset-yonder-paper active:border-yonder-accent xs:h-44 xs:grid-cols-[minmax(7rem,2fr)_minmax(0,3fr)] grid grid-cols-1 overflow-hidden rounded-xl border transition-[border-color,transform] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0 md:h-auto md:grid-cols-1 md:only:h-44 md:only:grid-cols-[minmax(7rem,2fr)_minmax(0,3fr)]"
      params={{ destinationId: destination.id }}
      to="/destinations/$destinationId"
    >
      <div className="border-yonder-rule bg-yonder-paper-muted xs:aspect-auto xs:h-full xs:border-r xs:border-b-0 aspect-[2.15/1] h-auto overflow-hidden border-b md:aspect-[2.15/1] md:h-auto md:border-r-0 md:border-b md:group-only:aspect-auto md:group-only:h-full md:group-only:border-r md:group-only:border-b-0">
        <img
          alt={destination.image.alt}
          className="h-full w-full object-cover saturate-[0.9]"
          height={destination.image.height}
          loading={priority ? "eager" : "lazy"}
          src={destination.image.src}
          width={destination.image.width}
        />
      </div>
      <div className="xs:h-full flex h-36 min-w-0 flex-col p-3 md:h-36 md:p-4 md:group-only:h-full">
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
