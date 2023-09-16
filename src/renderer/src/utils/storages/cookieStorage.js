import jsCookie from 'js-cookie'

/**
 *  操作 Cookie
 * @method set 设置
 * @method get 获取
 * @method remove 移除
 * @method clear 移除全部
 */
export default {
  // 设置
  set(key, val) {
    jsCookie.set(key, JSON.stringify(val))
  },
  // 获取
  get(key) {
    const json = jsCookie.get(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // 移除
  remove(key) {
    jsCookie.remove(key)
  },
}
