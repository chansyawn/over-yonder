import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ScenePickerDrawer } from "../components/scene-picker-drawer.tsx";
import type { CoordinateDetail, MapDetail } from "../model.ts";

interface MapPageProps {
  readonly map: MapDetail;
}

export function MapPage({ map }: MapPageProps) {
  const [selectedCoordinate, setSelectedCoordinate] = useState<CoordinateDetail>();
  const [imageFailed, setImageFailed] = useState(false);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      <header className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
        <Link
          className="inline-flex border border-black bg-white px-3 py-2 text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          to="/"
        >
          All maps
        </Link>
        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">{map.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6">{map.description}</p>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 pb-6 sm:px-8">
        <div
          className="relative w-full max-w-6xl overflow-hidden border border-black bg-white"
          style={{ aspectRatio: `${map.image.width} / ${map.image.height}` }}
        >
          {imageFailed ? (
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div>
                <h2 className="text-2xl font-semibold">Map image unavailable</h2>
                <p className="mt-2 text-sm">Return to the map list and try another place.</p>
              </div>
            </div>
          ) : (
            <>
              <img
                alt={map.image.alt}
                className="absolute inset-0 h-full w-full object-cover"
                height={map.image.height}
                onError={() => setImageFailed(true)}
                src={map.image.src}
                width={map.image.width}
              />
              {map.coordinates.map((coordinate) => {
                const isSelected = selectedCoordinate?.id === coordinate.id;

                return (
                  <button
                    key={coordinate.id}
                    aria-label={`Explore ${coordinate.title}`}
                    aria-pressed={isSelected}
                    className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    style={{
                      left: `${coordinate.position.x * 100}%`,
                      top: `${coordinate.position.y * 100}%`,
                    }}
                    type="button"
                    onClick={(event) => {
                      lastTriggerRef.current = event.currentTarget;
                      setSelectedCoordinate(coordinate);
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
        coordinate={selectedCoordinate}
        finalFocusRef={lastTriggerRef}
        mapId={map.id}
        onClose={() => setSelectedCoordinate(undefined)}
      />
    </main>
  );
}
