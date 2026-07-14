import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vite-plus/test";
import { createSceneCatalog } from "#app/features/scene-pack/catalog.ts";
import type { ScenePackDefinition } from "#app/features/scene-pack/model.ts";
import { createAppRouter } from "./routes.tsx";

const image = {
  src: "/image.jpg",
  alt: "A destination overview",
  width: 1200,
  height: 800,
} as const;

const pack = {
  id: "test-pack",
  title: "Test Pack",
  destinations: [
    {
      id: "destination-one",
      title: "Destination One",
      description: "A destination for route testing.",
      image,
      spots: [
        {
          id: "spot-one",
          title: "Spot One",
          description: "A spot with one scene.",
          position: { x: 0.5, y: 0.5 },
          scenes: [
            {
              id: "scene-one",
              kind: "image",
              title: "Scene One",
              media: image,
            },
          ],
        },
      ],
    },
    {
      id: "destination-two",
      title: "Destination Two",
      description: "Another destination for ownership testing.",
      image,
      spots: [
        {
          id: "spot-two",
          title: "Spot Two",
          position: { x: 0.25, y: 0.75 },
          scenes: [
            {
              id: "scene-two",
              kind: "image",
              title: "Scene Two",
              media: image,
            },
          ],
        },
      ],
    },
  ],
} satisfies ScenePackDefinition;

function renderRoute(initialEntry: string) {
  const router = createAppRouter({
    catalog: createSceneCatalog([pack]),
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
    const settingsButton = screen.getByRole("button", { name: "Settings" });

    await user.tab();
    expect(continueButton).toHaveFocus();
    await user.tab();
    expect(destinationsLink).toHaveFocus();
    await user.tab();
    expect(settingsButton).toHaveFocus();

    await user.click(continueButton);
    await user.click(settingsButton);

    expect(screen.getByRole("heading", { name: "Over Yonder" })).toBeVisible();
    expect(destinationsLink).toHaveAttribute("href", "/destinations");
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

    await user.click(screen.getByRole("button", { name: "Explore Spot One" }));
    expect(await screen.findByRole("heading", { name: "Spot One" })).toBeVisible();

    await user.click(screen.getByRole("link", { name: /Scene One/ }));
    expect(await screen.findByRole("heading", { name: "Scene One" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Destination One" })).toHaveAttribute(
      "href",
      "/destinations/destination-one",
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
});
