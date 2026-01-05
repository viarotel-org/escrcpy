import * as dicts from '$/dicts/index.js'

export function getDictLabel(dict, value, options = {}) {
  const { labelKey = 'label' } = options

  let label = ''

  if (typeof dict === 'function') {
    label = dict(value, options)
  }
  else if (typeof dict === 'string') {
    label = dicts?.[dict]?.find(item => item.value == value)?.[labelKey]
  }
  else {
    label = dict?.find(item => item.value == value)?.[labelKey]
  }

  if (!label) {
    return ''
  }

  return label
}
