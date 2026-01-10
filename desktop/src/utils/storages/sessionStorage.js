/**
 * window.sessionStorage
 * @method set Set
 * @method get Get
 * @method remove Remove
 * @method clear Clear all
 */
export default {
  // Set
  set(key, val) {
    window.sessionStorage.setItem(key, JSON.stringify(val))
  },
  // Get
  get(key) {
    const json = window.sessionStorage.getItem(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // Remove
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  // Clear all
  clear() {
    window.sessionStorage.clear()
  },
}
