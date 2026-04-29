// sa-feature.js — site-kit feature card.
// Designed to live inside <sa-feature-grid> but works standalone.
// One observed attribute (title, required), one named slot (icon),
// default slot for body/description. Renders nothing if title is
// missing. Reflects has-icon host attribute via slotchange so the
// icon part is hidden when no icon is provided.

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host {
    display: block;
  }
  [hidden] { display: none !important; }
  [part="container"] {
    background: var(--sa-bg-card);
    border: 1px solid var(--sa-border);
    border-radius: var(--sa-radius-md);
    padding: var(--sa-space-6);
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--sa-space-3);
  }
  [part="icon"] {
    width: 32px;
    height: 32px;
    color: var(--sa-accent);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :host(:not([has-icon])) [part="icon"] {
    display: none;
  }
  ::slotted([slot="icon"]) {
    max-width: 100%;
    max-height: 100%;
  }
  [part="title"] {
    font-size: var(--sa-text-xl);
    margin: 0;
  }
  [part="body"] {
    color: var(--sa-text-muted);
    font-size: var(--sa-text-base);
    line-height: var(--sa-leading-relaxed);
    flex-grow: 1;
  }
</style>
<div part="container">
  <div part="icon"><slot name="icon"></slot></div>
  <h3 part="title"></h3>
  <div part="body"><slot></slot></div>
</div>
`;

class SaFeature extends HTMLElement {
  static get observedAttributes() {
    return ['title'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }

  connectedCallback() {
    this._render();
    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    iconSlot.addEventListener('slotchange', () => this._updateHasIcon());
    this._updateHasIcon();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  _render() {
    const titleEl = this.shadowRoot.querySelector('[part="title"]');
    const containerEl = this.shadowRoot.querySelector('[part="container"]');
    const title = this.getAttribute('title');
    if (!title) {
      containerEl.hidden = true;
      return;
    }
    containerEl.hidden = false;
    titleEl.textContent = title;
  }

  _updateHasIcon() {
    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    const hasIcon = iconSlot.assignedNodes({ flatten: true }).length > 0;
    if (hasIcon) {
      this.setAttribute('has-icon', '');
    } else {
      this.removeAttribute('has-icon');
    }
  }
}

customElements.define('sa-feature', SaFeature);
