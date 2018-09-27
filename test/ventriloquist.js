/* eslint-env mocha */
/* global page: false */

import camelCase from 'camel-case'
import paramCase from 'param-case'
import pascalCase from 'pascal-case'

/** ventriloquist */

// @todo - make a class
const ventriloquist = {}
const version = 'v0.1.0'
const ventriloquistError = msg => new Error(`ventriloquist ${version} - ${msg}`)

/** @link - https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes */
const globalAttributes = new Set([
  // 'aria-*',
  'accesskey',
  'autocapitalize',
  'class',
  'contenteditable',
  'contextmenu',
  // 'data-*',
  'dir',
  'draggable',
  'dropzone',
  'hidden',
  'id',
  // 'is', // set in createElement only as setting via attribute will not instantial custom element
  'itemid',
  'itemprop',
  'itemref',
  'itemscope',
  'itemtype',
  'lang',
  'slot',
  'spellcheck',
  'style',
  'tabindex',
  'title',
  'translate'
])

const DocumentOrShadowRoot = ['activeElement', 'styleSheets']
// @todo - add 'caretPositionFromPoint', 'elementFromPoint'
const defaultProperties = ['textContent', 'innerHTML', ...DocumentOrShadowRoot]
const defaultSetters = [...defaultProperties, ...globalAttributes]

const definedSetters = new Set()

// const shadowSelectorFn = (el, selector) => el.shadowRoot.querySelector(selector)

// for s
ventriloquist.resizeElement = async (selector, width, height) => {
  const handle = await page.evaluateHandle((el, _width, _height) => {
    const elm = document.querySelector(el)
    if (_width) {
      elm.style.width = _width
    }
    if (_height) {
      elm.style.height = _height
    }
  }, selector, width, height)
  handle.dispose()
  return true
}

ventriloquist.createCustomElementHandle = async (createElement, extended = null, parentElement, properties = {}) => {
  const customElement = await page.evaluateHandle((selector, is, parent, props) => {
    let elm
    if (is) {
      elm = document.createElement(selector, { is })
    } else {
      elm = document.createElement(selector)
    }

    if (Object.keys(props).length) {
      for (const item in props) {
        elm[item] = props[item]
      }
    }

    if (parent) {
      document.querySelector(parent).appendChild(elm)
    } else {
      document.body.appendChild(elm)
    }
    return elm
  }, createElement, extended, parentElement, properties)
  return customElement
}

ventriloquist.removeCustomElementHandle = async (createCustomElementHandle, parentSelector = null) => {
  const handle = await page.evaluateHandle((elm, parent) => {
    if (parent) {
      document.querySelector(parent).removeChild(elm)
    } else {
      document.body.removeChild(elm)
    }
  }, createCustomElementHandle, parentSelector)
  if (createCustomElementHandle.dispose) {
    await createCustomElementHandle.dispose()
  }
  handle.dispose()
  return true
}

ventriloquist.customElementHandle = async selector => {
  const handle = await page.evaluateHandle((el) => document.querySelector(el), selector)
  return handle
}

// ventriloquist.queryDeep = async (page, ...selectors) => {
//   if (!selectors || selectors.length === 0) {
//     return;
//   }

//   const [ firstSelector, ...restSelectors ] = selectors;
//   let parentElement = await page.$(firstSelector);
//   for (const selector of restSelectors) {
//     parentElement = await page.evaluateHandle(shadowSelectorFn, parentElement, selector);
//   }

//   return parentElement;
// };

/**
 * Handle function wrapper for a custom element to be
 * defined in `window.CustomElementRegistry`.
 * @param  {string} selector - Selector for custom element.
 * @return {Promise} - Resolves when custom element is `.define`.
 */
ventriloquist.waitForHandle = async selector => {
  const handle = await page.evaluateHandle((el) => window.customElements.waitFor(el), selector)
  return handle
}

ventriloquist.shadowHandle = async (selector, parent) => {
  const handle = await page.evaluateHandle((el) => document.querySelector(el).shadowRoot, selector)
  return handle
}

ventriloquist.shadowRootHandle = async (selector, parent = false) => {
  const handle = await page.evaluateHandle((el, root) => root ? root.querySelector(el).shadowRoot : document.querySelector(el).shadowRoot, selector)
  return handle
}

ventriloquist.addMethod = (type) => {
  if (definedSetters.has(type)) {
    throw ventriloquistError(`${type} is already defined by default.`)
  }
  if (ventriloquist[type]) {
    throw ventriloquistError(`Methods can only be defined once. Try adding ${type} before scripts run.`)
  }

  definedSetters.add(type)

  const methodName = pascalCase(type)

  // getters
  let shadowGetter = `raw${methodName}`
  ventriloquist[shadowGetter] = async (selector) => {
    const handle = await page.evaluateHandle((el, prop) => document.querySelector(el).shadowRoot[prop], selector, camelCase(type))
    const result = await handle.jsonValue()
    await handle.dispose()
    return result
  }
  // getters
  ventriloquist[type] = async (elementHandle, selector = false) => {
    const handle = await page.evaluateHandle((el, prop, sel) => sel ? el.shadowRoot.querySelector(sel)[prop] : el.shadowRoot[prop], elementHandle, camelCase(type), selector)
    const result = await handle.jsonValue()
    await handle.dispose()
    return result
  }
  // setters for property in format of setType
  let setter = `set${methodName}`
  ventriloquist[setter] = async (elementHandle, testValue) => {
    const handle = await page.evaluateHandle((el, prop, update) => (el[prop] = update), elementHandle, camelCase(type), testValue)
    const result = await handle.jsonValue()
    await handle.dispose()
    return result
  }
  // setters for attribute
  /** all properties are given attribute setters to optionally test scenatio of failure */
  let attribSetter = `setAttribute${methodName}`
  ventriloquist[attribSetter] = async (elementHandle, testValue) => {
    const handle = await page.evaluateHandle((el, attributeName, update) => { el.setAttribute(attributeName, update) }, elementHandle, paramCase(type), testValue)
    const result = await handle.jsonValue()
    await handle.dispose()
    return result
  }
}

// document.activeElement.querySelector('custom-element').shadowRoot
// .querySelector('nested-custom-element').shadowRoot
// .querySelector('.class-name')
ventriloquist.activeElementHandle = async () => {
  const handle = await page.evaluateHandle(() => document.activeElement)
  return handle
}

ventriloquist.customEventHandle = async (elementHandle, eventName) => {
  const handle = await page.evaluateHandle((el, ev) => {
    window.captured = []
    el.addEventListener(ev, ({ type, detail, target }) => {
      window.captured.push({ type, detail, target })
    })
  }, elementHandle, eventName)
  return handle
}

ventriloquist.waitForCustomEvent = async (timeout = 20000, totalEvents = 1) => {
  await page.mainFrame().waitForFunction(`window.captured.length >= ${totalEvents}`, {
    timeout
  })
  return true
}

/** @todo - make timeout and capture length dynamic */
ventriloquist.customEventGetter = async () => {
  const aHandle = await page.evaluateHandle(() => window)
  const resultHandle = await page.evaluateHandle(w => w.captured, aHandle)
  const captured = await resultHandle.jsonValue()
  await resultHandle.dispose()
  await aHandle.dispose()
  if (captured.length && captured.length === 1) {
    return captured[0]
  } else {
    return captured
  }
}

for (let type of defaultSetters) {
  ventriloquist.addMethod(type)
}

export default ventriloquist
