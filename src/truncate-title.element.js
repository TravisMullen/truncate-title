/* global HTMLElement:false, CustomEvent: false */

import { name, version } from '../package.json'
import Enumeration from 'enumeration-class'
import ResizeObserver from 'resize-observer-polyfill'
import { estimateWidth } from './estimation.js'

/** @typedef {string|number} attribute */
/** @typedef {string} center */
/** @typedef {string} end */

/**
 * Availible truncation types.
 *
 * @readonly
 * @enum {center|end}
 *
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
 * @customElement trucate-title
 * @class TruncateTitle
 * @augments HTMLElement
 * @see example {@link https://github.com/notmessenger/jsdoc-plugins/blob/master/README.md}
 * @example <captionSome text</caption>
 * <trucate-title title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui."></trucate-title>
 * @example <caption>Small Parent</caption>
 * <div style="width: 100px"><trucate-title title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui."></trucate-title></div>
 * @example index.html
 */
class TruncateTitle extends HTMLElement {
  constructor () {
    super()
    /**
     * Version
     * @member {string}
     * @readonly
     */
    Object.defineProperty(this, 'version', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: version
    })

    /**
     * requestAnimationFrame reference for cancellation.
     * @member {number}
     * @see TruncateTitle#_doTruncate
     * @see TruncateTitle#disconnectedCallback
     */
    this._rAF = null

    /**
     * Size, in pixels, of full text node (inner content) as rendered in DOM.
     * @member {number}
     * @see TruncateTitle#_updateContent
     * @see TruncateTitle#shouldAugment
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
  }

  // ========================================================================== //
  // Functions for instance.
  // ========================================================================== //

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
      /** restore opacity if truncation is not required */
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

  /**
   * Check to see if declared type is valid.
   *
   * @param  {string} newValue  Break type to be assigned.
   * @return {boolean}           Is a valid breaktype. [True=valid]
   */
  _validateBreakType (newValue) {
    if (TYPES.has(newValue.toLowerCase())) {
      return true
    } else {
      if (this.hasAttribute('debug')) {
        console.warn(`${newValue} is not a valid truncation type. It has not been changed. Only "${Object.keys(TYPES).join('" and "')}" types are valid.`)
      }
      return false
    }
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
     * @see TruncateTitle#_updateContent
     */
    this.style.whiteSpace = 'nowrap'
    this.style.opacity = 0
    /** @todo Map transitionTime to a CSS custom property */
    this.style.transition = 'opacity .3s'

    /**
     * ResizeObserver callback function for handling truncation logic.
     *
     * @see {@link https://wicg.github.io/ResizeObserver/}
     */
    this._resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { width } = entry.contentRect

        /**
         * Cancel any existing _doTruncate.
         * Fixes infanite loop if parent is expaneded before _doTruncate is complete and no longer requires truncation.
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
    if (!this.hasAttribute('title')) {
      this.setAttribute('title-break', 'end')
    }
  }

  disconnectedCallback () {
    this._resizeObserver.disconnect()
    if (this._rAF) { window.cancelAnimationFrame(this._rAF) }
  }

  static get observedAttributes () {
    return [
    /**
     * Title Attribute
     *
     * @name title
     * @type {string}
     * @memberof TruncateTitle
     * @emits TruncateTitle#_updateContent
     * @emits TruncateTitle#_doTruncate
     */
      'title',

      /**
     * Title break Attribute
     *
     * @name title-break
     * @type {string}
     * @memberof TruncateTitle
     * @emits TruncateTitle#separator
     * @emits TruncateTitle#_doTruncate
     */
      'title-break'
    ]
  }

  attributeChangedCallback (name, oldValue, newValue) {
    /** Make sure Node.isConnected before trying to augment content */
    if (!this.isConnected) return
    if (this._rAF) { window.cancelAnimationFrame(this._rAF) }

    /** If newValue is undefined its a typeof string */
    if (name === 'title-break' && this._validateBreakType(newValue)) {
      /**
       * Truncation type.
       * @member {string}
       * @see TruncateTitle#attributeChangedCallback
       */
      this.truncationType = TYPES[newValue]
    }

    this._updateContent(this.getAttribute('title'))

    this._increment = estimateWidth(this, this.parentElement, this.getAttribute('title'))

    this._doTruncate(this.getAttribute('title'))
  }

  // ========================================================================== //
  // Getters and Setters.
  // ========================================================================== //
  /**
   * Get `title` value.
   * @name getTitle
   * @type {string}
   * @return {string}
   */
  get title () {
    return this.getAttribute('title')
  }
  /**
   * Set `title` value.
   * @name setTitle
   * @emits TruncateTitle#title
   * @param {string}
   */
  set title (newValue) {
    this.setAttribute('title', newValue)
  }
  /**
   * Get `title` value from `title-break`.
   * @name getTitleBreak
   * @type {string}
   * @return {cutType}
   */
  get titleBreak () {
    return this.getAttribute('title-break')
  }
  /**
   * Set `title` value.
   * @name setTitleBreak
   * @emits TruncateTitle#title-break
   * @param {cutType}
   */
  set titleBreak (newValue) {
    if (this._validateBreakType(newValue)) {
      this.setAttribute('title-break', newValue)
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
   * @see TruncateTitle#_resizeObserver
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
   * @see TruncateTitle#_doTruncate
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
   * Accounts for padding of parent.
   * @param {HTMLElement} self Instance of TruncateTitle
   * @returns {boolean}
   * @see TruncateTitle#_doTruncate
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
   * `increment` is doubled since it is applied twice.
   * @returns {string}
   */
  static cutCenter (title, increment, separator = '\u2026') {
    const centerIndex = Math.floor(title.length / 2)
    return [
      title.slice(0, (centerIndex - Math.ceil(increment / 2))),
      separator,
      title.slice((centerIndex + Math.ceil(increment / 2)), title.length)
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

export { TruncateTitle as default }
