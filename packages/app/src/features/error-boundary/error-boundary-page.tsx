export function ErrorBoundaryPage() {
  return (
    <main className="grid min-h-screen place-items-center p-8 text-center text-black">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold sm:text-4xl">Official content is unavailable</h1>
        <p className="mt-4 text-sm leading-6">
          Over Yonder could not load the built-in scene pack.
        </p>
        <a
          className="mt-6 inline-flex border border-black bg-white px-4 py-2 text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          href="/"
        >
          Try again
        </a>
      </div>
    </main>
  );
}
