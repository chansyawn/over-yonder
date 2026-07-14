# Icon Guidelines

Icons in `packages/app/src/assets/icons` follow the [Lucide Icon Design Guide](https://lucide.dev/contribute/icon-design-guide).

## Design

- Use a 24 by 24 pixel canvas with at least 1 pixel of padding.
- Use centered, 2-pixel strokes with round caps and joins.
- Align geometry to the pixel grid where possible; keep icons visually centered and comparable in optical weight to a circle or square.
- Leave 2 pixels between distinct elements unless they intentionally connect.
- Use lower-kebab-case English filenames that describe what the icon depicts.

## SVG

Use this root element:

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
```

Only use `path`, `line`, `polygon`, `polyline`, `circle`, `ellipse`, and `rect` shape elements with their geometry attributes. Do not add per-element fills or strokes, transforms, filters, or `<use>` references.

## React Usage

Prefer icons from `lucide-react` when an appropriate icon is available. Import the component export whose name ends in `Icon`; do not use the equivalent name without the suffix.

```tsx
import { CompassIcon } from "lucide-react";

<CompassIcon aria-hidden="true" className="size-5 shrink-0" />;
```

Import custom icons as React components through Vite SVGR's `?react` query. Use PascalCase local names ending in `Icon`.

```tsx
import AuroraTrailIcon from "#app/assets/icons/aurora-trail.svg?react";

<AuroraTrailIcon aria-hidden="true" className="size-5 shrink-0" />;
```
