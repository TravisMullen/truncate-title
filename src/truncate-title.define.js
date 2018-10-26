
import TruncateTitle from './truncate-title.element.js'

/**
 * Define in CustomElementRegistry.
 */
export const registerCustomElement = (elementName = TruncateTitle.is) => {
  window.customElements.define(elementName, TruncateTitle, { extends: 'abbr' })
}
