import type { ComponentPropsWithoutRef } from "react";
import "./illustration-control.css";

interface IllustrationButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "aria-label" | "children"
> {
  readonly illustrationSrc: string;
  readonly label: string;
}

export function IllustrationButton({
  className,
  illustrationSrc,
  label,
  title,
  type = "button",
  ...buttonProps
}: IllustrationButtonProps) {
  return (
    <button
      {...buttonProps}
      aria-label={label}
      className={`focus-visible:ring-foreground/60 focus-visible:ring-offset-panel grid size-12 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-50 ${className ?? ""}`}
      title={title ?? label}
      type={type}
    >
      <img
        alt=""
        aria-hidden="true"
        className="illustration-control-image size-11 object-contain"
        draggable={false}
        src={illustrationSrc}
      />
    </button>
  );
}
