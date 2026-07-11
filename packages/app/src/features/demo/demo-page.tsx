import { useState } from "react";
import type { AppCapabilities } from "@over-yonder/capabilities";

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
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 py-12 text-slate-900">
      <label className="text-sm font-medium" htmlFor="demo-content">
        Content
      </label>
      <input
        className="rounded-md border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        id="demo-content"
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />
      <div className="flex gap-3">
        <button
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
          type="button"
          onClick={saveContent}
        >
          Save
        </button>
        <button
          className="rounded-md border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100"
          type="button"
          onClick={readContent}
        >
          Read
        </button>
      </div>
      <p className="min-h-6 text-sm text-slate-600" role="status">
        {status}
      </p>
    </main>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
