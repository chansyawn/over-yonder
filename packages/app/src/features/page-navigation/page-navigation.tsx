import { Link } from "@tanstack/react-router";
import destinationExplorationIllustrationUrl from "#app/assets/illustrations/destination-selection.png";
import homeIllustrationUrl from "#app/assets/illustrations/home.png";
import destinationSelectionIllustrationUrl from "#app/assets/illustrations/destination-exploration.png";
import * as m from "#app/paraglide/messages.js";
import "#app/ui/illustration-control.css";

const navigationLinkClassName = "grid size-12 place-items-center outline-none";

interface PageNavigationProps {
  readonly packId?: string;
  readonly destinationId?: string;
  readonly destinationTitle?: string;
}

export function PageNavigation({ packId, destinationId, destinationTitle }: PageNavigationProps) {
  return (
    <nav
      aria-label={m.page_navigation_label()}
      className="absolute top-5 left-5 z-20 flex gap-2 sm:top-8 sm:left-8"
    >
      <Link
        aria-label={m.back_to_main_menu_action()}
        className={navigationLinkClassName}
        title={m.back_to_main_menu_action()}
        to="/"
      >
        <img
          alt=""
          aria-hidden="true"
          className="illustration-control-image size-11 object-contain"
          src={homeIllustrationUrl}
        />
      </Link>
      <Link
        aria-label={m.all_destinations_action()}
        className={navigationLinkClassName}
        title={m.all_destinations_action()}
        to="/destinations"
      >
        <img
          alt=""
          aria-hidden="true"
          className="illustration-control-image size-11 object-contain"
          src={destinationSelectionIllustrationUrl}
        />
      </Link>
      {packId && destinationId && destinationTitle ? (
        <Link
          aria-label={m.back_to_destination_action({ destinationTitle })}
          className={navigationLinkClassName}
          params={{ packId, destinationId }}
          title={m.back_to_destination_action({ destinationTitle })}
          to="/packs/$packId/destinations/$destinationId"
        >
          <img
            alt=""
            aria-hidden="true"
            className="illustration-control-image size-11 object-contain"
            src={destinationExplorationIllustrationUrl}
          />
        </Link>
      ) : null}
    </nav>
  );
}
