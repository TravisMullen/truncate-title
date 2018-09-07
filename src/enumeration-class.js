/**
 * Quick Enumeration
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
  has (key) {
    return this.hasOwnProperty(key)
  }
}

export default Enumeration
