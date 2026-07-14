import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { DestinationDetail, SpotDetail } from "#app/features/scene-pack/model.ts";
import { ScenePickerDrawer } from "./scene-picker-drawer.tsx";

interface SpotSelectionPageProps {
  readonly destination: DestinationDetail;
}

export function SpotSelectionPage({ destination }: SpotSelectionPageProps) {
  const [selectedSpot, setSelectedSpot] = useState<SpotDetail>();
  const [imageFailed, setImageFailed] = useState(false);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      <header className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
        <Link
          className="inline-flex border border-black bg-white px-3 py-2 text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          to="/"
        >
          All destinations
        </Link>
        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">{destination.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6">{destination.description}</p>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 pb-6 sm:px-8">
        <div
          className="relative w-full max-w-6xl overflow-hidden border border-black bg-white"
          style={{ aspectRatio: `${destination.image.width} / ${destination.image.height}` }}
        >
          {imageFailed ? (
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div>
                <h2 className="text-2xl font-semibold">Destination image unavailable</h2>
                <p className="mt-2 text-sm">Return to the destination list and try another one.</p>
              </div>
            </div>
          ) : (
            <>
              <img
                alt={destination.image.alt}
                className="absolute inset-0 h-full w-full object-cover"
                height={destination.image.height}
                onError={() => setImageFailed(true)}
                src={destination.image.src}
                width={destination.image.width}
              />
              {destination.spots.map((spot) => {
                const isSelected = selectedSpot?.id === spot.id;

                return (
                  <button
                    key={spot.id}
                    aria-label={`Explore ${spot.title}`}
                    aria-pressed={isSelected}
                    className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    style={{
                      left: `${spot.position.x * 100}%`,
                      top: `${spot.position.y * 100}%`,
                    }}
                    type="button"
                    onClick={(event) => {
                      lastTriggerRef.current = event.currentTarget;
                      setSelectedSpot(spot);
                    }}
                  >
                    <span
                      className={`size-3 rotate-45 border border-black ${isSelected ? "bg-black" : "bg-white"}`}
                    />
                  </button>
                );
              })}
            </>
          )}
        </div>
      </section>

      <ScenePickerDrawer
        destinationId={destination.id}
        finalFocusRef={lastTriggerRef}
        spot={selectedSpot}
        onClose={() => setSelectedSpot(undefined)}
      />
    </main>
  );
}
