import { Link } from "@tanstack/react-router";
import { KeepScale } from "react-zoom-pan-pinch";
import { ZoomableMediaViewport } from "#app/features/media-viewing/zoomable-media-viewport.tsx";
import type { DestinationDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";

interface DestinationMapProps {
  readonly destination: DestinationDetail;
}

function DestinationMapFailure() {
  return (
    <div className="bg-muted absolute inset-0 grid place-items-center p-8 text-center">
      <div className="bg-background/90 border-border max-w-sm rounded-md border p-6 backdrop-blur-sm">
        <h2 className="font-serif text-2xl font-normal">{m.destination_image_unavailable()}</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {m.destination_image_unavailable_hint()}
        </p>
      </div>
    </div>
  );
}

export function DestinationMap({ destination }: DestinationMapProps) {
  return (
    <ZoomableMediaViewport
      ariaLabel={m.destination_map_label()}
      backdropSrc={destination.image.src}
      failure={<DestinationMapFailure />}
      interactionExclusionClassName="scene-marker"
      navigationHint={m.map_navigation_hint()}
      resetActionLabel={m.reset_map_action()}
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
      overlay={destination.scenes.map((scene) => (
        <div
          key={scene.id}
          className="absolute size-12 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${scene.position.x * 100}%`,
            top: `${scene.position.y * 100}%`,
          }}
        >
          <KeepScale className="size-12">
            <Link
              aria-label={m.explore_scene_action({ sceneTitle: scene.title })}
              className="scene-marker group grid size-12 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-600"
              params={{
                packId: destination.packId,
                destinationId: destination.id,
                sceneId: scene.id,
              }}
              title={scene.title}
              to="/packs/$packId/destinations/$destinationId/scenes/$sceneId"
            >
              <span
                aria-hidden="true"
                className="relative grid size-7 place-items-center rounded-full border-2 border-white bg-amber-800 transition-[width,height] group-hover:size-8 motion-reduce:transition-none"
              >
                <span className="size-2.5 rounded-full bg-white" />
              </span>
            </Link>
          </KeepScale>
        </div>
      ))}
    />
  );
}
