import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createApp } from "@over-yonder/app";
import "@over-yonder/app/styles/index.css";
import { getLocale, setLocale } from "./paraglide/runtime.js";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("App root element was not found.");
}

createRoot(root).render(<StrictMode>{createApp({ i18n: { getLocale, setLocale } })}</StrictMode>);
