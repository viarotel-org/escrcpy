import MessageLoading from '$/plugins/element-plus/expands/EleMessageLoading/index.vue'

import { defineFunctionalComponent } from '$/utils/vue-functional/index.jsx'

export function useMessageLoading(message, { ...props } = {}) {
  const instance = defineFunctionalComponent(MessageLoading, {
    props,
  })

  const { ref } = instance

  ref.open(message)

  return {
    ...instance,
    update: ref.update,
  }
}

export default useMessageLoading
