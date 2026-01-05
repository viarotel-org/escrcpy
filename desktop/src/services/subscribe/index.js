/**
 * Subscribe Client - 订阅服务客户端
 */

class SubscribeClient {
  constructor() {
    this.baseUrl = import.meta.env.VITE_GITEE_BASE_API
    this.appId = import.meta.env.VITE_GITEE_APP_ID
    this.accessToken = ''
  }

  // ==================== HTTP 请求 ====================

  /**
   * 发送 HTTP 请求（使用 fetch API）
   */
  async request(options) {
    const {
      method = 'GET',
      path,
      data,
      headers = {},
      useAppToken = false,
      accessToken = null,
      devMode = false,
    } = options

    const url = `${this.baseUrl}${path}`

    // 构建请求头
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    }

    // 添加开发模式头
    if (devMode) {
      requestHeaders['X-Dev-Mode'] = 'true'
    }

    // 更新访问令牌
    if (accessToken) {
      this.accessToken = accessToken
    }

    // 添加鉴权头
    if (useAppToken) {
      const temporaryToken = await window.electron.ipcRenderer.invoke('get-gitee-temporary-token')
      requestHeaders.Authorization = `Bearer ${temporaryToken}`
    }
    else if (this.accessToken) {
      requestHeaders.Authorization = `Bearer ${this.accessToken}`
    }

    const fetchOptions = {
      method,
      headers: requestHeaders,
    }

    // 添加请求体（仅 POST/PUT/PATCH）
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchOptions.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, fetchOptions)
      const result = await response.json()

      if (response.ok) {
        return result
      }
      else {
        const error = new Error(result?.message || `HTTP ${response.status}`)
        error.status = response.status
        error.data = result
        throw error
      }
    }
    catch (error) {
      // 网络错误或解析错误
      if (!error.status) {
        error.message = `Network error: ${error.message}`
      }
      throw error
    }
  }

  /**
   * 获取应用信息及计费计划
   * @param {boolean} devMode - 是否开发模式
   */
  async getAppInfo(devMode = false) {
    return this.request({
      method: 'GET',
      path: `/app?appid=${this.appId}`,
      devMode,
    })
  }

  // ==================== 验证码 ====================

  /**
   * 发送验证码
   * @param {object} data - { mobile?, email?, channel_type? }
   */
  async sendVerifyCode(data) {
    const { mobile, email, channel_type = 'sms' } = data
    return this.request({
      method: 'POST',
      path: '/app/auth/vcode',
      data: {
        appid: this.appId,
        mobile,
        email,
        channel_type,
      },
      useAppToken: true,
    })
  }

  // ==================== 用户认证 ====================

  /**
   * 获取用户访问令牌
   * @param {object} data - { mobile?, email?, code, channel_type? }
   */
  async getUserToken(data) {
    const { mobile, email, code, channel_type = 'sms' } = data
    return this.request({
      method: 'POST',
      path: '/app/auth/token',
      data: {
        appid: this.appId,
        mobile,
        email,
        code,
        channel_type,
      },
      useAppToken: true,
    })
  }

  /**
   * 获取用户信息
   * @param {string} accessToken - 用户访问令牌
   */
  async getUserInfo(accessToken) {
    return this.request({
      method: 'GET',
      path: '/app/user',
      accessToken,
    })
  }

  // ==================== 支付 ====================

  /**
   * 创建支付订单
   * @param {object} data - { plan_ident, quantity?, amount?, type }
   * @param {string} accessToken - 用户访问令牌
   */
  async createPayOrder(data, accessToken, devMode = false) {
    const { plan_ident, quantity, amount, type } = data
    return this.request({
      method: 'POST',
      path: '/app/pay',
      data: {
        plan_ident,
        quantity,
        amount,
        type,
      },
      accessToken,
      devMode,
    })
  }

  /**
   * 获取支付详情
   * @param {string} ident - 支付订单号
   * @param {string} accessToken - 用户访问令牌
   */
  async getPayDetail(ident, accessToken) {
    return this.request({
      method: 'GET',
      path: `/app/pay?ident=${ident}`,
      accessToken,
    })
  }

  /**
   * 获取支付记录列表
   * @param {object} params - { page?, size?, status? }
   * @param {string} accessToken - 用户访问令牌
   */
  async getPayList(params, accessToken) {
    const { page = 1, size = 10, status } = params
    let path = `/app/pays?page=${page}&size=${size}`
    if (status) {
      path += `&status=${status}`
    }
    return this.request({
      method: 'GET',
      path,
      accessToken,
    })
  }

  // ==================== 反馈 ====================

  /**
   * 提交反馈（使用 multipart/form-data）
   * @param {object} data - { type, description, attachment?, contact_type?, contact? }
   * @param {string} accessToken - 用户访问令牌
   */
  async submitFeedback(data, accessToken) {
    const { type, description, attachments, contact_type, contact } = data

    const url = `${this.baseUrl}/app/feedback`

    // 构建 FormData
    const formData = new FormData()

    formData.append('type', type)
    formData.append('description', description)

    if (attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append('attachments', file)
      })
    }

    // 添加联系方式
    if (contact_type) {
      formData.append('contact_type', contact_type)
    }

    if (contact) {
      formData.append('contact', contact)
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        return result
      }
      else {
        const error = new Error(result?.message || `HTTP ${response.status}`)
        error.status = response.status
        error.data = result
        throw error
      }
    }
    catch (error) {
      if (!error.status) {
        error.message = `Network error: ${error.message}`
      }
      throw error
    }
  }
}

export default new SubscribeClient()
