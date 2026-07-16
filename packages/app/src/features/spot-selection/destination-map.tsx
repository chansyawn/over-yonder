import { KeepScale } from "react-zoom-pan-pinch";
import { ZoomableMediaViewport } from "#app/features/media-viewing/zoomable-media-viewport.tsx";
import type { DestinationDetail, SpotDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";

interface DestinationMapProps {
  readonly destination: DestinationDetail;
  readonly selectedSpotId: string | undefined;
  readonly onSelectSpot: (spot: SpotDetail, trigger: HTMLButtonElement) => void;
}

function DestinationMapFailure() {
  return (
    <div className="bg-muted absolute inset-0 grid place-items-center p-8 text-center">
      <div className="bg-panel/90 border-border max-w-sm rounded-md border p-6 backdrop-blur-sm">
        <h2 className="font-serif text-2xl font-normal">{m.destination_image_unavailable()}</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {m.destination_image_unavailable_hint()}
        </p>
      </div>
    </div>
  );
}

export function DestinationMap({ destination, selectedSpotId, onSelectSpot }: DestinationMapProps) {
  return (
    <ZoomableMediaViewport
      ariaLabel={m.destination_map_label()}
      backdropSrc={destination.image.src}
      failure={<DestinationMapFailure />}
      interactionExclusionClassName="spot-marker"
      navigationHint={m.map_navigation_hint()}
      renderMedia={({ onError, onReady }) => (
        <img
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          draggable={false}
          src={destination.image.src}
          onLoad={(event) =>
            onReady({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })
          }
          onError={onError}
        />
      )}
      overlay={destination.spots.map((spot) => {
        const isSelected = selectedSpotId === spot.id;

        return (
          <div
            key={spot.id}
            className="absolute size-12 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${spot.position.x * 100}%`,
              top: `${spot.position.y * 100}%`,
            }}
          >
            <KeepScale className="size-12">
              <button
                aria-label={m.explore_spot_action({ spotTitle: spot.title })}
                aria-pressed={isSelected}
                className="spot-marker group grid size-12 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-600"
                title={spot.title}
                type="button"
                onClick={(event) => onSelectSpot(spot, event.currentTarget)}
              >
                <span
                  aria-hidden="true"
                  className={`relative grid place-items-center rounded-full border-2 border-white transition-[width,height,background-color] motion-reduce:transition-none ${
                    isSelected
                      ? "size-10 bg-teal-600 ring-2 ring-teal-600/45 ring-offset-2 ring-offset-white/80"
                      : "size-7 bg-amber-800 group-hover:size-8"
                  }`}
                >
                  <span className="size-2.5 rounded-full bg-white" />
                </span>
              </button>
            </KeepScale>
          </div>
        );
      })}
    />
  );
}
