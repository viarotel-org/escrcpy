/**
 * Define a functional component that can be dynamically mounted and unmounted.
 *
 * @param {Vue.Component} RawComponent - The raw component to wrap.
 * @param {Object} [options] - Options object.
 * @param {function(ref: any): void} [options.open] - Function to open the component.
 * @param {function(ref: any): void} [options.close] - Function to close the component.
 * @param {string} [options.closedEmitKey] - Event key that triggers 'onClosed' when the component closes.
 * @param {Object} [options.props] - Additional props to pass to the raw component.
 * @param {...any} [options.args] - Extra arguments passed to the 'open' function.
 * @returns {{ ref: any, close: function(): void }} - Object containing the component instance and close function.
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
