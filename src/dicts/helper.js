import * as dicts from '$/dicts/index.js'

export function getDictLabel(dict, value) {
  let label = ''

  if (typeof dict === 'function') {
    label = dict(value)
  }
  else if (typeof dict === 'string') {
    label = dicts?.[dict]?.find(item => item.value == value)?.label
  }
  else {
    label = dict?.find(item => item.value == value)?.label
  }

  if (!label) {
    return ''
  }

  return label
}
