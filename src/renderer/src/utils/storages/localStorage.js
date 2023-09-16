/**
 * window.localStorage
 * @method set 设置
 * @method get 获取
 * @method remove 移除
 * @method clear 移除全部
 */
export default {
  // 设置
  set(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val))
  },
  // 获取
  get(key) {
    const json = window.localStorage.getItem(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // 移除
  remove(key) {
    window.localStorage.removeItem(key)
  },
  // 移除全部
  clear() {
    window.localStorage.clear()
  },
}
