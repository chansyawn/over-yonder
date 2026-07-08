import type { TextFileStore } from "./types.ts";

interface OpfsWritableFileStream {
  write(data: string): Promise<void>;
  close(): Promise<void>;
}

interface OpfsFileHandle {
  createWritable(): Promise<OpfsWritableFileStream>;
  getFile(): Promise<Blob>;
}

interface OpfsDirectoryHandle {
  getFileHandle(name: string, options?: { create?: boolean }): Promise<OpfsFileHandle>;
}

interface OpfsStorageManager {
  getDirectory?: () => Promise<OpfsDirectoryHandle>;
}

export function createOpfsTextFileStore(fileName: string): TextFileStore {
  return {
    async readText() {
      const file = await getFile(fileName);
      return (await file.getFile()).text();
    },
    async writeText(content) {
      const file = await getFile(fileName);
      const writable = await file.createWritable();
      await writable.write(content);
      await writable.close();
    },
  };
}

async function getFile(fileName: string): Promise<OpfsFileHandle> {
  const storage = getOpfsStorage();
  const root = await storage.getDirectory();
  return root.getFileHandle(fileName, { create: true });
}

function getOpfsStorage(): Required<Pick<OpfsStorageManager, "getDirectory">> {
  if (!("storage" in navigator)) {
    throw new Error("OPFS is not available because navigator.storage is missing.");
  }

  const storage = navigator.storage as unknown as OpfsStorageManager;
  if (!storage.getDirectory) {
    throw new Error("OPFS is not available in this browser.");
  }

  return { getDirectory: storage.getDirectory.bind(storage) };
}
