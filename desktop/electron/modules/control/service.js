export default {
  name: 'module:control:service',
  apply(app) {
    const manager = app.getWindowManager('control')
    if (!manager) {
      return
    }

    return () => {
    }
  },

}
