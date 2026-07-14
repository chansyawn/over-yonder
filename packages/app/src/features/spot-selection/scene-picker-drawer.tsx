import { Drawer } from "@base-ui/react/drawer";
import { Link } from "@tanstack/react-router";
import type { RefObject } from "react";
import type { SpotDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";

interface ScenePickerDrawerProps {
  readonly spot: SpotDetail | undefined;
  readonly destinationId: string;
  readonly finalFocusRef: RefObject<HTMLButtonElement | null>;
  readonly onClose: () => void;
}

export function ScenePickerDrawer({
  spot,
  destinationId,
  finalFocusRef,
  onClose,
}: ScenePickerDrawerProps) {
  return (
    <Drawer.Root
      open={spot !== undefined}
      swipeDirection="right"
      onOpenChange={(open, eventDetails) => {
        if (!open) {
          onClose();

          if (eventDetails.reason === "outside-press") {
            // The backdrop disappears after an outside press, so return focus after that click completes.
            window.setTimeout(() => finalFocusRef.current?.focus({ preventScroll: true }));
          }
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 min-h-dvh" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex justify-end">
          <Drawer.Popup
            className="h-full w-full [transform:translateX(var(--drawer-swipe-movement-x))] touch-auto overflow-y-auto overscroll-contain border-l border-black bg-white p-5 text-black transition-transform duration-200 outline-none data-ending-style:translate-x-full data-starting-style:translate-x-full data-swiping:duration-0 sm:max-w-sm sm:p-6"
            finalFocus={finalFocusRef}
          >
            <Drawer.Content>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <Drawer.Title className="text-2xl font-semibold">
                    {spot?.title ?? m.choose_scene_title()}
                  </Drawer.Title>
                  <Drawer.Description className="mt-2 text-sm leading-6">
                    {spot?.description ?? m.choose_scene_hint()}
                  </Drawer.Description>
                </div>
                <Drawer.Close className="border border-black bg-white px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                  {m.close_action()}
                </Drawer.Close>
              </div>

              <div className="grid gap-4">
                {spot?.scenes.map((scene) => (
                  <Link
                    key={scene.id}
                    className="border border-black bg-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    params={{ destinationId, sceneId: scene.id }}
                    to="/destinations/$destinationId/scenes/$sceneId"
                  >
                    <div className="aspect-video overflow-hidden border-b border-black bg-white">
                      <img
                        alt={scene.preview.alt}
                        className="h-full w-full object-cover"
                        height={scene.preview.height}
                        src={scene.preview.src}
                        width={scene.preview.width}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold">{scene.title}</h3>
                        <span className="text-xs uppercase">
                          {scene.kind === "image" ? m.scene_kind_image() : m.scene_kind_video()}
                        </span>
                      </div>
                      {scene.description ? (
                        <p className="mt-2 text-sm leading-5">{scene.description}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
