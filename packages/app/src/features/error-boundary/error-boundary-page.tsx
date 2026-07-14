import * as m from "#app/paraglide/messages.js";

export function ErrorBoundaryPage() {
  return (
    <main className="grid min-h-screen place-items-center p-8 text-center text-black">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold sm:text-4xl">{m.content_unavailable_title()}</h1>
        <p className="mt-4 text-sm leading-6">{m.content_unavailable_description()}</p>
        <a
          className="mt-6 inline-flex border border-black bg-white px-4 py-2 text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          href="/"
        >
          {m.try_again_action()}
        </a>
      </div>
    </main>
  );
}
