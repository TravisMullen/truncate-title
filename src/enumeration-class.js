/**
 * Enumeration - Immuatble key value pairs.
 *
 * @note Can be used with just keys and null values. Key will be substituded for value.
 * @link https://bitbucket.org/snippets/travismullen/6egzxX/enumeration.git
 * @class
 * @param {object} types - keys will serve as valid types. values will be results of test
 */
export class Enumeration {
  constructor (obj) {
    for (const key in obj) {
      this[key] = obj[key] || key
    }
    return Object.freeze(this)
  }
  /**
   * Is a valid key/value of instance.
   *
   * @param {string} key
   * @returns {boolean}
   */
  has (key) {
    return this.hasOwnProperty(key)
  }
}

export default Enumeration
