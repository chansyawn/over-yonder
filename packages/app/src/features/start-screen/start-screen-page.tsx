import { Link } from "@tanstack/react-router";
import { Compass, MapPin, Orbit, Settings } from "lucide-react";

const menuItemClassName =
  "border-border bg-background/75 hover:bg-muted/80 focus-visible:ring-foreground/45 relative block w-full cursor-pointer rounded-lg border p-1 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

interface MenuItemContentProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly description?: string;
}

function MenuItemContent({ icon, label, description }: MenuItemContentProps) {
  return (
    <span className="border-border/75 flex min-h-15 items-center rounded-md border px-4 py-2 sm:min-h-16 sm:px-5">
      <span
        aria-hidden="true"
        className="border-border/65 flex w-13 shrink-0 items-center border-r pr-4 sm:w-15 sm:pr-5"
      >
        {icon}
      </span>
      <span className="min-w-0 pl-4 sm:pl-5">
        <span className="block text-sm tracking-widest uppercase sm:text-base">{label}</span>
        {description ? (
          <span className="text-muted-foreground mt-0.5 block truncate text-xs tracking-widest sm:text-xs">
            {description}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function StartScreenPage() {
  return (
    <main className="text-foreground flex min-h-screen items-center justify-center px-5 py-8 font-sans sm:px-8 sm:py-10">
      <div className="flex w-full max-w-md flex-col items-center sm:max-w-lg">
        <header className="flex flex-col items-center text-center">
          <Orbit aria-hidden="true" className="text-muted-foreground size-14 stroke-1 sm:size-16" />
          <h1
            aria-label="Over Yonder"
            className="mt-2 flex flex-col font-serif text-6xl leading-none font-normal tracking-widest sm:text-7xl"
          >
            <span>OVER</span>
            <span className="mt-2">YONDER</span>
          </h1>
          <div aria-hidden="true" className="mt-7 flex w-full items-center gap-4 sm:gap-5">
            <span className="bg-border h-px flex-1" />
            <span className="border-border size-2.5 rotate-45 border">
              <span className="bg-border block size-1 translate-x-0.5 translate-y-0.5" />
            </span>
            <span className="bg-border h-px flex-1" />
          </div>
          <p className="text-muted-foreground mt-3 text-xs tracking-widest lowercase sm:text-sm">
            quiet journeys
          </p>
        </header>

        <nav
          aria-label="Main menu"
          className="mt-10 grid w-full max-w-sm gap-2.5 sm:mt-12 sm:gap-3"
        >
          <button className={menuItemClassName} type="button">
            <MenuItemContent
              description="Resume: Glass Coast"
              icon={<Compass className="size-6 stroke-1 sm:size-7" />}
              label="Continue"
            />
          </button>
          <Link className={menuItemClassName} to="/destinations">
            <MenuItemContent
              icon={<MapPin className="size-6 stroke-1 sm:size-7" />}
              label="Destinations"
            />
          </Link>
          <button className={menuItemClassName} type="button">
            <MenuItemContent
              icon={<Settings className="size-6 stroke-1 sm:size-7" />}
              label="Settings"
            />
          </button>
        </nav>
      </div>
    </main>
  );
}
