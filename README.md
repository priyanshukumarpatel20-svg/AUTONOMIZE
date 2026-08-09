# Autonomize — Dashboard

Static site. No build step, no dependencies.

## Folder structure — this matters

```
autonomize-web/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── logo.png       ← you add this
    └── favicon.png    ← you add this
```

All three code files must sit **side by side in the same folder**, with `assets/`
as a subfolder next to them. `index.html` refers to the others by plain relative
name, so any other arrangement breaks the page.

## If the page looks unstyled

Plain blue underlined links, a visible "Skip to content" link at the top, no cards —
that means `style.css` was not found. It is never a CSS bug; the file is missing or
misnamed. Check in this order:

1. **Are all three files in one folder?** Not `index.html` in Downloads and the rest
   elsewhere.
2. **Check the real filename.** Windows hides extensions by default, so `style.css`
   is often saved as `style.css.txt`. In File Explorer turn on
   *View → File name extensions* and confirm the names are exactly `style.css` and
   `script.js`.
3. **Open DevTools → Network, reload.** A red 404 next to `style.css` confirms it.
   Hover the entry to see the exact path the browser tried.
4. **Copy the whole file.** If you pasted the CSS by hand, make sure the last line is
   the closing `}` of the logo-fallback rule.

## Adding your logo and favicon

Save them as:

- `assets/logo.png` — square, 128×128 or larger. Displays at 34×34 with an 11px
  radius, so a square source works best.
- `assets/favicon.png` — square, 180×180 covers browser tabs and iOS home screens.

Until `logo.png` exists the header shows a dark lettermark placeholder rather than a
broken-image icon, so the page never looks broken while you are setting it up.

Any square image format works if you change the extension in both places:
`index.html` line 24 for the logo, lines 9–10 for the favicon.

## Running it

Double-click `index.html`, or serve the folder:

```bash
python3 -m http.server 8000     # http://localhost:8000
```

Webfonts (Bricolage Grotesque, Inter Tight) load from Google Fonts. Offline the page
falls back to system fonts and stays fully usable.

## Responsive behaviour

| Width | Layout |
| --- | --- |
| Above 1180px | 4 cards per row, full navigation |
| 900–1180px | 2 cards per row |
| Below 900px | Hamburger menu, status pill hidden |
| Below 620px | Single column, card tilt disabled |

`overflow-x:hidden` on `body` prevents horizontal scroll at every width.

## Editing

- **Colours** — CSS custom properties in `:root` at the top of `style.css`. A second
  block under `[data-theme="dark"]` defines the dark palette; the moon button in the
  header switches between them.
- **Card hover** — the `.card-tilt:hover` rule combines `translateY`, `scale` and a
  cursor-tracked `rotateX/rotateY`. The tilt angle is capped by `MAX_TILT` in
  `script.js`; raise it above 5 and the effect stops feeling premium.
- **Content** — all figures live in the `DATA` object at the top of `script.js`.
  Charts, rings, the heatmap and both lists render from it, so changing a number
  there updates the page.

## Photo upload

Click, Enter/Space, or drag-and-drop. Validates type and a 2 MB limit, previews with
`FileReader`, and mirrors the image into the header avatar. Nothing is uploaded
anywhere and the image is gone on refresh.
