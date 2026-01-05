/**
 * 定义一个可动态挂载和卸载的功能组件。
 *
 * @param {Vue.Component} RawComponent - 要包装的原始组件。
 * @param {Object} [options] - 选项对象。
 * @param {function(ref: any): void} [options.open] - 打开组件的函数。
 * @param {function(ref: any): void} [options.close] - 关闭组件的函数。
 * @param {string} [options.closedEmitKey] - 关闭组件时触发 'onClosed' 事件的键。
 * @param {Object} [options.props] - 传递给原始组件的其他属性。
 * @param {...any} [options.args] - 传递给 'open' 函数的其他参数。
 * @returns {{ ref: any, close: function(): void }} - 包含组件实例和关闭函数的对象。
 */
export function defineFunctionalComponent(
  RawComponent,
  {
    open = ref => ref.open,
    close = ref => ref.close,
    closedEmitKey = 'onClosed',
    props = {},
    ...args
  } = {},
) {
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)

  let root = null

  const rawComponentProps = {
    teleport: mountNode,
    [closedEmitKey]: () => {
      root.unmount()
      document.body.removeChild(mountNode)
    },
    ...props,
  }

  root = createApp(<RawComponent {...rawComponentProps} />)

  const instance = root.mount(mountNode)

  const withOpen = open(instance)
  const withClose = close(instance)

  withOpen({ ...args })

  return {
    ref: instance,
    close: withClose,
  }
}

export default defineFunctionalComponent
