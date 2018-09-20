const pendingKeys = []
const savedValues = {}

export const inMemory = () => Object.keys(savedValues)
export const pending = () => pendingKeys.slice(0)

/**
 * Add new value to `global` space.
 * Save old value, if one exists.
 *
 * @param {string} keyname to add to `global`
 * @param {any} value to save in keyname on `global`
 * @return {Promise} - Resolves to keyname if one was preexisting in 'globals`.
 * @todo set custom namespace, and fallback to window if global is not defined
 */
export const swap = async (key, value) => {
  return new Promise((resolve, reject) => {
    if (typeof (key) === 'string' && typeof (value) !== 'undefined') {
      if (global[key]) {
        savedValues[key] = global[key]
      }
      pendingKeys.push(key)
      global[key] = value
    }
    resolve(savedValues[key])
  })
}

/**
 * Restore saved globals back to previous state.
 *
 * @return {Promise} - Resolves to Array of restored keynames
 */
export const restore = async () => {
  return new Promise(resolve => {
    let confirmRestored = []
    for (let item of pendingKeys) {
      if (typeof (item) === 'string') {
        // restore previous
        if (savedValues[item]) {
          global[item] = savedValues[item]
        // clean up
        } else {
          global[item] = undefined
        }
        confirmRestored.push(item)
      }
    }
    // remove from pending
    for (let item in confirmRestored) {
      pendingKeys.splice(pendingKeys.findIndex(pending => (
        pending === item
      )), 1)
      if (savedValues[item]) {
        delete savedValues[item]
      }
    }
    resolve(confirmRestored)
  })
}
