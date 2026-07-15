import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it, vi } from "vite-plus/test";
import { createSceneCatalog } from "#app/features/scene-pack/catalog.ts";
import type { ScenePackDefinition } from "#app/features/scene-pack/model.ts";
import { overwriteGetLocale, overwriteSetLocale, type Locale } from "#app/paraglide/runtime.js";
import { createAppRouter } from "./routes.tsx";

const text = (en: string, zhCN = `中文：${en}`) => ({ en, "zh-CN": zhCN });

const image = {
  src: "/image.jpg",
  alt: text("A destination overview", "目的地全景"),
  width: 1200,
  height: 800,
} as const;

const pack = {
  id: "test-pack",
  locales: ["en", "zh-CN"],
  title: text("Test Pack"),
  destinations: [
    {
      id: "destination-one",
      title: text("Destination One", "目的地一"),
      description: text("A destination for route testing.", "用于路由测试的目的地。"),
      image,
      spots: [
        {
          id: "spot-one",
          title: text("Spot One", "地点一"),
          description: text("A spot with one scene.", "包含一个场景的地点。"),
          position: { x: 0.5, y: 0.5 },
          scenes: [
            {
              id: "scene-one",
              kind: "image",
              title: text("Scene One", "场景一"),
              media: image,
            },
          ],
        },
      ],
    },
    {
      id: "destination-two",
      title: text("Destination Two", "目的地二"),
      description: text("Another destination for ownership testing.", "用于归属测试的另一目的地。"),
      image,
      spots: [
        {
          id: "spot-two",
          title: text("Spot Two", "地点二"),
          position: { x: 0.25, y: 0.75 },
          scenes: [
            {
              id: "scene-two",
              kind: "image",
              title: text("Scene Two", "场景二"),
              media: image,
            },
          ],
        },
      ],
    },
  ],
} satisfies ScenePackDefinition;

function renderRoute(initialEntry: string, locale: Locale = "en") {
  overwriteGetLocale(() => locale);
  const router = createAppRouter({
    catalog: createSceneCatalog([pack], { locale, baseLocale: "en" }),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  });

  render(<RouterProvider router={router} />);
  return userEvent.setup();
}

describe("application routes", () => {
  it("opens on the start screen and keeps unavailable actions inert", async () => {
    const user = renderRoute("/");

    expect(await screen.findByRole("heading", { name: "Over Yonder" })).toBeVisible();
    expect(screen.queryByRole("link", { name: /Destination One/ })).not.toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /Continue/ });
    const destinationsLink = screen.getByRole("link", { name: "Destinations" });
    const settingsLink = screen.getByRole("link", { name: "Settings" });

    await user.tab();
    expect(continueButton).toHaveFocus();
    await user.tab();
    expect(destinationsLink).toHaveFocus();
    await user.tab();
    expect(settingsLink).toHaveFocus();

    await user.click(continueButton);

    expect(screen.getByRole("heading", { name: "Over Yonder" })).toBeVisible();
    expect(destinationsLink).toHaveAttribute("href", "/destinations");
    expect(settingsLink).toHaveAttribute("href", "/settings");
  });

  it("lets the player choose a destination, spot, and scene", async () => {
    const user = renderRoute("/");

    await user.click(await screen.findByRole("link", { name: "Destinations" }));
    await user.click(await screen.findByRole("link", { name: /Destination One/ }));
    expect(await screen.findByRole("heading", { name: "Destination One" })).toBeVisible();
    expect(screen.getByRole("link", { name: "All destinations" })).toHaveAttribute(
      "href",
      "/destinations",
    );
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Reset map view" })).toBeVisible();

    const spotTrigger = screen.getByRole("button", { name: "Explore Spot One" });
    await user.click(spotTrigger);
    expect(await screen.findByRole("heading", { name: "Spot One" })).toBeVisible();
    expect(screen.getByRole("dialog", { name: "Spot One" })).toHaveAttribute(
      "data-swipe-direction",
      "down",
    );
    expect(screen.getByText("1 scene")).toBeVisible();
    expect(screen.getByRole("link", { name: /Scene One/ })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(spotTrigger).toHaveFocus());

    await user.click(spotTrigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(spotTrigger).toHaveFocus());

    await user.click(spotTrigger);

    await user.click(screen.getByRole("link", { name: /Scene One/ }));
    expect(await screen.findByRole("heading", { name: "Scene One" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Destination One" })).toHaveAttribute(
      "href",
      "/destinations/destination-one",
    );
  });

  it("shows an explicit fallback when the destination image fails", async () => {
    renderRoute("/destinations/destination-one");

    fireEvent.error(await screen.findByRole("img", { name: "A destination overview" }));

    expect(
      await screen.findByRole("heading", { name: "Destination image unavailable" }),
    ).toBeVisible();
    expect(screen.queryByRole("button", { name: "Explore Spot One" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
  });

  it("opens the scene drawer from the right on desktop viewports", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query === "(min-width: 48rem)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const user = renderRoute("/destinations/destination-one");

    await user.click(await screen.findByRole("button", { name: "Explore Spot One" }));

    expect(await screen.findByRole("dialog", { name: "Spot One" })).toHaveAttribute(
      "data-swipe-direction",
      "right",
    );
  });

  it("shows not found for removed legacy routes", async () => {
    renderRoute("/maps/destination-one");

    expect(
      await screen.findByRole("heading", { name: "This destination could not be found" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to destinations" })).toHaveAttribute(
      "href",
      "/destinations",
    );
  });

  it("shows not found for an unknown destination", async () => {
    renderRoute("/destinations/missing-destination");

    expect(
      await screen.findByRole("heading", { name: "This destination could not be found" }),
    ).toBeVisible();
  });

  it("shows not found when a scene does not belong to the destination", async () => {
    renderRoute("/destinations/destination-one/scenes/scene-two");

    expect(
      await screen.findByRole("heading", { name: "This destination could not be found" }),
    ).toBeVisible();
  });

  it("opens settings and submits a language change through the shared runtime", async () => {
    let selectedLocale: Locale | undefined;
    let selectedOptions: { reload?: boolean } | undefined;
    overwriteSetLocale((locale, options) => {
      selectedLocale = locale;
      selectedOptions = options;
    });
    const user = renderRoute("/settings");

    expect(await screen.findByRole("heading", { name: "Settings" })).toBeVisible();
    expect(screen.getByRole("radio", { name: "English" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "简体中文" })).not.toBeChecked();
    expect(screen.getByRole("link", { name: "Back to main menu" })).toHaveAttribute("href", "/");

    await user.click(screen.getByRole("radio", { name: "简体中文" }));
    expect(selectedLocale).toBe("zh-CN");
    expect(selectedOptions).toBeUndefined();
  });

  it("renders application and scene pack messages in Simplified Chinese", async () => {
    renderRoute("/destinations", "zh-CN");

    expect(await screen.findByRole("heading", { name: "目的地" })).toBeVisible();
    expect(screen.getByRole("link", { name: /目的地一/ })).toBeVisible();
    expect(screen.getAllByText("1 个地点 · 1 个场景")).toHaveLength(2);
  });

  it("renders localized destination map controls in Simplified Chinese", async () => {
    renderRoute("/destinations/destination-one", "zh-CN");

    expect(await screen.findByRole("heading", { name: "目的地一" })).toBeVisible();
    expect(screen.getByRole("region", { name: "目的地地图" })).toHaveAccessibleDescription(
      "拖动浏览地图，使用鼠标滚轮或双指手势缩放。",
    );
    expect(screen.getByRole("button", { name: "放大地图" })).toBeVisible();
    expect(screen.getByRole("button", { name: "缩小地图" })).toBeVisible();
    expect(screen.getByRole("button", { name: "重置地图视图" })).toBeVisible();
  });
});
