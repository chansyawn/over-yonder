import { useRef, useState } from "react";
import { PageNavigation } from "#app/features/page-navigation/page-navigation.tsx";
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

      <PageNavigation />

      <ScenePickerDrawer
        destinationId={destination.id}
        finalFocusRef={lastTriggerRef}
        spot={selectedSpot}
        onClose={() => setSelectedSpot(undefined)}
      />
    </main>
  );
}
