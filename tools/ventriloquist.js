/** ventriloquist */

// @todo - make a class
const version = 'v0.0.1'
const service = {}
const ventriloquistError = msg => new Error(`ventriloquist ${version} - ${msg}`)

const DocumentOrShadowRoot = ['activeElement', 'styleSheets']
// @todo - 'caretPositionFromPoint', 'elementFromPoint'
const defaults = ['textContent', 'innerHTML', ...DocumentOrShadowRoot]

// const shadowSelectorFn = (el, selector) => el.shadowRoot.querySelector(selector)

service.customElementHandle = async selector => {
  const handle = await page.evaluateHandle((el) => document.querySelector(el), selector)
  return handle
}

// service.queryDeep = async (page, ...selectors) => {
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
service.waitForHandle = async selector => {
  const handle = await page.evaluateHandle((el) => window.customElements.waitFor(el), selector)
  return handle
}

service.shadowHandle = async (selector, parent) => {
  const handle = await page.evaluateHandle((el) => document.querySelector(el).shadowRoot, selector)
  return handle
}

service.shadowRootHandle = async (selector, parent = false) => {
  const handle = await page.evaluateHandle((el, root) => root ? root.querySelector(el).shadowRoot : document.querySelector(el).shadowRoot, selector)
  return handle
}

service.addMethod = (type) => {
  if (service[type]) {
    console.warn(`Methods can only be defined once. Try adding ${type} before scripts run.`)
    // throw ventriloquistError(`Methods can only be defined once. Try adding ${type} before scripts run.`)
  }
  // getters
  let shadowGetter = `raw${type.charAt(0).toUpperCase()}${type.substr(1)}`
  service[shadowGetter] = async (selector) => {
    const handle = await page.evaluateHandle((el, prop) => document.querySelector(el).shadowRoot[prop], selector, type)
    return handle
  }
  // getters
  service[type] = async (elementHandle, selector = false) => {
    const handle = await page.evaluateHandle((el, prop, sel) => sel ? el.shadowRoot.querySelector(sel)[prop] : el.shadowRoot[prop], elementHandle, type, selector)
    return handle
  }
  // setters in format of setType
  let setter = `set${type.charAt(0).toUpperCase()}${type.substr(1)}`
  service[setter] = async (elementHandle, testValue) => {
    const handle = await page.evaluateHandle((el, prop, update) => { el[prop] = update; return true }, elementHandle, type, testValue)
    return handle
  }
}

// document.activeElement.querySelector('custom-element').shadowRoot
// .querySelector('nested-custom-element').shadowRoot
// .querySelector('.class-name')
service.activeElementHandle = async selector => {
  const handle = await page.evaluateHandle((el) => document.activeElement)
  return handle
}

for (let type of defaults) {
  service.addMethod(type)
}

export default service
