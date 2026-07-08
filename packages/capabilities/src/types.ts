export interface TextFileStore {
  readText(): Promise<string>;
  writeText(content: string): Promise<void>;
}

export interface AppCapabilities {
  demoFile: TextFileStore;
}
