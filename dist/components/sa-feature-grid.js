// sa-feature-grid.js — site-kit feature grid layout.
// Auto-fitting CSS Grid container. Children typically <sa-feature>
// instances but the grid does not enforce — anything dropped in adopts
// the auto-fit layout.

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host {
    display: block;
  }
  [part="container"] {
    max-width: var(--sa-max-width);
    margin-inline: auto;
    padding: var(--sa-space-12) var(--sa-space-6);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--sa-grid-min, 280px), 1fr));
    gap: var(--sa-space-8);
  }
</style>
<div part="container">
  <slot></slot>
</div>
`;

class SaFeatureGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }
}

customElements.define('sa-feature-grid', SaFeatureGrid);
