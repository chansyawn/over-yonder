import { Drawer } from "@base-ui/react/drawer";
import { Link } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import type { RefObject } from "react";
import { useMediaQuery } from "#app/features/media-query/use-media-query.ts";
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
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  return (
    <Drawer.Root
      open={spot !== undefined}
      swipeDirection={isDesktop ? "right" : "down"}
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
        <Drawer.Backdrop className="bg-foreground/10 fixed inset-0 z-40 min-h-dvh backdrop-blur-[1px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport
          className={`fixed inset-0 z-50 flex ${isDesktop ? "justify-end" : "items-end"}`}
        >
          <Drawer.Popup
            className={`border-border bg-background text-foreground flex touch-auto flex-col overflow-hidden overscroll-contain border transition-transform duration-300 outline-none data-swiping:duration-0 ${
              isDesktop
                ? "h-dvh w-[min(30rem,100vw)] [transform:translateX(var(--drawer-swipe-movement-x))] rounded-none border-y-0 border-r-0 data-ending-style:translate-x-full data-starting-style:translate-x-full"
                : "max-h-[82dvh] w-full [transform:translateY(var(--drawer-swipe-movement-y))] rounded-t-lg border-x-0 border-b-0 data-ending-style:translate-y-full data-starting-style:translate-y-full"
            }`}
            finalFocus={finalFocusRef}
          >
            {!isDesktop ? (
              <div aria-hidden="true" className="flex h-6 shrink-0 items-center justify-center">
                <span className="bg-border h-1 w-10 rounded-full" />
              </div>
            ) : null}
            <Drawer.Content className="flex min-h-0 flex-1 flex-col">
              <div className="border-border/70 flex shrink-0 items-start justify-between gap-4 border-b px-5 pt-4 pb-5 sm:px-6 sm:pt-6">
                <div className="min-w-0">
                  <Drawer.Title className="font-serif text-3xl leading-tight font-normal sm:text-4xl">
                    {spot?.title ?? m.choose_scene_title()}
                  </Drawer.Title>
                  <Drawer.Description className="mt-2 text-sm leading-6">
                    {spot?.description ?? m.choose_scene_hint()}
                  </Drawer.Description>
                </div>
                <Drawer.Close
                  aria-label={m.close_action()}
                  className="hover:bg-muted focus-visible:ring-foreground/45 grid size-10 shrink-0 cursor-pointer place-items-center rounded-md transition-colors outline-none focus-visible:ring-2"
                  title={m.close_action()}
                >
                  <XIcon aria-hidden="true" className="size-5" />
                </Drawer.Close>
              </div>

              <div
                className={`grid min-h-0 gap-2 overflow-y-auto px-4 pt-4 sm:gap-3 sm:px-5 sm:pt-5 ${
                  isDesktop ? "pb-5" : "pb-[max(1rem,env(safe-area-inset-bottom))]"
                }`}
              >
                {spot?.scenes.map((scene) => (
                  <Link
                    key={scene.id}
                    className="border-border bg-background/75 hover:bg-muted/70 focus-visible:ring-foreground/45 grid min-w-0 grid-cols-[8rem_minmax(0,1fr)] items-stretch gap-2 overflow-hidden rounded-md border p-2 transition-colors outline-none focus-visible:ring-2 sm:grid-cols-[9rem_minmax(0,1fr)]"
                    params={{ destinationId, sceneId: scene.id }}
                    to="/destinations/$destinationId/scenes/$sceneId"
                  >
                    <div className="border-border bg-muted h-full overflow-hidden rounded-sm border">
                      <img
                        className="h-full w-full object-cover"
                        decoding="async"
                        src={scene.preview.src}
                      />
                    </div>
                    <div className="min-w-0 py-1">
                      <h3 className="mt-1 truncate font-serif text-lg font-normal sm:text-xl">
                        {scene.title}
                      </h3>
                      {scene.description ? (
                        <p className="text-muted-foreground mt-1 h-10 overflow-hidden text-xs leading-5">
                          {scene.description}
                        </p>
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
