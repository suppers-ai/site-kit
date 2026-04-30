// sa-hero.js — site-kit hero component.
// Attribute-heavy splash: title (required), subtitle, eyebrow,
// cta-href + cta-label, align (left|center). Optional <slot name="media">.
// CTA renders only when both cta-href and cta-label are set.
// Component renders nothing if title is missing.

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host {
    display: block;
  }
  [hidden] { display: none !important; }
  [part="container"] {
    max-width: var(--sa-max-width);
    margin-inline: auto;
    padding: var(--sa-space-24) var(--sa-space-6);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sa-space-12);
    align-items: center;
  }
  :host([has-media][align="left"]) [part="container"] {
    grid-template-columns: 1fr 1fr;
  }
  :host([align="center"]) [part="container"] {
    text-align: center;
  }
  .text {
    max-width: 50ch;
  }
  :host([align="center"]) .text {
    max-width: none;
  }
  [part="eyebrow"] {
    display: inline-block;
    font-size: var(--sa-text-sm);
    color: var(--sa-accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--sa-space-4);
  }
  [part="title"] {
    margin-bottom: var(--sa-space-4);
  }
  [part="subtitle"] {
    color: var(--sa-text-muted);
    font-size: var(--sa-text-lg);
    margin-bottom: var(--sa-space-8);
  }
  [part="cta"] {
    /* inline-flex + min-height keeps the CTA at the WCAG/HIG/MD touch
     * minimum (44pt) regardless of label length or font scale. */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    background: var(--sa-accent);
    color: var(--sa-on-accent);
    text-decoration: none;
    padding: var(--sa-space-3) var(--sa-space-6);
    border-radius: var(--sa-radius-md);
  }
  [part="cta"]:hover {
    background: var(--sa-accent-hover);
  }
  [part="cta"]:focus-visible {
    outline: 2px solid var(--sa-accent);
    outline-offset: 2px;
  }
  [part="cta"]:active {
    transform: scale(0.98);
  }
  @media (prefers-reduced-motion: no-preference) {
    [part="cta"] {
      transition: background-color 0.15s, transform 0.1s;
    }
  }
  :host([align="center"]) [part="cta"] {
    margin-inline: auto;
  }
  [part="media"] {
    display: block;
  }
  ::slotted([slot="media"]) {
    width: 100%;
    height: auto;
    display: block;
  }
  @media (max-width: 720px) {
    :host([has-media][align="left"]) [part="container"] {
      grid-template-columns: 1fr;
    }
  }
</style>
<div part="container">
  <div class="text">
    <span part="eyebrow" hidden></span>
    <h1 part="title" hidden></h1>
    <p part="subtitle" hidden></p>
    <a part="cta" hidden></a>
  </div>
  <div part="media"><slot name="media"></slot></div>
</div>
`;

class SaHero extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'eyebrow', 'cta-href', 'cta-label', 'align'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }

  connectedCallback() {
    if (!this.hasAttribute('align')) {
      this.setAttribute('align', 'left');
    }
    this._render();
    const mediaSlot = this.shadowRoot.querySelector('slot[name="media"]');
    mediaSlot.addEventListener('slotchange', () => this._updateHasMedia());
    this._updateHasMedia();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  _render() {
    const eyebrowEl  = this.shadowRoot.querySelector('[part="eyebrow"]');
    const titleEl    = this.shadowRoot.querySelector('[part="title"]');
    const subtitleEl = this.shadowRoot.querySelector('[part="subtitle"]');
    const ctaEl      = this.shadowRoot.querySelector('[part="cta"]');

    const title = this.getAttribute('title');
    if (!title) {
      // No title = nothing renders (per spec).
      eyebrowEl.hidden  = true;
      titleEl.hidden    = true;
      subtitleEl.hidden = true;
      ctaEl.hidden      = true;
      return;
    }

    titleEl.textContent = title;
    titleEl.hidden = false;

    const eyebrow = this.getAttribute('eyebrow');
    if (eyebrow) {
      eyebrowEl.textContent = eyebrow;
      eyebrowEl.hidden = false;
    } else {
      eyebrowEl.hidden = true;
    }

    const subtitle = this.getAttribute('subtitle');
    if (subtitle) {
      subtitleEl.textContent = subtitle;
      subtitleEl.hidden = false;
    } else {
      subtitleEl.hidden = true;
    }

    const ctaHref  = this.getAttribute('cta-href');
    const ctaLabel = this.getAttribute('cta-label');
    if (ctaHref && ctaLabel) {
      ctaEl.setAttribute('href', ctaHref);
      ctaEl.textContent = ctaLabel;
      ctaEl.hidden = false;
    } else {
      ctaEl.removeAttribute('href');
      ctaEl.textContent = '';
      ctaEl.hidden = true;
    }
  }

  _updateHasMedia() {
    const mediaSlot = this.shadowRoot.querySelector('slot[name="media"]');
    const hasMedia = mediaSlot.assignedNodes({ flatten: true }).length > 0;
    if (hasMedia) {
      this.setAttribute('has-media', '');
    } else {
      this.removeAttribute('has-media');
    }
  }
}

customElements.define('sa-hero', SaHero);
