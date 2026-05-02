// sa-header.js — site-kit header component.
// Slot-heavy chrome: brand left, nav center, actions right.
// At narrow viewports, slots stack vertically (pure CSS responsive,
// no JS-driven hamburger).

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host {
    display: block;
    position: sticky;
    top: 0;
    z-index: var(--sa-z-header);
    background: var(--sa-bg-card);
    border-bottom: 1px solid var(--sa-border);
  }
  [part="container"] {
    display: flex;
    align-items: center;
    gap: var(--sa-space-4);
    max-width: var(--sa-max-width);
    margin-inline: auto;
    padding: var(--sa-space-3) var(--sa-space-6);
  }
  [part="brand"] {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  [part="nav"] {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: var(--sa-space-4);
  }
  /* When the consumer slots a wrapper element (typical pattern: a single
   * <nav slot="nav"> with <a> children), make it the flex container so
   * the inner links get spacing. Without this, the gap above only
   * applies between sibling slotted elements. */
  ::slotted([slot="nav"]) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--sa-space-4);
  }
  [part="actions"] {
    display: flex;
    align-items: center;
    gap: var(--sa-space-3);
    flex-shrink: 0;
  }
  ::slotted(a) {
    color: var(--sa-text);
    text-decoration: none;
  }
  ::slotted(a:hover) {
    color: var(--sa-accent);
  }
  ::slotted(a:focus-visible) {
    outline: 2px solid var(--sa-accent);
    outline-offset: 2px;
    border-radius: var(--sa-radius-sm);
  }
  ::slotted(a:active) {
    opacity: 0.7;
  }
  @media (prefers-reduced-motion: no-preference) {
    ::slotted(a) {
      transition: color 0.15s, opacity 0.1s;
    }
  }
  @media (max-width: 720px) {
    [part="container"] {
      flex-direction: column;
      align-items: stretch;
      gap: var(--sa-space-3);
    }
    /* Many-item nav: horizontally scrollable single-row strip rather
     * than a multi-row wrap that grows the header to ~180px tall on a
     * 375px viewport. Established pattern (Twitter mobile tabs, GH
     * repo tabs). Hidden scrollbar keeps the look clean — flick-to-
     * scroll is the affordance. */
    [part="nav"],
    ::slotted([slot="nav"]) {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    [part="nav"]::-webkit-scrollbar,
    ::slotted([slot="nav"])::-webkit-scrollbar {
      display: none;
    }
  }
</style>
<header part="container">
  <div part="brand"><slot name="brand"></slot></div>
  <div part="nav"><slot name="nav"></slot></div>
  <div part="actions"><slot name="actions"></slot></div>
</header>
`;

class SaHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }
}

customElements.define('sa-header', SaHeader);
