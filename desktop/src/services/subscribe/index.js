/**
 * Subscribe Client - Subscription service client
 */

class SubscribeClient {
  constructor() {
    this.baseUrl = import.meta.env.VITE_GITEE_BASE_API
    this.appId = import.meta.env.VITE_GITEE_APP_ID
    this.accessToken = ''
  }

  // ==================== HTTP Requests ====================

  /**
   * Sends an HTTP request using the fetch API
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

    // Build request headers
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    }

    // Add development mode header
    if (devMode) {
      requestHeaders['X-Dev-Mode'] = 'true'
    }

    // Update access token
    if (accessToken) {
      this.accessToken = accessToken
    }

    // Add authentication header
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

    // Attach request body (POST/PUT/PATCH only)
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
      // Network or parse error
      if (!error.status) {
        error.message = `Network error: ${error.message}`
      }
      throw error
    }
  }

  /**
   * Retrieves application information and billing plans
   * @param {boolean} devMode - Whether dev mode is enabled
   */
  async getAppInfo(devMode = false) {
    return this.request({
      method: 'GET',
      path: `/app?appid=${this.appId}`,
      devMode,
    })
  }

  // ==================== Verification Code ====================

  /**
   * Send verification code
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

  // ==================== User Authentication ====================

  /**
   * Obtain user access token
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
   * Retrieve user information
   * @param {string} accessToken - User access token
   */
  async getUserInfo(accessToken) {
    return this.request({
      method: 'GET',
      path: '/app/user',
      accessToken,
    })
  }

  // ==================== Payments ====================

  /**
   * Create a payment order
   * @param {object} data - { plan_ident, quantity?, amount?, type }
   * @param {string} accessToken - User access token
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
   * Retrieve payment details
   * @param {string} ident - Payment identifier
   * @param {string} accessToken - User access token
   */
  async getPayDetail(ident, accessToken) {
    return this.request({
      method: 'GET',
      path: `/app/pay?ident=${ident}`,
      accessToken,
    })
  }

  /**
   * Retrieve payment records list
   * @param {object} params - { page?, size?, status? }
   * @param {string} accessToken - User access token
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

  // ==================== Feedback ====================

  /**
   * Submit feedback (using multipart/form-data)
   * @param {object} data - { type, description, attachment?, contact_type?, contact? }
   * @param {string} accessToken - User access token
   */
  async submitFeedback(data, accessToken) {
    const { type, description, attachments, contact_type, contact } = data

    const url = `${this.baseUrl}/app/feedback`

    // Build FormData
    const formData = new FormData()

    formData.append('type', type)
    formData.append('description', description)

    if (attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append('attachments', file)
      })
    }

    // Append contact type
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
