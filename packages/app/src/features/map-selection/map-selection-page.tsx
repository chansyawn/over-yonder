import { Link } from "@tanstack/react-router";
import type { MapSummary } from "@/features/scene-pack/model.ts";

interface MapSelectionPageProps {
  readonly maps: readonly MapSummary[];
}

export function MapSelectionPage({ maps }: MapSelectionPageProps) {
  return (
    <main className="min-h-screen bg-white px-5 py-8 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase">Over Yonder</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Choose a map</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 sm:text-base">
            Pick a place to explore, then choose a coordinate and settle into a scene.
          </p>
        </header>

        <section aria-label="Available maps" className="grid gap-6 md:grid-cols-2">
          {maps.map((map) => (
            <Link
              key={map.id}
              className="block border border-black bg-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              params={{ mapId: map.id }}
              to="/maps/$mapId"
            >
              <div className="aspect-[3/2] overflow-hidden border-b border-black bg-white">
                <img
                  alt={map.image.alt}
                  className="h-full w-full object-cover"
                  height={map.image.height}
                  loading="eager"
                  src={map.image.src}
                  width={map.image.width}
                />
              </div>
              <div className="flex items-end justify-between gap-6 p-5">
                <div>
                  <h2 className="text-2xl font-semibold">{map.title}</h2>
                  <p className="mt-2 max-w-md text-sm leading-6">{map.description}</p>
                </div>
                <p className="shrink-0 text-right text-xs leading-5 font-semibold uppercase">
                  {map.coordinateCount} locations
                  <br />
                  {map.sceneCount} scenes
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
