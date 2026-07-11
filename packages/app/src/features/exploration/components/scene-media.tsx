import { useEffect, useState } from "react";
import type { SceneDetail } from "../model.ts";

interface SceneMediaProps {
  readonly scene: SceneDetail;
}

export function SceneMedia({ scene }: SceneMediaProps) {
  const [failed, setFailed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white p-8 text-center text-black">
        <div>
          <h2 className="text-2xl font-semibold">Scene media unavailable</h2>
          <p className="mt-2 text-sm">Return to the map and choose another scene.</p>
        </div>
      </div>
    );
  }

  if (scene.kind === "image") {
    return (
      <img
        alt={scene.media.alt}
        className="absolute inset-0 size-full object-cover"
        height={scene.media.height}
        onError={() => setFailed(true)}
        src={scene.media.src}
        width={scene.media.width}
      />
    );
  }

  if (prefersReducedMotion) {
    return (
      <img
        alt={scene.media.poster.alt}
        className="absolute inset-0 size-full object-cover"
        height={scene.media.poster.height}
        onError={() => setFailed(true)}
        src={scene.media.poster.src}
        width={scene.media.poster.width}
      />
    );
  }

  return (
    <video
      aria-label={scene.media.label}
      autoPlay
      className="absolute inset-0 size-full object-cover"
      loop
      muted
      playsInline
      poster={scene.media.poster.src}
      preload="auto"
      src={scene.media.src}
      onError={() => setFailed(true)}
    />
  );
}

function usePrefersReducedMotion(): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return matches;
}
