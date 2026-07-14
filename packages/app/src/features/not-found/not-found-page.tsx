import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-8 text-center text-black">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase">Beyond reach</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          This destination could not be found
        </h1>
        <p className="mt-4 text-sm leading-6">
          The destination or scene may no longer be available in the current scene pack.
        </p>
        <Link
          className="mt-6 inline-flex border border-black bg-white px-4 py-2 text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          to="/destinations"
        >
          Back to destinations
        </Link>
      </div>
    </main>
  );
}
