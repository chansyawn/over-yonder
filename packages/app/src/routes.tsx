import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  notFound,
  type RouterHistory,
} from "@tanstack/react-router";
import { ErrorBoundaryPage } from "@/features/error-boundary/error-boundary-page.tsx";
import type { SceneCatalog } from "@/features/scene-pack/catalog.ts";
import { DestinationSelectionPage } from "@/features/destination-selection/destination-selection-page.tsx";
import { NotFoundPage } from "@/features/not-found/not-found-page.tsx";
import { ScenePage } from "@/features/scene-viewing/scene-page.tsx";
import { SpotSelectionPage } from "@/features/spot-selection/spot-selection-page.tsx";

interface AppRouterContext {
  readonly catalog: SceneCatalog;
}

const rootRoute = createRootRouteWithContext<AppRouterContext>()({
  component: Outlet,
  errorComponent: ErrorBoundaryPage,
  notFoundComponent: NotFoundPage,
});

const destinationSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: ({ context }) => context.catalog.listDestinations(),
  component: DestinationSelectionRoute,
});

const spotSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/destinations/$destinationId",
  loader: ({ context, params }) => {
    const destination = context.catalog.getDestination(params.destinationId);
    if (!destination) {
      throw notFound();
    }

    return destination;
  },
  component: SpotSelectionRoute,
});

const sceneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/destinations/$destinationId/scenes/$sceneId",
  loader: ({ context, params }) => {
    const destination = context.catalog.getDestination(params.destinationId);
    const scene = context.catalog.getScene(params.destinationId, params.sceneId);
    if (!destination || !scene) {
      throw notFound();
    }

    return { destination, scene };
  },
  component: SceneRoute,
});

const routeTree = rootRoute.addChildren([
  destinationSelectionRoute,
  spotSelectionRoute,
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

function SpotSelectionRoute() {
  const destination = spotSelectionRoute.useLoaderData();
  return <SpotSelectionPage key={destination.id} destination={destination} />;
}

function SceneRoute() {
  const { destination, scene } = sceneRoute.useLoaderData();
  return <ScenePage destination={destination} scene={scene} />;
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
