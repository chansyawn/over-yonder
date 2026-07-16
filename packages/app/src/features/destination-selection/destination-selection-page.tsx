import type { DestinationSummary } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";
import { DestinationCard } from "./destination-card.tsx";

interface DestinationSelectionPageProps {
  readonly destinations: readonly DestinationSummary[];
}

export function DestinationSelectionPage({ destinations }: DestinationSelectionPageProps) {
  return (
    <main className="text-foreground xs:px-10 xs:py-10 min-h-screen px-5 py-5 font-sans sm:px-8 sm:py-8 md:px-12 md:py-10">
      <section
        aria-label={m.available_destinations_label()}
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {destinations.map((destination, index) => (
          <DestinationCard key={destination.id} destination={destination} priority={index === 0} />
        ))}
      </section>
    </main>
  );
}
