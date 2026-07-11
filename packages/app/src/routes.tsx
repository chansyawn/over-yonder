import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  notFound,
  type RouterHistory,
} from "@tanstack/react-router";
import type { SceneCatalog } from "./features/exploration/catalog.ts";
import { ContentErrorPage } from "./features/exploration/pages/content-error-page.tsx";
import { MapPage } from "./features/exploration/pages/map-page.tsx";
import { MapSelectionPage } from "./features/exploration/pages/map-selection-page.tsx";
import { NotFoundPage } from "./features/exploration/pages/not-found-page.tsx";
import { ScenePage } from "./features/exploration/pages/scene-page.tsx";

interface AppRouterContext {
  readonly catalog: SceneCatalog;
}

const rootRoute = createRootRouteWithContext<AppRouterContext>()({
  component: Outlet,
  errorComponent: ContentErrorPage,
  notFoundComponent: NotFoundPage,
});

const mapSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: ({ context }) => context.catalog.listMaps(),
  component: MapSelectionRoute,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/maps/$mapId",
  loader: ({ context, params }) => {
    const map = context.catalog.getMap(params.mapId);
    if (!map) {
      throw notFound();
    }

    return map;
  },
  component: MapRoute,
});

const sceneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/maps/$mapId/scenes/$sceneId",
  loader: ({ context, params }) => {
    const map = context.catalog.getMap(params.mapId);
    const scene = context.catalog.getScene(params.mapId, params.sceneId);
    if (!map || !scene) {
      throw notFound();
    }

    return { map, scene };
  },
  component: SceneRoute,
});

const routeTree = rootRoute.addChildren([mapSelectionRoute, mapRoute, sceneRoute]);

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

function MapSelectionRoute() {
  const maps = mapSelectionRoute.useLoaderData();
  return <MapSelectionPage maps={maps} />;
}

function MapRoute() {
  const map = mapRoute.useLoaderData();
  return <MapPage key={map.id} map={map} />;
}

function SceneRoute() {
  const { map, scene } = sceneRoute.useLoaderData();
  return <ScenePage map={map} scene={scene} />;
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
