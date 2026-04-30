// site-kit/tailwind-preset.js
//
// A Tailwind v3 preset that maps the kit's `--sa-*` design tokens onto
// the equivalent `theme` keys, so a Tailwind-using consumer can write
// `bg-sa-accent text-sa-muted px-sa-4 text-sa-lg` and reach the same
// values as a plain-CSS consumer writing `var(--sa-accent)`.
//
// Token values reference the CSS variables (e.g. `var(--sa-accent)`)
// rather than baking concrete hex/px in. That way:
//   - the kit's `dist/design-system.css` remains the single source of
//     truth for token values (override `--sa-accent` once, both
//     plain-CSS and Tailwind utilities update);
//   - per-site theming via `:root { --sa-accent: ... }` continues to
//     work with no Tailwind-config rebuild.
//
// Usage in a consumer's `tailwind.config.js`:
//
//   /** @type {import('tailwindcss').Config} */
//   module.exports = {
//     presets: [require('@suppers-ai/site-kit/tailwind-preset')],
//     content: ['./src/**/*.{html,ts,tsx,vue,svelte}'],
//   };
//
// The kit's `dist/design-system.css` must still be loaded in the
// consumer's HTML — the preset only declares the utility-class API,
// not the variable values.

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'sa-gray': {
          50:  'var(--sa-gray-50)',
          100: 'var(--sa-gray-100)',
          200: 'var(--sa-gray-200)',
          300: 'var(--sa-gray-300)',
          400: 'var(--sa-gray-400)',
          500: 'var(--sa-gray-500)',
          600: 'var(--sa-gray-600)',
          700: 'var(--sa-gray-700)',
          800: 'var(--sa-gray-800)',
          900: 'var(--sa-gray-900)',
          950: 'var(--sa-gray-950)',
        },
        'sa-accent':        'var(--sa-accent)',
        'sa-accent-hover':  'var(--sa-accent-hover)',
        'sa-text':          'var(--sa-text)',
        'sa-muted':         'var(--sa-text-muted)',
        'sa-bg':            'var(--sa-bg)',
        'sa-bg-card':       'var(--sa-bg-card)',
        'sa-border':        'var(--sa-border)',
        'sa-code-bg':       'var(--sa-code-bg)',
        'sa-code-block-bg': 'var(--sa-code-block-bg)',
        'sa-code-block-fg': 'var(--sa-code-block-fg)',
      },
      fontFamily: {
        'sa-sans': 'var(--sa-font-sans)',
        'sa-mono': 'var(--sa-font-mono)',
      },
      fontSize: {
        'sa-xs':   'var(--sa-text-xs)',
        'sa-sm':   'var(--sa-text-sm)',
        'sa-base': 'var(--sa-text-base)',
        'sa-lg':   'var(--sa-text-lg)',
        'sa-xl':   'var(--sa-text-xl)',
        'sa-2xl':  'var(--sa-text-2xl)',
        'sa-3xl':  'var(--sa-text-3xl)',
        'sa-4xl':  'var(--sa-text-4xl)',
        'sa-5xl':  'var(--sa-text-5xl)',
      },
      lineHeight: {
        'sa-tight':   'var(--sa-leading-tight)',
        'sa-normal':  'var(--sa-leading-normal)',
        'sa-relaxed': 'var(--sa-leading-relaxed)',
      },
      spacing: {
        'sa-1':  'var(--sa-space-1)',
        'sa-2':  'var(--sa-space-2)',
        'sa-3':  'var(--sa-space-3)',
        'sa-4':  'var(--sa-space-4)',
        'sa-6':  'var(--sa-space-6)',
        'sa-8':  'var(--sa-space-8)',
        'sa-12': 'var(--sa-space-12)',
        'sa-16': 'var(--sa-space-16)',
        'sa-24': 'var(--sa-space-24)',
      },
      borderRadius: {
        'sa-sm': 'var(--sa-radius-sm)',
        'sa-md': 'var(--sa-radius-md)',
        'sa-lg': 'var(--sa-radius-lg)',
      },
      boxShadow: {
        'sa-sm': 'var(--sa-shadow-sm)',
        'sa-md': 'var(--sa-shadow-md)',
      },
      maxWidth: {
        'sa': 'var(--sa-max-width)',
      },
    },
  },
};
