import { Drawer } from "@base-ui/react/drawer";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, ImagesIcon, XIcon } from "lucide-react";
import type { RefObject } from "react";
import type { SpotDetail } from "#app/features/scene-pack/model.ts";
import { useMediaQuery } from "#app/hooks/use-media-query.ts";
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
  const sceneCount = spot?.scenes.length ?? 0;
  const sceneCountLabel =
    sceneCount === 1
      ? m.destination_scene_count_one({ count: sceneCount })
      : m.destination_scene_count_other({ count: sceneCount });

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
          className={`fixed inset-0 z-50 flex ${isDesktop ? "justify-end p-5" : "items-end"}`}
        >
          <Drawer.Popup
            className={`border-border bg-panel text-foreground flex touch-auto flex-col overflow-hidden overscroll-contain border transition-transform duration-300 outline-none data-swiping:duration-0 ${
              isDesktop
                ? "h-[calc(100dvh-2.5rem)] w-[min(30rem,calc(100vw-2.5rem))] [transform:translateX(var(--drawer-swipe-movement-x))] rounded-lg data-ending-style:translate-x-[calc(100%+1.25rem)] data-starting-style:translate-x-[calc(100%+1.25rem)]"
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
                  {spot ? (
                    <p className="text-muted-foreground mt-4 flex items-center gap-2 text-xs tracking-wide uppercase">
                      <ImagesIcon aria-hidden="true" className="size-4" />
                      {sceneCountLabel}
                    </p>
                  ) : null}
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
                {spot?.scenes.map((scene, index) => (
                  <Link
                    key={scene.id}
                    className="border-border bg-background/75 hover:bg-muted/70 focus-visible:ring-foreground/45 group grid min-w-0 grid-cols-[7rem_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-md border p-2 transition-colors outline-none focus-visible:ring-2 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-4"
                    params={{ destinationId, sceneId: scene.id }}
                    to="/destinations/$destinationId/scenes/$sceneId"
                  >
                    <div className="border-border bg-muted aspect-video overflow-hidden rounded-sm border">
                      <img
                        alt={scene.preview.alt}
                        className="h-full w-full object-cover"
                        decoding="async"
                        height={scene.preview.height}
                        src={scene.preview.src}
                        width={scene.preview.width}
                      />
                    </div>
                    <div className="min-w-0 py-1">
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span aria-hidden="true" className="bg-border h-px w-5" />
                        <span className="uppercase">
                          {scene.kind === "image" ? m.scene_kind_image() : m.scene_kind_video()}
                        </span>
                      </div>
                      <h3 className="mt-1 truncate font-serif text-lg font-normal sm:text-xl">
                        {scene.title}
                      </h3>
                      {scene.description ? (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-5">
                          {scene.description}
                        </p>
                      ) : null}
                    </div>
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="text-muted-foreground size-5 transition-transform group-hover:translate-x-0.5"
                    />
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
