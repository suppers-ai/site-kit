// sa-footer.js — site-kit footer component.
// Slot-heavy chrome: brand + links in a top row, copyright in a
// bottom row separated by a top border. At narrow viewports, the
// top row stacks vertically.

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host {
    display: block;
    /* Footer can run a different theme from the rest of the page (e.g.
     * dark band beneath a light page). Override these tokens at the
     * consumer level (or on :host directly via the cascade) to switch
     * palette without forking the component. Defaults preserve the
     * previous light-card look. */
    --sa-footer-bg: var(--sa-bg-card);
    --sa-footer-text: var(--sa-text);
    --sa-footer-text-muted: var(--sa-text-muted);
    --sa-footer-border: var(--sa-border);
    background: var(--sa-footer-bg);
    border-top: 1px solid var(--sa-footer-border);
    color: var(--sa-footer-text);
  }
  [part="container"] {
    max-width: var(--sa-max-width);
    margin-inline: auto;
    padding: var(--sa-space-12) var(--sa-space-6);
  }
  [part="top"] {
    display: flex;
    align-items: flex-start;
    gap: var(--sa-space-8);
  }
  [part="brand"] {
    flex-shrink: 0;
  }
  [part="links"] {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: var(--sa-space-6);
    justify-content: flex-end;
  }
  /* Same pattern as sa-header: when the consumer slots a <nav> wrapper
   * (e.g. <nav slot="links">), make it the flex container so its
   * inner <a> children get spacing. Narrowed to nav-only so consumers
   * who slot a <div> with their own column layout (grid, etc.) keep
   * full control without the kit imposing flex/justify rules. */
  ::slotted(nav[slot="links"]) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sa-space-6);
    justify-content: flex-end;
  }
  [part="bottom"] {
    margin-top: var(--sa-space-8);
    padding-top: var(--sa-space-6);
    border-top: 1px solid var(--sa-footer-border);
    font-size: var(--sa-text-sm);
    color: var(--sa-footer-text-muted);
  }
  ::slotted(a) {
    color: var(--sa-footer-text);
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
    [part="top"] {
      flex-direction: column;
      align-items: stretch;
      gap: var(--sa-space-6);
    }
    [part="links"],
    ::slotted(nav[slot="links"]) {
      justify-content: flex-start;
    }
  }
</style>
<footer part="container">
  <div part="top">
    <div part="brand"><slot name="brand"></slot></div>
    <div part="links"><slot name="links"></slot></div>
  </div>
  <div part="bottom">
    <div part="copyright"><slot name="copyright"></slot></div>
  </div>
</footer>
`;

class SaFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }
}

customElements.define('sa-footer', SaFooter);
