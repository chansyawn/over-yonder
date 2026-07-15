import { LocateFixedIcon, MinusIcon, PlusIcon } from "lucide-react";
import {
  KeepScale,
  type ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
  useControls,
  useTransformComponent,
} from "react-zoom-pan-pinch";
import { useLayoutEffect, useRef, useState } from "react";
import type { DestinationDetail, SpotDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";
import "./destination-map.css";

const minMapScale = 0.5;
const maxMapScale = 3;
const fullyVisibleMapScale = 1;

function centerFullyVisibleMap(ref: ReactZoomPanPinchRef): void {
  if (ref.state.scale <= fullyVisibleMapScale) {
    ref.centerView(ref.state.scale);
  }
}

interface DestinationMapProps {
  readonly destination: DestinationDetail;
  readonly selectedSpotId: string | undefined;
  readonly onSelectSpot: (spot: SpotDetail, trigger: HTMLButtonElement) => void;
}

interface MapControlsProps {
  readonly disabled: boolean;
}

function MapControls({ disabled }: MapControlsProps) {
  const { resetTransform, zoomIn, zoomOut } = useControls();
  const scale = useTransformComponent(({ state }) => state.scale);
  const zoomInDisabled = disabled || scale >= maxMapScale;
  const zoomOutDisabled = disabled || scale <= minMapScale;
  const controlClass =
    "text-foreground hover:bg-muted focus-visible:ring-foreground/45 grid size-11 cursor-pointer place-items-center bg-panel outline-none transition-colors focus-visible:z-10 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-45";

  return (
    <div className="border-border bg-panel/92 absolute bottom-6 left-5 z-20 grid overflow-hidden rounded-md border sm:bottom-8 sm:left-8">
      <button
        aria-label={m.zoom_in_action()}
        className={`${controlClass} border-border border-b`}
        disabled={zoomInDisabled}
        title={m.zoom_in_action()}
        type="button"
        onClick={() => zoomIn(0.35)}
      >
        <PlusIcon aria-hidden="true" className="size-5" />
      </button>
      <button
        aria-label={m.zoom_out_action()}
        className={`${controlClass} border-border border-b`}
        disabled={zoomOutDisabled}
        title={m.zoom_out_action()}
        type="button"
        onClick={() => zoomOut(0.35)}
      >
        <MinusIcon aria-hidden="true" className="size-5" />
      </button>
      <button
        aria-label={m.reset_map_action()}
        className={controlClass}
        disabled={disabled}
        title={m.reset_map_action()}
        type="button"
        onClick={() => resetTransform()}
      >
        <LocateFixedIcon aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

interface MapBackdropProps {
  readonly image: DestinationDetail["image"];
}

function MapBackdrop({ image }: MapBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="bg-muted pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <img
        className="absolute inset-[-5%] h-[110%] w-[110%] max-w-none scale-105 object-cover opacity-75 blur-2xl saturate-75"
        draggable={false}
        src={image.src}
      />
      <div className="bg-panel/35 absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,color-mix(in_oklab,var(--panel)_45%,transparent)_100%)]" />
    </div>
  );
}

export function DestinationMap({ destination, selectedSpotId, onSelectSpot }: DestinationMapProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    readonly width: number;
    readonly height: number;
  }>();
  const imageReady = imageDimensions !== undefined;
  const imageRatio = imageReady ? imageDimensions.width / imageDimensions.height : undefined;
  const mapWidth = imageRatio ? `min(100vw, calc(100dvh * ${imageRatio}))` : "100vw";
  const interactionDisabled = imageFailed || !imageReady;

  useLayoutEffect(() => {
    if (imageDimensions) {
      transformRef.current?.centerView(fullyVisibleMapScale, 0);
    }
  }, [imageDimensions]);

  return (
    <TransformWrapper
      ref={transformRef}
      autoAlignment={{
        animationTime: 200,
        animationType: "easeOut",
        disabled: false,
        sizeX: 100,
        sizeY: 100,
      }}
      centerOnInit
      disabled={interactionDisabled}
      limitToBounds
      maxScale={maxMapScale}
      minScale={minMapScale}
      panning={{ excluded: ["spot-marker"] }}
      onPanningStop={centerFullyVisibleMap}
      onPinchStop={centerFullyVisibleMap}
      onWheelStop={centerFullyVisibleMap}
      pinch={{ excluded: ["spot-marker"] }}
      wheel={{ excluded: ["spot-marker"], step: 0.001 }}
      doubleClick={{ excluded: ["spot-marker"], mode: "zoomIn", step: 0.5 }}
    >
      {!imageFailed ? <MapBackdrop image={destination.image} /> : null}
      <MapControls disabled={interactionDisabled} />
      <TransformComponent
        contentClass="relative"
        contentStyle={{ width: mapWidth }}
        wrapperClass="relative z-10 h-full w-full"
        wrapperProps={{
          "aria-describedby": "destination-map-instructions",
          "aria-label": m.destination_map_label(),
          role: "region",
        }}
        wrapperStyle={{ height: "100%", width: "100%" }}
      >
        <div
          className={`relative w-full overflow-hidden select-none ${imageReady ? "" : "h-dvh"}`}
          style={imageDimensions ? { aspectRatio: imageRatio } : undefined}
        >
          {imageFailed ? (
            <div className="bg-muted absolute inset-0 grid place-items-center p-8 text-center">
              <div className="bg-panel/90 border-border max-w-sm rounded-md border p-6 backdrop-blur-sm">
                <h2 className="font-serif text-2xl font-normal">
                  {m.destination_image_unavailable()}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {m.destination_image_unavailable_hint()}
                </p>
              </div>
            </div>
          ) : (
            <img
              className="destination-map-image-feather pointer-events-none absolute inset-0 h-full w-full object-cover"
              draggable={false}
              src={destination.image.src}
              onLoad={(event) =>
                setImageDimensions({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })
              }
              onError={() => setImageFailed(true)}
            />
          )}
          {imageReady && !imageFailed
            ? destination.spots.map((spot) => {
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
              })
            : null}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
