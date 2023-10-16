/**
 * window.sessionStorage
 * @method set 设置
 * @method get 获取
 * @method remove 移除
 * @method clear 移除全部
 */
export default {
  // 设置
  set(key, val) {
    window.sessionStorage.setItem(key, JSON.stringify(val))
  },
  // 获取
  get(key) {
    const json = window.sessionStorage.getItem(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // 移除
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  // 移除全部
  clear() {
    window.sessionStorage.clear()
  },
}
