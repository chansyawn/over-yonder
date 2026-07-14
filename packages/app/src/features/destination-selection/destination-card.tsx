import { Link } from "@tanstack/react-router";
import CompassIcon from "@/assets/icons/compass.svg?react";
import type { DestinationSummary } from "@/features/scene-pack/model.ts";

interface DestinationCardProps {
  readonly destination: DestinationSummary;
  readonly priority: boolean;
}

export function DestinationCard({ destination, priority }: DestinationCardProps) {
  return (
    <Link
      className="border-yonder-rule bg-yonder-paper/88 relative grid min-w-0 grid-cols-1 overflow-hidden rounded-lg border p-3 outline-none"
      params={{ destinationId: destination.id }}
      to="/destinations/$destinationId"
    >
      <span
        aria-hidden="true"
        className="border-yonder-rule pointer-events-none absolute inset-1 z-10 rounded-md border"
      />
      <div className="border-yonder-rule bg-yonder-paper-muted aspect-2.25/1 overflow-hidden rounded-md border">
        <img
          alt={destination.image.alt}
          className="block h-full w-full min-w-0 object-cover"
          height={destination.image.height}
          loading={priority ? "eager" : "lazy"}
          src={destination.image.src}
          width={destination.image.width}
        />
      </div>
      <div className="flex h-24 min-w-0 flex-col px-2 pt-2 pb-1">
        <h2 className="font-yonder-display truncate text-xl font-normal">{destination.title}</h2>
        <p className="text-yonder-muted mt-1 line-clamp-1 text-xs">{destination.description}</p>
        <div className="border-yonder-rule/70 text-yonder-muted mt-auto flex items-center justify-between gap-2 border-t pt-1.5 text-xs tracking-wide md:gap-3">
          <p>
            {destination.spotCount} spots
            <span aria-hidden="true" className="text-yonder-rule mx-1.5 md:mx-2">
              ·
            </span>
            {destination.sceneCount} scenes
          </p>
          <CompassIcon aria-hidden="true" className="size-5 shrink-0 stroke-1" />
        </div>
      </div>
    </Link>
  );
}
