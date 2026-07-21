import { Link } from "@tanstack/react-router";
import CompassIcon from "#app/assets/icons/compass.svg?react";
import type { DestinationSummary } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";

interface DestinationCardProps {
  readonly destination: DestinationSummary;
  readonly priority: boolean;
}

export function DestinationCard({ destination, priority }: DestinationCardProps) {
  const spotCount =
    destination.spotCount === 1
      ? m.destination_spot_count_one({ count: destination.spotCount })
      : m.destination_spot_count_other({ count: destination.spotCount });
  const sceneCount =
    destination.sceneCount === 1
      ? m.destination_scene_count_one({ count: destination.sceneCount })
      : m.destination_scene_count_other({ count: destination.sceneCount });

  return (
    <Link
      className="border-border bg-background/88 relative grid min-w-0 grid-cols-1 overflow-hidden rounded-lg border p-3 outline-none"
      params={{ packId: destination.packId, destinationId: destination.id }}
      to="/packs/$packId/destinations/$destinationId"
    >
      <span
        aria-hidden="true"
        className="border-border pointer-events-none absolute inset-1 z-10 rounded-md border"
      />
      <div className="border-border bg-muted aspect-2.25/1 overflow-hidden rounded-md border">
        <img
          className="block h-full w-full min-w-0 object-cover"
          loading={priority ? "eager" : "lazy"}
          src={destination.image.src}
        />
      </div>
      <div className="flex h-24 min-w-0 flex-col px-2 pt-2 pb-1">
        <h2 className="truncate font-serif text-xl font-normal">{destination.title}</h2>
        <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{destination.description}</p>
        <div className="border-border/70 text-muted-foreground mt-auto flex items-center justify-between gap-2 border-t pt-1.5 text-xs tracking-wide md:gap-3">
          <p>{`${spotCount} · ${sceneCount}`}</p>
          <CompassIcon aria-hidden="true" className="size-5 shrink-0 stroke-1" />
        </div>
      </div>
    </Link>
  );
}
