import { useState } from "react";
import type { AppCapabilities } from "@continue/capabilities";

interface DemoPageProps {
  capabilities: AppCapabilities;
}

export function DemoPage({ capabilities }: DemoPageProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  async function saveContent() {
    try {
      await capabilities.demoFile.writeText(content);
      setStatus("Saved");
    } catch (error) {
      setStatus(getErrorMessage(error));
    }
  }

  async function readContent() {
    try {
      const savedContent = await capabilities.demoFile.readText();
      setContent(savedContent);
      setStatus("Read");
    } catch (error) {
      setStatus(getErrorMessage(error));
    }
  }

  return (
    <main>
      <label htmlFor="demo-content">Content</label>
      <input
        id="demo-content"
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />
      <button type="button" onClick={saveContent}>
        Save
      </button>
      <button type="button" onClick={readContent}>
        Read
      </button>
      <p role="status">{status}</p>
    </main>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
