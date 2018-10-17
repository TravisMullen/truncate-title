/* global HTMLElement:false, CustomEvent: false */

import { name, version } from '../package.json'
import Enumeration from 'enumeration-class'
import ResizeObserver from 'resize-observer-polyfill'

/**
 * Availible truncation types.
 *
 * @readonly
 * @enum {string}
 * @see TruncateTitle.cutCenter
 * @see TruncateTitle.cutEnd
 */
const TYPES = new Enumeration({
  center: 'cutCenter',
  end: 'cutEnd'
})

/**
 * # Truncate Title
 * Custom Element to truncate text within an `abbr` tag.
 * Declare full text as `title` attribute,
 * and will auto generate `textContent`.
 *
 * @customElement
 * @class TruncateTitle
 * @augments HTMLElement
 * @demo /index.html
 */
class TruncateTitle extends HTMLElement {
  constructor () {
    super()
    /**
     * Version
     * @member {number}
     * @readonly
     */
    Object.defineProperty(this, 'version', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: version
    })

    /**
     * Truncation type.
     * @member {string}
     * @default
     * @see attributeChangedCallback
     */
    this.truncationType = TYPES.end

    /**
     * requestAnimationFrame reference for cancellation.
     * @member {number}
     * @see _doTruncate
     * @see disconnectedCallback
     */
    this._rAF = null

    /**
     * Size, in pixels, of full text node (inner content) as rendered in DOM.
     * @member {number}
     * @see _updateContent
     * @see shouldAugment
     */
    this.contentWidth = null

    /**
     * Character added to truncated text.
     * Can be changed using attribute `separator`
     * on `connectedCallback` but is not observed.
     * @member {string}
     * @default
     */
    this.separator = '\u2026'

    /**
     * Amount of characters removed from text.
     * @member {number}
     * @default
     */
    this._increment = 2

    /**
     * State of last detected resize event.
     * @member {Object}
     */
    this._hasChanged = {}

    /** create wrapper element */
  }

  /**
   * Functions for instance.
   */

  /**
   * Signal that truncation has been completed.
   *
   */
  _completeTruncate () {
    /** @todo - handle this more gracefully so it does not override a custom opacity */
    this.style.opacity = 1
    this.dispatchEvent(new CustomEvent('truncate-complete', {
      detail: {
        before: this.getAttribute('title'),
        after: this.textContent,
        width: this.parentElement.clientWidth
      },
      bubbles: true,
      composed: true,
      cancelable: true
    }))
  }

  /**
   * Animate removal or addition of characters depending on parent's size.
   *
   * @param {string} title Text be truncated
   * @param {boolean} grow Should the text be lengthened or shortened
   */
  _doTruncate (title, grow = true) {
    const checkFn = grow ? TruncateTitle.shouldTruncate : TruncateTitle.shouldGrow
    if (checkFn(this)) {
      const rAFhandler = now => {
        if (grow) {
          ++this._increment
        } else {
          --this._increment
        }

        this.textContent = TruncateTitle[this.truncationType](title, this._increment, this.separator)

        if (checkFn(this)) {
          this._rAF = window.requestAnimationFrame(rAFhandler)
        } else {
          this._completeTruncate()
        }
      }
      this._rAF = window.requestAnimationFrame(rAFhandler)
    } else {
      /** @note restore opacity if truncation is not required */
      this.style.opacity = 1
    }
  }

  /**
   * Get and save the text width for comparison.
   *
   * @param {string} newValue
   */
  _updateContent (newValue) {
    /** render the raw text string in the DOM */
    this.textContent = newValue
    /** store width value for comparison later */
    this.contentWidth = this.offsetWidth
  }

  // ========================================================================== //
  // Custom Element lifecycle hooks.
  // ========================================================================== //

  connectedCallback () {
    /**
     * Change the default browser styles for `abbr` tag.
     */
    this.style.textDecorationLine = 'none'
    this.style.boxSizing = 'border-box'
    this.style.display = 'inline-block'
    /**
     * Force text content to extend past parent for width analysis.
     *
     * @see _updateContent
     */
    this.style.whiteSpace = 'nowrap'
    this.style.opacity = 0
    /** @todo Map transitionTime to a CSS custom property */
    this.style.transition = 'opacity .3s'

    /**
     * ResizeObserver callback function for handling truncation logic.
     *
     * @see https://wicg.github.io/ResizeObserver/
     */
    this._resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { width } = entry.contentRect

        /**
         * Cancel any existing _doTruncate.
         * @note Fixes infanite loop if parent is expaneded before _doTruncate is complete and no longer requires truncation.
         */
        if (this._rAF) { window.cancelAnimationFrame(this._rAF) }

        /**
         * Be sure there was actually a change.
         * @todo test that is required to reduce events
         */
        // if (this._hasChanged[entry] === width) { continue }

        /** Determine if parent is less than the inner text size. */
        if (!TruncateTitle.shouldAugment(this)) {
          this._updateContent(this.getAttribute('title'))
          this._hasChanged[entry] = width
          continue
        }

        /** Determine if resize of the parent getting larger. */
        if (this._hasChanged[entry] < width) {
          this._doTruncate(this.getAttribute('title'), false)
          this._hasChanged[entry] = width
          continue
        }

        /** Determine if resize of the parent getting smaller. */
        this._doTruncate(this.getAttribute('title'))
        this._hasChanged[entry] = width
      }
    })

    /**
     * Observe the parent HTMLElement of this instance.
     */
    this._resizeObserver.observe(this.parentElement)

    /**
     * Set separator value. Only on first render, not observed.
     */
    if (this.hasAttribute('separator')) {
      this.separator = this.getAttribute('separator')
    }

    /**
     * Set title value. Do first steps for truncation.
     */
    if (this.hasAttribute('title')) {
      this._updateContent(this.getAttribute('title'))
      this._doTruncate(this.getAttribute('title'))
    }
  }

  disconnectedCallback () {
    window.cancelAnimationFrame(this._rAF)
  }

  static get observedAttributes () {
    return ['title', 'title-break']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    /** @note Make sure Node.isConnected before trying to augment content */
    if (name === 'title' && this.isConnected) {
      this._updateContent(newValue)
      this._doTruncate(newValue)
    }
    /** @note If newValue is undefined its a typeof string */
    if (name === 'title-break' && newValue !== 'undefined') {
      this.truncationType = TYPES[newValue]
      this._doTruncate(this.getAttribute('title'))
    }
  }

  // ========================================================================== //
  // Getters and Setters.
  // ========================================================================== //

  get title () {
    this.getAttribute('title')
  }

  set title (newValue) {
    this.setAttribute('title', newValue)
  }

  get titleBreak () {
    this.getAttribute('title-break')
  }

  set titleBreak (newValue) {
    if (TYPES.has(newValue.toLowerCase())) {
      this.setAttribute('title-break', newValue)
    } else {
      /** @todo throw error, warning or ignore? */
      console.warn(`${newValue} is not a valid truncation type. It has not been changed.`)
    }
  }

  // ========================================================================== //
  // Static Functions.
  // ========================================================================== //

  /**
   * Determines if full title text, rendered as inner content, is larger than its parent.
   *
   * @param {HTMLElement} self Instance of TruncateTitle
   * @returns {boolean}
   * @see this._resizeObserver
   */
  static shouldAugment (self) {
    const box = 0 +
      parseInt(window.getComputedStyle(self.parentElement).paddingLeft.replace('px', '')) +
      parseInt(window.getComputedStyle(self.parentElement).paddingRight.replace('px', ''))
    return (self.parentElement.clientWidth - box) < self.contentWidth
  }

  /**
   * Determines if truncated title text is larger than its parent.
   *
   * @param {HTMLElement} self Instance of TruncateTitle
   * @returns {boolean}
   * @see _doTruncate
   */
  static shouldTruncate (self) {
    const box = 0 +
      parseInt(window.getComputedStyle(self.parentElement).paddingLeft.replace('px', '')) +
      parseInt(window.getComputedStyle(self.parentElement).paddingRight.replace('px', ''))
    return (self.parentElement.clientWidth - box) < self.offsetWidth
  }

  /**
   * Determines if truncated title text has room within its parent to add more characters.
   *
   * @note Accounts for padding of parent.
   * @param {HTMLElement} self Instance of TruncateTitle
   * @returns {boolean}
   * @see _doTruncate
   */
  static shouldGrow (self) {
    const box = 0 +
      parseInt(window.getComputedStyle(self.parentElement).paddingLeft.replace('px', '')) +
      parseInt(window.getComputedStyle(self.parentElement).paddingRight.replace('px', ''))
    return (self.parentElement.clientWidth - box) > (self.offsetWidth + parseInt(window.getComputedStyle(self.parentElement).paddingRight.replace('px', '')))
  }

  /**
   * Remove characters from the end of the string.
   * @param {string} title
   * @param {number} increment Number of characters to be removed.
   * @returns {string}
   */
  static cutEnd (title, increment, separator = '\u2026') {
    return [
      title.slice(0, (title.length - increment)),
      separator
    ].join(' ')
  }

  /**
   * Remove characters from the center of the string.
   * @param {string} title
   * @param {number} increment Number of characters to be removed.
   * @note `increment` is doubled since it is applied twice.
   * @returns {string}
   */
  static cutCenter (title, increment, separator = '\u2026') {
    const centerIndex = Math.floor(title.length / 2)
    return [
      title.slice(0, (centerIndex - increment)),
      separator,
      title.slice((centerIndex + increment), title.length)
    ].join(' ')
  }
}

/**
 * Define `is` attribute name for extended HTMLElement.
 * 
 * @memberof TruncateTitle {string}
 * @readonly
 */
Object.defineProperty(TruncateTitle, 'is', {
  value: name,
  writable: false,
  enumerable: true,
  configurable: false
})

/**
 * Define in CustomElementRegistry.
 */
const registerCustomElement = (elementName = TruncateTitle.is) => {
  window.customElements.define(elementName, TruncateTitle, { extends: 'abbr' })
}

export { TruncateTitle as default, registerCustomElement }
