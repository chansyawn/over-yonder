import { useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const mediaQueryList = useMemo(
    () => (typeof window === "undefined" ? undefined : window.matchMedia(query)),
    [query],
  );

  return useSyncExternalStore(
    (onStoreChange) => {
      mediaQueryList?.addEventListener("change", onStoreChange);
      return () => mediaQueryList?.removeEventListener("change", onStoreChange);
    },
    () => mediaQueryList?.matches ?? false,
    () => false,
  );
}
