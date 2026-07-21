import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  notFound,
  type RouterHistory,
} from "@tanstack/react-router";
import { ErrorBoundaryPage } from "#app/features/error-boundary/error-boundary-page.tsx";
import type { SceneCatalog } from "#app/features/scene-pack/catalog.ts";
import { DestinationSelectionPage } from "#app/features/destination-selection/destination-selection-page.tsx";
import { NotFoundPage } from "#app/features/not-found/not-found-page.tsx";
import { ScenePage } from "#app/features/scene-viewing/scene-page.tsx";
import { SettingsPage } from "#app/features/settings/settings-page.tsx";
import { DestinationPage } from "#app/features/destination-exploration/destination-page.tsx";
import { StartScreenPage } from "#app/features/start-screen/start-screen-page.tsx";

interface AppRouterContext {
  readonly catalog: SceneCatalog;
}

const rootRoute = createRootRouteWithContext<AppRouterContext>()({
  component: Outlet,
  errorComponent: ErrorBoundaryPage,
  notFoundComponent: NotFoundPage,
});

const startScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: StartScreenPage,
});

const destinationSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/destinations",
  loader: ({ context }) => context.catalog.listDestinations(),
  component: DestinationSelectionRoute,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const destinationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/packs/$packId/destinations/$destinationId",
  loader: ({ context, params }) => {
    const destination = context.catalog.getDestination(params.packId, params.destinationId);
    if (!destination) {
      throw notFound();
    }

    return destination;
  },
  component: DestinationRoute,
});

const sceneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/packs/$packId/destinations/$destinationId/scenes/$sceneId",
  loader: ({ context, params }) => {
    const destination = context.catalog.getDestination(params.packId, params.destinationId);
    const scene = context.catalog.getScene(params.packId, params.destinationId, params.sceneId);
    if (!destination || !scene) {
      throw notFound();
    }

    return { destination, scene };
  },
  component: SceneRoute,
});

const routeTree = rootRoute.addChildren([
  startScreenRoute,
  settingsRoute,
  destinationSelectionRoute,
  destinationRoute,
  sceneRoute,
]);

export interface CreateAppRouterOptions {
  readonly catalog: SceneCatalog;
  readonly history?: RouterHistory;
}

export function createAppRouter({ catalog, history }: CreateAppRouterOptions) {
  return createRouter({
    routeTree,
    context: { catalog },
    history,
    defaultPreload: "intent",
    scrollRestoration: true,
  });
}

function DestinationSelectionRoute() {
  const destinations = destinationSelectionRoute.useLoaderData();
  return <DestinationSelectionPage destinations={destinations} />;
}

function DestinationRoute() {
  const destination = destinationRoute.useLoaderData();
  return (
    <DestinationPage key={`${destination.packId}:${destination.id}`} destination={destination} />
  );
}

function SceneRoute() {
  const { destination, scene } = sceneRoute.useLoaderData();
  return (
    <ScenePage
      key={`${destination.packId}:${destination.id}:${scene.id}`}
      destination={destination}
      scene={scene}
    />
  );
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
