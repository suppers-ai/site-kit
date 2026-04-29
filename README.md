# site-kit

Shared design system and component library for Suppers AI sites.

This repo provides one CSS file (`dist/design-system.css`) that any
Suppers AI site can `<link>` to get the same fonts, colors, type
scale, spacing, and base typography. Future PRs will add web
components (`<sa-header>`, `<sa-hero>`, …) and HTML page templates;
nothing in this initial cut requires JavaScript or a build tool on
the consumer side.

Foundation v0.1.0 ships:

- `dist/design-system.css` — design tokens, reset, typography
- `fonts/` — vendored Itim + JetBrains Mono (SIL OFL)
- `showcase/index.html` — live demo of every token

## Use it

> **Note:** the URL below is a placeholder. GitHub Pages hosting lands
> in a follow-up PR. Until then, vendor `dist/` and `fonts/` into your
> own static assets.

```html
<link rel="stylesheet" href="https://…/site-kit/dist/design-system.css">
```

The CSS references font files via `../fonts/`, so consumers must
deploy `dist/design-system.css` alongside a sibling `fonts/` directory
(i.e. both at the same URL prefix).

### Components

Each web component is a single ES module under `dist/components/`. A
page imports only the components it uses:

```html
<script type="module" src="https://…/site-kit/dist/components/sa-header.js"></script>
<script type="module" src="https://…/site-kit/dist/components/sa-hero.js"></script>

<sa-header>
  <a slot="brand" href="/">acme.example</a>
  <nav slot="nav"><a href="/docs">Docs</a></nav>
  <a slot="actions" href="/login">Sign in</a>
</sa-header>

<sa-hero
  title="Compose your site from blocks"
  subtitle="One link, one accent override, every component themed."
  cta-href="/docs"
  cta-label="Read more">
</sa-hero>
```

Components are styled via Shadow DOM and pick up `--sa-accent`
automatically through CSS-custom-property inheritance — no extra
wiring per component.

## Override the accent

The default accent is `#1e3a5f`. Override with one declaration in your
own stylesheet, loaded after `design-system.css`:

```css
:root { --sa-accent: #fe6627; }   /* solobase  */
:root { --sa-accent: #FCC450; }   /* wafer     */
:root { --sa-accent: #f54e00; }   /* gizza-ai  */
```

Hover and focus states derive from `--sa-accent` automatically via
`color-mix()`, so each site only declares the base.

## Layout

- `src/` — editable sources (`tokens.css`, `reset.css`, `typography.css`,
  and `design-system.css` as the dev `@import` entry).
- `dist/design-system.css` — concatenated build output. Do not edit.
- `fonts/` — vendored Itim and JetBrains Mono (SIL OFL, see
  `fonts/LICENSES/`).
- `showcase/index.html` — live demo of every token. Open after running
  `./build.sh` to confirm changes.

## Vendored fonts

Two font families ship with the kit. Both are SIL OFL — the full
license text for each lives under `fonts/LICENSES/`.

- **Itim** (display + body): single-weight script face. Upstream:
  [google/fonts](https://github.com/google/fonts/tree/main/ofl/itim).
- **JetBrains Mono** (code surfaces): weights 400 + 500. Upstream:
  [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono).

The bundled woff2 files are subset (Itim split into `latin` and
`latin-ext`; JetBrains Mono `latin` only). Consumers concerned about
CLS on the Itim `latin-ext` swap can override that one `@font-face`
block in their own CSS using `font-display: optional`.

## Develop

```bash
./build.sh                    # rebuild dist/design-system.css
python3 -m http.server 9100   # then open http://localhost:9100/showcase/
```

`build.sh` is plain `cat` — no minification, no PostCSS. It runs a
build-time assertion that the resulting `dist/design-system.css`
declares `:root` (token variables) before any `var(--sa-*)` reference.
A future reorder of the cat order would fail loudly.

## Browser support

Modern only — Chrome 111+, Firefox 113+, Safari 16.2+. Required by
`color-mix()` and modern CSS features; no polyfills.

## License

- Code: MIT, see [`LICENSE`](LICENSE).
- Bundled fonts: SIL OFL, see [`fonts/LICENSES/`](fonts/LICENSES/).
