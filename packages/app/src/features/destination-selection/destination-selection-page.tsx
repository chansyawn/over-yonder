import type { DestinationSummary } from "#app/features/scene-pack/model.ts";
import { DestinationCard } from "./destination-card.tsx";
import "./destination-selection.css";

interface DestinationSelectionPageProps {
  readonly destinations: readonly DestinationSummary[];
}

export function DestinationSelectionPage({ destinations }: DestinationSelectionPageProps) {
  return (
    <main className="yonder-paper-surface font-yonder-body text-yonder-ink xs:px-10 xs:py-10 relative flex min-h-screen flex-col overflow-hidden px-8 py-8 md:px-20 md:py-12">
      <div
        aria-hidden="true"
        className="border-yonder-rule/55 pointer-events-none absolute inset-2 rounded-2xl border"
      />
      <div
        aria-hidden="true"
        className="yonder-orbit-field pointer-events-none absolute top-0 right-0 hidden size-96 md:block"
      />
      <div
        aria-hidden="true"
        className="bg-yonder-rule/60 pointer-events-none absolute top-24 bottom-20 left-12 hidden w-px md:block"
      >
        <span className="border-yonder-rule bg-yonder-paper absolute top-0 left-1/2 size-2 -translate-x-1/2 rotate-45 border" />
        <span className="border-yonder-rule bg-yonder-paper absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rotate-45 border" />
      </div>
      <div
        aria-hidden="true"
        className="bg-yonder-rule/60 pointer-events-none absolute top-64 right-12 bottom-24 hidden w-px md:block"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <header className="mb-4 max-w-3xl">
          <div className="text-yonder-muted mb-3 flex items-center gap-3 text-xs tracking-widest uppercase md:text-sm">
            <span aria-hidden="true" className="bg-yonder-rule size-1.5 rounded-full" />
            <span>Over Yonder</span>
            <span aria-hidden="true" className="bg-yonder-rule h-px w-16" />
          </div>
          <h1 className="font-yonder-display text-5xl font-normal tracking-tight md:text-6xl">
            Destinations
          </h1>
          <p className="text-yonder-muted mt-3 text-base tracking-wider md:text-lg">
            Open a place and begin wandering.
          </p>
        </header>

        <section
          aria-label="Available destinations"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              priority={index === 0}
            />
          ))}
        </section>

        <footer className="text-yonder-muted mt-auto flex items-center gap-3 pt-10 text-center text-xs tracking-widest md:text-sm">
          <span aria-hidden="true" className="bg-yonder-rule/70 h-px flex-1" />
          <p>Select a destination to continue</p>
          <span aria-hidden="true" className="bg-yonder-rule/70 h-px flex-1" />
        </footer>
      </div>
    </main>
  );
}
