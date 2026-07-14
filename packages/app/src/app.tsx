import { RouterProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ErrorBoundaryPage } from "#app/features/error-boundary/error-boundary-page.tsx";
import { createOfficialSceneCatalog } from "#app/features/scene-pack/content/index.ts";
import { baseLocale } from "#app/paraglide/runtime.js";
import { initializeAppI18n, type AppI18n } from "./i18n.ts";
import { createAppRouter } from "./routes.tsx";

export interface CreateAppOptions {
  readonly i18n: AppI18n;
}

export function createApp({ i18n }: CreateAppOptions): ReactNode {
  try {
    const locale = initializeAppI18n(i18n);
    const router = createAppRouter({
      catalog: createOfficialSceneCatalog(locale, baseLocale),
    });

    return <RouterProvider router={router} />;
  } catch {
    return <ErrorBoundaryPage />;
  }
}
