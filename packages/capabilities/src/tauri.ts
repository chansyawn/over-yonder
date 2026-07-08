import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { TextFileStore } from "./types.ts";

export function createTauriTextFileStore(fileName: string): TextFileStore {
  return {
    async readText() {
      const hasFile = await exists(fileName, { baseDir: BaseDirectory.AppData });
      if (!hasFile) {
        return "";
      }

      return readTextFile(fileName, { baseDir: BaseDirectory.AppData });
    },
    async writeText(content) {
      await writeTextFile(fileName, content, { baseDir: BaseDirectory.AppData });
    },
  };
}
