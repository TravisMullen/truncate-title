/* global HTMLElement:false */

import Enumeration from './enumeration-class.js'
import ResizeObserver from 'resize-observer-polyfill'

/** HTML implementation name */
const elementRegistryName = 'truncate-title'

/**
 * Availible truncation types.
 * 
 * @readonly
 * @enum {string}
 * @see cutCenter
 * @see cutTail
 */
const TYPES = new Enumeration({
  center: 'cutCenter',
  tail: 'cutTail'
})

/**
 * Custom Element to truncate text within an `abbr` tag.
 *
 * @class TruncateTitle
 * @augments HTMLElement
 */
class TruncateTitle extends HTMLElement {
  constructor () {
    super()
    /**
     * Truncation type.
     * @default
     * @see attributeChangedCallback
     */
    this.truncationType = TYPES.tail

    /**
     * requestAnimationFrame reference for cancellation.
     * @see doTruncate
     * @see disconnectedCallback
     */
    this._rAF = null

    /**
     * Size of full text node (inner content) as rendered in DOM.
     * @see updateContent
     * @see shouldAugment
     */
    this.contentWidth = null

    /**
     * Character added to truncated text.
     * @default
     * @todo - Make this an attribute?
     */
    this.separator = '\u2026'

    /**
     * Amount of characters removed from text.
     * @default
     */
    this._increment = 2

    /**
     * State of last detected resize event.
     */
    this._hasChanged = {}
  }

  /**
   * Functions for instance.
   */

  /**
   * Animate removal or addition of characters depending on parent's size.
   *
   * @param - {string} title Text be truncated
   * @param - {boolean} [grow=true] Should the text be lengthened or shortened
   */
  doTruncate (title, grow = true) {
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
          this.style.opacity = 1
        }
      }
      this._rAF = window.requestAnimationFrame(rAFhandler)
    } else {
      this.style.opacity = 1
    }
  }

  /**
   * Get and save the text width for comparison.
   *
   * @param - {string} newValue
   * @param - {string} newValue
   */
  updateContent (newValue) {
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
     * @see updateContent
     */
    this.style.whiteSpace = 'nowrap'
    this.style.opacity = 0
    /** @todo - map transitionTime to a CSS custom property */
    this.style.transition = 'opacity .3s'

    /**
     * ResizeObserver callback function for handling truncation logic.
     *
     * @see https://wicg.github.io/ResizeObserver/
     */
    this._resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const {width} = entry.contentRect

        /** 
         * Cancel any existing doTruncate.
         * @note - Fixes infanite loop if parent is expaneded before doTruncate is complete and no longer requires truncation.
         */
        if (this._rAF) { window.cancelAnimationFrame(this._rAF) }

        /** 
         * Be sure there was actually a change.
         * @todo - test that is required to reduce events
         */
        if (this._hasChanged[entry] === width) { continue }

        /** Determine if parent is less than the inner text size. */
        if (!TruncateTitle.shouldAugment(this)) {
          this.updateContent(this.getAttribute('title'))
          this._hasChanged[entry] = width
          continue
        }

        /** Determine if resize of the parent getting larger. */
        if (this._hasChanged[entry] < width) {
          this.doTruncate(this.getAttribute('title'), false)
          this._hasChanged[entry] = width
          continue
        }

        /** Determine if resize of the parent getting smaller. */
        this.doTruncate(this.getAttribute('title'))
        this._hasChanged[entry] = width
      }
    })

    /**
     * Observe the parent HTMLElement of this instance.
     */
    this._resizeObserver.observe(this.parentElement)

    /**
     * Set title value. Do first steps for truncation.
     */
    if (this.hasAttribute('title')) {
      this.updateContent(this.getAttribute('title'))
      this.doTruncate(this.getAttribute('title'))
    }

    /**
     * Determine type of truncation.
     */
    if (!this.hasAttribute('title-break')) {
      this.setAttribute('title-break', TYPES.split)
    }
  }

  disconnectedCallback () {
    window.cancelAnimationFrame(this._rAF)
  }

  static get observedAttributes () {
    return ['title', 'title-break']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    /** @note - make sure Node.isConnected before trying to augment content */
    if (name === 'title' && this.isConnected) {
      this.updateContent(newValue)
      this.doTruncate(newValue)
    }
    /** @note - if newValue is undefined its a typeof string */
    if (name === 'title-break' && newValue !== 'undefined') {
      this.truncationType = newValue
      this.doTruncate(this.getAttribute('title'))
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
      /** @todo - throw error, warning or ignore? */
      console.warn(`${newValue} is not a valid truncation type. It has not been changed.`)
    }
  }

// ========================================================================== //
// Static Functions.
// ========================================================================== //

  /**
   * Determines if full title text, rendered as inner content, is larger than its parent.
   *
   * @param - {HTMLElement} self Instance of TruncateTitle
   * @returns - {boolean}
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
   * @param - {HTMLElement} self Instance of TruncateTitle
   * @returns - {boolean}
   * @see doTruncate
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
   * @note - accounts for padding of parent
   * @param - {HTMLElement} self Instance of TruncateTitle
   * @returns - {boolean}
   * @see doTruncate
   */
  static shouldGrow (self) {
    const box = 0 +
      parseInt(window.getComputedStyle(self.parentElement).paddingLeft.replace('px', '')) +
      parseInt(window.getComputedStyle(self.parentElement).paddingRight.replace('px', ''))
    return (self.parentElement.clientWidth - box) > (self.offsetWidth + parseInt(window.getComputedStyle(self.parentElement).paddingRight.replace('px', '')))
  }

  /**
   * Remove characters from the end of the string.
   */
  static cutTail (title, increment, separator = '\u2026') {
    return [
      title.slice(0, (title.length - increment)),
      separator
    ].join(' ')
  }

  /**
   * Remove characters from the center of the string.
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
 * @readonly
 */
Object.defineProperty(TruncateTitle, 'is', {
  value: elementRegistryName,
  writable: false,
  enumerable: true,
  configurable: false
})

/**
 * Define in CustomElementRegistry.
 */
window.customElements.define(TruncateTitle.is, TruncateTitle, {extends: 'abbr'})
