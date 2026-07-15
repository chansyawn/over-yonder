import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, MapIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { DestinationDetail, SpotDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";
import { DestinationMap } from "./destination-map.tsx";
import { ScenePickerDrawer } from "./scene-picker-drawer.tsx";

interface SpotSelectionPageProps {
  readonly destination: DestinationDetail;
}

export function SpotSelectionPage({ destination }: SpotSelectionPageProps) {
  const [selectedSpot, setSelectedSpot] = useState<SpotDetail>();
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <main className="bg-panel text-foreground relative h-dvh min-h-0 overflow-hidden font-sans">
      <p className="sr-only" id="destination-map-instructions">
        {m.map_navigation_hint()}
      </p>
      <section className="absolute inset-0 overflow-hidden">
        <DestinationMap
          destination={destination}
          selectedSpotId={selectedSpot?.id}
          onSelectSpot={(spot, trigger) => {
            lastTriggerRef.current = trigger;
            setSelectedSpot(spot);
          }}
        />
      </section>

      <header className="pointer-events-none absolute top-6 left-5 z-20 max-w-[min(32rem,calc(100vw-2.5rem))] sm:top-8 sm:left-8">
        <Link
          className="border-border bg-panel/92 focus-visible:ring-foreground/45 pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm backdrop-blur-sm outline-none focus-visible:ring-2"
          to="/destinations"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          {m.all_destinations_action()}
        </Link>
        <div className="mt-4 sm:mt-6">
          <p className="flex items-center gap-2 text-xs tracking-widest uppercase">
            <MapIcon aria-hidden="true" className="size-4" />
            {m.destination_map_label()}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-none font-normal sm:text-6xl">
            {destination.title}
          </h1>
          <p className="mt-2 line-clamp-2 max-w-xs text-xs leading-5 sm:mt-3 sm:max-w-md sm:text-sm sm:leading-6">
            {destination.description}
          </p>
        </div>
      </header>

      <ScenePickerDrawer
        destinationId={destination.id}
        finalFocusRef={lastTriggerRef}
        spot={selectedSpot}
        onClose={() => setSelectedSpot(undefined)}
      />
    </main>
  );
}
