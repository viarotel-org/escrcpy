import jsCookie from 'js-cookie'

/**
 *  Manage cookies
 * @method set Set
 * @method get Get
 * @method remove Remove
 * @method clear Clear all
 */
export default {
  // Set
  set(key, val) {
    jsCookie.set(key, JSON.stringify(val))
  },
  // Get
  get(key) {
    const json = jsCookie.get(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // Remove
  remove(key) {
    jsCookie.remove(key)
  },
}
