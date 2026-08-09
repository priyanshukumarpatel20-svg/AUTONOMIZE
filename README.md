
# Autonomize — Dashboard Demo

A self-contained, static demo of the Autonomize student dashboard. No build step, no
server, no dependencies. Open `index.html` in a browser and it runs.

This is the **demo** build, intended for screenshots, presentations and the project
viva. It uses illustrative figures, not live data — the footer states this on screen.
The production dashboard is a React + TypeScript module that reads from the FastAPI
backend; this file is not that.

## Files

```
autonomize-site/
├── index.html    markup only
├── style.css     all styling
├── script.js     all behaviour
└── README.md
```

`index.html` links the other two:

```html
<link rel="stylesheet" href="style.css">   <!-- in <head> -->
<script src="script.js"></script>          <!-- last element in <body> -->
```

The script tag must stay at the end of `<body>`. The code runs as an IIFE and calls
`getElementById` immediately, so moving it into `<head>` without `defer` would break
every interaction on the page.

## Running it

Double-click `index.html`, or serve the folder:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

A local server is not required, but is closer to how the page will be deployed.

An internet connection is needed for the webfonts (Bricolage Grotesque and Inter
Tight, imported at the top of `style.css`). Offline, the page falls back to the system
sans-serif and remains fully usable.

## What's on the page

| Section | Behaviour |
| --- | --- |
| Critical thinking gauge | SVG arc with tick marks generated in JS; the demo slider drives it live |
| Eight-week trend | Bar chart, each bar coloured by its own band |
| Recent sessions | List of sessions with banded score chips |
| Effort signature | Static composition bars |
| Practice prompt | Suggested unassisted task |
| Profile photo | Click, keyboard, or drag-and-drop upload with a local preview |

### Score bands

One rule governs every colour on the page. It lives in `tone()` and `hex()` at the top
of `script.js`:

| Range | Label | Colour |
| --- | --- | --- |
| 0–49 | Needs attention | `--red` `#E5484D` |
| 50–79 | Developing | `--amber` `#F5A623` |
| 80–100 | Strong | `--green` `#34C77B` |

Change a threshold in those two functions and the gauge, its band label, the tick
emphasis at 50 and 80, and the bar colours all follow. Nothing else needs editing.

### The demo slider

Drag it to move the score across all three bands — the arc sweeps, the number counts,
the band label changes, and `--band` updates on `:root` so dependent elements recolour.
This exists purely so all three states can be shown without seeding three accounts.
**Remove the slider before any demo where the page is presented as live.**

### Photo upload

`FileReader` renders a local preview only. Nothing is uploaded, stored, or transmitted,
and the image is gone on refresh. The production module writes to Supabase Storage
under a per-user path guarded by row-level security; this demo does not.

## Editing

- **Colours** — the palette is CSS custom properties in `:root` at the top of
  `style.css`. `--band` is set at runtime by `script.js`; do not hard-code it.
- **Layout** — CSS Grid. Three media queries at the end of `style.css`: 1080px, 560px,
  and a `prefers-reduced-motion` block that disables all transitions.
- **Content** — figures are hard-coded in `index.html`. Some elements carry inline
  `style` attributes for per-element data values (`width:71%`, `height:62%`). These are
  data, not styling, and are intentionally not in `style.css`.
- **Logo** — embedded in `index.html` as a base64 data URI, so the folder has no image
  dependencies and can be moved or emailed as-is.

## Accessibility

The gauge carries an `aria-label` that is rewritten on every render with the score and
its band, so the value is announced rather than conveyed by colour alone. The upload
target is keyboard-reachable and responds to Enter and Space. The reduced-motion query
disables transitions for users who ask for that.

## Provenance

Split from a single 467-line `autonomize-dashboard.html`. The separation was verified
lossless: reassembling the three files reproduces the original byte for byte. No CSS,
JavaScript or markup was altered, reordered or reformatted.
