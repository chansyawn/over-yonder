import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import type { SceneDetail } from "#app/features/scene-pack/model.ts";
import { SceneMedia } from "./scene-media.tsx";

const videoScene = {
  id: "video-scene",
  title: "Video scene",
  kind: "video",
  media: {
    src: "/scene.mp4",
    label: "A moving scene",
    poster: { src: "/scene-poster.jpg" },
  },
} satisfies SceneDetail;

const imageScene = {
  id: "image-scene",
  title: "Image scene",
  kind: "image",
  media: { src: "/scene.jpg" },
} satisfies SceneDetail;

function setImageDimensions(image: HTMLImageElement, width: number, height: number): void {
  Object.defineProperties(image, {
    naturalWidth: { configurable: true, value: width },
    naturalHeight: { configurable: true, value: height },
  });
}

describe("SceneMedia", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("reports video dimensions when metadata loads", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const onReady = vi.fn();
    render(<SceneMedia scene={videoScene} onReady={onReady} />);

    const video = screen.getByLabelText("A moving scene");
    expect(document.querySelector("img")).not.toBeInTheDocument();
    Object.defineProperties(video, {
      videoWidth: { configurable: true, value: 1920 },
      videoHeight: { configurable: true, value: 1080 },
    });
    fireEvent.loadedMetadata(video);

    expect(onReady).toHaveBeenCalledWith({ width: 1920, height: 1080 });
  });

  it("uses and reports poster dimensions when reduced motion is requested", () => {
    const onReady = vi.fn();
    const { container } = render(<SceneMedia scene={videoScene} onReady={onReady} />);

    const poster = container.querySelector("img");
    expect(poster).not.toBeNull();
    setImageDimensions(poster!, 1200, 800);
    fireEvent.load(poster!);

    expect(screen.queryByLabelText("A moving scene")).not.toBeInTheDocument();
    expect(onReady).toHaveBeenCalledWith({ width: 1200, height: 800 });
  });

  it("reports the natural dimensions of an image scene", () => {
    const onReady = vi.fn();
    const { container } = render(<SceneMedia scene={imageScene} onReady={onReady} />);

    const image = container.querySelector("img");
    expect(image).not.toBeNull();
    setImageDimensions(image!, 1600, 900);
    fireEvent.load(image!);

    expect(onReady).toHaveBeenCalledWith({ width: 1600, height: 900 });
  });
});
