import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vite-plus/test";
import { createApp } from "../../index.ts";
import type { AppCapabilities, TextFileStore } from "@continue/capabilities";

describe("DemoPage", () => {
  test("saves the current input value", async () => {
    const user = userEvent.setup();
    const store = createFakeTextFileStore();

    render(createApp({ demoFile: store }));

    await user.type(await screen.findByLabelText("Content"), "hello");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await store.readText()).toBe("hello");
    expect(await screen.findByRole("status")).toHaveTextContent("Saved");
  });

  test("loads saved content into the input", async () => {
    const user = userEvent.setup();
    const store = createFakeTextFileStore("hello");

    render(createApp({ demoFile: store }));

    await user.click(await screen.findByRole("button", { name: "Read" }));

    expect(await screen.findByDisplayValue("hello")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Read");
  });

  test("shows storage errors", async () => {
    const user = userEvent.setup();
    const capabilities: AppCapabilities = {
      demoFile: {
        async readText() {
          throw new Error("Storage unavailable");
        },
        async writeText() {
          throw new Error("Storage unavailable");
        },
      },
    };

    render(createApp(capabilities));

    await user.click(await screen.findByRole("button", { name: "Read" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Storage unavailable");
  });
});

function createFakeTextFileStore(initialContent = ""): TextFileStore {
  let content = initialContent;

  return {
    async readText() {
      return content;
    },
    async writeText(nextContent) {
      content = nextContent;
    },
  };
}
