import { PageNavigation } from "#app/features/page-navigation/page-navigation.tsx";
import type { DestinationDetail } from "#app/features/scene-pack/model.ts";
import { DestinationMap } from "./destination-map.tsx";

interface DestinationPageProps {
  readonly destination: DestinationDetail;
}

export function DestinationPage({ destination }: DestinationPageProps) {
  return (
    <main className="bg-background text-foreground relative h-dvh min-h-0 overflow-hidden font-sans">
      <section className="absolute inset-0 overflow-hidden">
        <DestinationMap destination={destination} />
      </section>

      <PageNavigation />
    </main>
  );
}
