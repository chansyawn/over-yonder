import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { AppCapabilities } from "@continue/capabilities";
import { DemoPage } from "./features/demo/demo-page.tsx";

export function createApp(capabilities: AppCapabilities): ReactNode {
  const rootRoute = createRootRoute({
    component: Outlet,
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <DemoPage capabilities={capabilities} />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
  });

  return <RouterProvider router={router} />;
}
