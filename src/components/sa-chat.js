// sa-chat.js — site-kit chat layout shell.
//
// A thin two-region layout: a scrollable messages region on top, a
// pinned composer region on the bottom. Both regions are slot-only
// — the kit imposes layout (max-width, vertical sizing, hairline
// divider, padding via tokens), nothing about the appearance of
// individual messages or the composer's controls.
//
// Slots:
//   - "messages": consumer drops the messages container here. Stays
//     in light DOM so the consumer's app code can keep its existing
//     selectors (`#messages`, etc.) and append message nodes
//     directly.
//   - "composer": consumer drops the composer here (typically a
//     <form> with a <textarea> + send button, plus any leading or
//     trailing controls).
//
// Override the default 880px container width with
// `--sa-chat-max-width`.

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    width: 100%;
    max-width: var(--sa-chat-max-width, 880px);
    min-height: 0;
    margin-inline: auto;
  }
  [part="messages"] {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: var(--sa-space-8) var(--sa-space-6);
  }
  [part="composer"] {
    flex: 0 0 auto;
    padding: var(--sa-space-4) var(--sa-space-6);
    border-top: 1px solid var(--sa-border);
    background: var(--sa-bg-card);
  }
</style>
<div part="messages"><slot name="messages"></slot></div>
<div part="composer"><slot name="composer"></slot></div>
`;

class SaChat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }
}

customElements.define('sa-chat', SaChat);
