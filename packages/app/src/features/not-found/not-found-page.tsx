import { Link } from "@tanstack/react-router";
import * as m from "#app/paraglide/messages.js";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-8 text-center text-black">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase">{m.not_found_eyebrow()}</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{m.not_found_title()}</h1>
        <p className="mt-4 text-sm leading-6">{m.not_found_description()}</p>
        <Link
          className="mt-6 inline-flex border border-black bg-white px-4 py-2 text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          to="/destinations"
        >
          {m.back_to_destinations_action()}
        </Link>
      </div>
    </main>
  );
}
