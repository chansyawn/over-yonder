import { Link } from "@tanstack/react-router";
import type { DestinationDetail, SceneDetail } from "#app/features/scene-pack/model.ts";
import { SceneMedia } from "./scene-media.tsx";

interface ScenePageProps {
  readonly destination: DestinationDetail;
  readonly scene: SceneDetail;
}

export function ScenePage({ destination, scene }: ScenePageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      <SceneMedia scene={scene} />
      <h1 className="sr-only">{scene.title}</h1>
      <Link
        className="absolute top-4 left-4 z-10 border border-black bg-white px-3 py-2 text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:top-6 sm:left-6"
        params={{ destinationId: destination.id }}
        to="/destinations/$destinationId"
      >
        Back to {destination.title}
      </Link>
    </main>
  );
}
