import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createApp } from "@continue/app";
import { createTauriTextFileStore } from "@continue/capabilities/tauri";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("App root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    {createApp({
      demoFile: createTauriTextFileStore("demo.txt"),
    })}
  </StrictMode>,
);
