import { RouterProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ErrorBoundaryPage } from "@/features/error-boundary/error-boundary-page.tsx";
import { createOfficialSceneCatalog } from "@/features/scene-pack/content/index.ts";
import { createAppRouter } from "./routes.tsx";

export function createApp(): ReactNode {
  try {
    const router = createAppRouter({ catalog: createOfficialSceneCatalog() });

    return <RouterProvider router={router} />;
  } catch {
    return <ErrorBoundaryPage />;
  }
}
