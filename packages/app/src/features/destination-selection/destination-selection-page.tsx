import type { DestinationSummary } from "@/features/scene-pack/model.ts";
import { DestinationCard } from "./destination-card.tsx";
import "./destination-selection.css";

interface DestinationSelectionPageProps {
  readonly destinations: readonly DestinationSummary[];
}

export function DestinationSelectionPage({ destinations }: DestinationSelectionPageProps) {
  return (
    <main className="yonder-paper-surface font-yonder-body text-yonder-ink relative flex min-h-screen flex-col overflow-hidden px-5 py-8 sm:px-10 sm:py-10 lg:px-20 lg:py-12">
      <div
        aria-hidden="true"
        className="border-yonder-rule/55 pointer-events-none absolute inset-2 rounded-[1.35rem] border sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="yonder-orbit-field pointer-events-none absolute top-0 right-0 hidden size-72 md:block lg:size-96"
      />
      <div
        aria-hidden="true"
        className="bg-yonder-rule/60 pointer-events-none absolute top-24 bottom-20 left-7 hidden w-px md:block lg:left-12"
      >
        <span className="border-yonder-rule bg-yonder-paper absolute top-0 left-1/2 size-2 -translate-x-1/2 rotate-45 border" />
        <span className="border-yonder-rule bg-yonder-paper absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rotate-45 border" />
      </div>
      <div
        aria-hidden="true"
        className="bg-yonder-rule/60 pointer-events-none absolute top-64 right-7 bottom-24 hidden w-px md:block lg:right-12"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <header className="mb-8 max-w-3xl sm:mb-10 lg:mb-12">
          <div className="text-yonder-muted mb-5 flex items-center gap-3 text-xs tracking-[0.2em] uppercase sm:text-sm">
            <span aria-hidden="true" className="bg-yonder-rule size-1.5 rounded-full" />
            <span>Over Yonder</span>
            <span aria-hidden="true" className="bg-yonder-rule h-px w-16 sm:w-24" />
          </div>
          <h1 className="font-yonder-display text-5xl leading-[0.95] font-normal tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            Destinations
          </h1>
          <p className="text-yonder-muted mt-3 text-base tracking-[0.02em] sm:text-lg">
            Open a place and begin wandering.
          </p>
        </header>

        <section
          aria-label="Available destinations"
          className="grid grid-cols-1 justify-center gap-4 md:grid-cols-[repeat(auto-fit,minmax(20rem,25rem))] md:gap-5"
        >
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              priority={index === 0}
            />
          ))}
        </section>

        <footer className="text-yonder-muted mt-auto flex items-center gap-3 pt-10 text-center text-xs tracking-[0.08em] sm:pt-14 sm:text-sm lg:pt-16">
          <span aria-hidden="true" className="bg-yonder-rule/70 h-px flex-1" />
          <p>Select a destination to continue</p>
          <span aria-hidden="true" className="bg-yonder-rule/70 h-px flex-1" />
        </footer>
      </div>
    </main>
  );
}
