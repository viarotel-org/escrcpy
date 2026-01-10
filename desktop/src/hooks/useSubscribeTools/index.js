import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone'
import { ApiModelEnum } from '$copilot/dicts/api.js'

export function useSubscribePrice(options) {
  const { billing_type, price, discounts, quantity, amount } = options || {}

  const finalPrice = computed(() => {
    let value = price.value || 0

    if (discounts.value?.length) {
      const amountDiscount = discounts.value.find(d => d.type === 'AMOUNT')

      if (amountDiscount) {
        value = Math.max(0, value - amountDiscount.value)
      }
    }

    return value.toFixed(2)
  })

  const totalPrice = computed(() => {
    let value = 0

    if (['SUBSCRIPTION'].includes(billing_type.value)) {
      value = Number.parseFloat(finalPrice.value) * quantity.value
    }
    else {
      value = amount.value
    }

    return value.toFixed(2)
  })

  const originalTotalPrice = computed(() => {
    let value = 0

    if (['SUBSCRIPTION'].includes(billing_type.value)) {
      value = Number.parseFloat(price.value) * quantity.value
    }
    else {
      value = amount.value
    }

    return value.toFixed(2)
  })

  return {
    finalPrice,
    originalTotalPrice,
    totalPrice,
  }
}

export function useSubscribeValidator(options) {
  const { input } = options || {}

  const isEmailOrPhoneNumber = computed(() => isEmail(input.value) || isMobilePhone(input.value))

  const channelType = computed(() => {
    if (isEmail(input.value)) {
      return 'email'
    }
    else if (isMobilePhone(input.value)) {
      return 'sms'
    }
    else {
      return null
    }
  })

  const contactType = computed(() => {
    if (isEmail(input.value)) {
      return 'email'
    }
    else if (isMobilePhone(input.value)) {
      return 'phone'
    }
    else {
      return null
    }
  })

  return {
    isEmailOrPhoneNumber,
    channelType,
    contactType,
  }
}

export function useSubscribeConfigure() {
  const subscribeStore = useSubscribeStore()

  function update() {
    const copilotConfig = window.appStore.get('copilot') || {}

    window.appStore.set('copilot', {
      ...copilotConfig,
      apiKey: subscribeStore.accessToken,
      provider: 'Gitee',
      baseUrl: ApiModelEnum.Gitee,
      model: ApiModelEnum.named.Gitee.label,
    })
  }

  return reactive({
    update,
  })
}
