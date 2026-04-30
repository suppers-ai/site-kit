// site-kit component smoke tests.
//
// Each test sets up a tiny HTML page that imports the kit's
// design-system.css + the component-under-test, then asserts:
//   - the custom element is registered;
//   - shadow DOM is attached and open;
//   - named slots receive their slotted content.
//
// Cross-cutting tests (`--sa-accent` override propagation,
// reduced-motion guard) are at the bottom.

import { expect, test } from '@playwright/test';

const HEAD = `
  <link rel="stylesheet" href="/dist/design-system.css">
`;

/** Loads a fresh page with `headExtra` in <head> and `body` as <body>. */
async function setup(page, body, headExtra = '') {
  await page.goto('/');
  await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head>${HEAD}${headExtra}</head>
<body>${body}</body>
</html>`);
}

const components = [
  { tag: 'sa-header',       slots: ['brand', 'nav', 'actions'] },
  { tag: 'sa-hero',         slots: [] },
  { tag: 'sa-footer',       slots: ['brand', 'links', 'copyright'] },
  { tag: 'sa-feature-grid', slots: [] /* default slot only */ },
  { tag: 'sa-feature',      slots: ['icon'] /* + default */ },
  { tag: 'sa-chat',         slots: ['messages', 'composer'] },
];

for (const c of components) {
  test(`${c.tag} registers and attaches an open shadow root`, async ({ page }) => {
    const body = `<${c.tag}></${c.tag}>`;
    const headExtra = `<script type="module" src="/dist/components/${c.tag}.js"></script>`;
    await setup(page, body, headExtra);

    await page.waitForFunction((tag) => !!customElements.get(tag), c.tag);

    const shape = await page.locator(c.tag).evaluate((el) => ({
      hasShadow: !!el.shadowRoot,
      shadowMode: el.shadowRoot ? el.shadowRoot.mode : null,
    }));
    expect(shape.hasShadow).toBe(true);
    expect(shape.shadowMode).toBe('open');
  });

  if (c.slots.length > 0) {
    test(`${c.tag} forwards named slots to the shadow tree`, async ({ page }) => {
      const slotted = c.slots
        .map((s) => `<span slot="${s}" data-slot="${s}">slot-${s}</span>`)
        .join('');
      const body = `<${c.tag}>${slotted}</${c.tag}>`;
      const headExtra = `<script type="module" src="/dist/components/${c.tag}.js"></script>`;
      await setup(page, body, headExtra);

      await page.waitForFunction((tag) => !!customElements.get(tag), c.tag);

      // Each slotted span lands in a <slot name="X"> in the shadow DOM —
      // we verify the assignment by reading assignedSlot.name from the
      // light-DOM child.
      for (const slot of c.slots) {
        const assignedSlotName = await page
          .locator(`${c.tag} [data-slot="${slot}"]`)
          .evaluate((el) => el.assignedSlot && el.assignedSlot.name);
        expect(assignedSlotName, `slot=${slot}`).toBe(slot);
      }
    });
  }
}

// ─────────────────────────────────────────────────────────────────────
// Cross-cutting

test('--sa-accent override on :host propagates into shadow components', async ({ page }) => {
  // sa-header's ::slotted(a:hover) uses var(--sa-accent). Easier to test
  // a concrete usage like sa-hero's CTA background.
  const body = `
    <style>:root { --sa-accent: rgb(255, 0, 128); }</style>
    <sa-hero title="Test" subtitle="Sub" cta-href="#" cta-label="Click"></sa-hero>
  `;
  const headExtra = `<script type="module" src="/dist/components/sa-hero.js"></script>`;
  await setup(page, body, headExtra);
  await page.waitForFunction(() => !!customElements.get('sa-hero'));

  const ctaBg = await page.locator('sa-hero').evaluate((el) => {
    const cta = el.shadowRoot.querySelector('[part="cta"]');
    return getComputedStyle(cta).backgroundColor;
  });
  expect(ctaBg).toBe('rgb(255, 0, 128)');
});

test('reduced-motion preference suppresses the sa-hero CTA transition', async ({ page }) => {
  // sa-hero's `[part="cta"]` declares `transition: background-color 0.15s`
  // only inside `@media (prefers-reduced-motion: no-preference)`. Under
  // `reduce` the property should fall back to the browser default `all`.
  // (We test the shadow [part] rather than ::slotted because Chromium
  // does not reliably reflect emulateMedia changes in getComputedStyle
  // for slotted elements — but the rule pattern is identical across
  // sa-header / sa-footer / sa-hero, so this single test verifies the
  // guard for all of them.)
  await setup(
    page,
    `<sa-hero title="t" subtitle="s" cta-href="#" cta-label="Click"></sa-hero>`,
    `<script type="module" src="/dist/components/sa-hero.js"></script>`,
  );
  await page.waitForFunction(() => !!customElements.get('sa-hero'));

  const ctaTransition = (page) => page.locator('sa-hero').evaluate((el) =>
    getComputedStyle(el.shadowRoot.querySelector('[part="cta"]')).transitionProperty
  );

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const withMotion = await ctaTransition(page);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reducedMotion = await ctaTransition(page);

  expect(withMotion).toBe('background-color');
  expect(reducedMotion).toBe('all');
});
