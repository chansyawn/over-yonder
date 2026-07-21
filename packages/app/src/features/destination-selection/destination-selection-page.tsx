import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import type { DestinationSummary } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";
import { DestinationCard } from "./destination-card.tsx";

interface DestinationSelectionPageProps {
  readonly destinations: readonly DestinationSummary[];
}

export function DestinationSelectionPage({ destinations }: DestinationSelectionPageProps) {
  return (
    <main className="text-foreground min-h-screen px-8 py-8 font-sans">
      <header className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center font-serif">
        <Link
          aria-label={m.back_to_main_menu_action()}
          className="text-muted-foreground hover:text-foreground items-center rounded-sm uppercase"
          to="/"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-5" />
        </Link>
        <h1 className="text-center text-2xl tracking-widest uppercase">
          {m.destination_selection_title()}
        </h1>
        <span className="text-muted-foreground justify-self-end tracking-widest tabular-nums">
          {destinations.length}
        </span>
      </header>

      <section
        aria-label={m.available_destinations_label()}
        className="mx-auto mt-6 grid w-full max-w-7xl grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {destinations.map((destination, index) => (
          <DestinationCard
            key={`${destination.packId}:${destination.id}`}
            destination={destination}
            priority={index === 0}
          />
        ))}
      </section>
    </main>
  );
}
