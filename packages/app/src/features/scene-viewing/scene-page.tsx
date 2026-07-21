import { ZoomableMediaViewport } from "#app/features/media-viewing/zoomable-media-viewport.tsx";
import { PageNavigation } from "#app/features/page-navigation/page-navigation.tsx";
import type { DestinationDetail, SceneDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";
import { SceneMedia } from "./scene-media.tsx";

interface ScenePageProps {
  readonly destination: DestinationDetail;
  readonly scene: SceneDetail;
}

function SceneMediaFailure() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white p-8 text-center text-black">
      <div>
        <h2 className="text-2xl font-semibold">{m.scene_media_unavailable()}</h2>
        <p className="mt-2 text-sm">{m.scene_media_unavailable_hint()}</p>
      </div>
    </div>
  );
}

export function ScenePage({ destination, scene }: ScenePageProps) {
  const backdrop = scene.kind === "image" ? scene.media : scene.media.poster;

  return (
    <main className="bg-muted relative h-dvh min-h-0 overflow-hidden text-black">
      <ZoomableMediaViewport
        ariaLabel={m.scene_view_label()}
        backdropSrc={backdrop.src}
        failure={<SceneMediaFailure />}
        navigationHint={m.scene_navigation_hint()}
        resetActionLabel={m.reset_scene_action()}
        renderMedia={({ onError, onReady }) => (
          <SceneMedia
            className="absolute inset-0 size-full object-contain"
            scene={scene}
            onError={onError}
            onReady={onReady}
          />
        )}
      />
      <h1 className="sr-only">{scene.title}</h1>
      <PageNavigation
        packId={destination.packId}
        destinationId={destination.id}
        destinationTitle={destination.title}
      />
    </main>
  );
}
