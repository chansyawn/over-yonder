import { RouterProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { createOfficialSceneCatalog } from "./features/exploration/content/official-scene-catalog.ts";
import { ContentErrorPage } from "./features/exploration/pages/content-error-page.tsx";
import { createAppRouter } from "./routes.tsx";

export function createApp(): ReactNode {
  try {
    const router = createAppRouter({ catalog: createOfficialSceneCatalog() });

    return <RouterProvider router={router} />;
  } catch {
    return <ContentErrorPage />;
  }
}
