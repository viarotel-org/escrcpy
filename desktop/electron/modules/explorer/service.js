export default {
  name: 'module:explorer:service',
  apply(app) {
    const manager = app.getWindowManager('explorer')
    if (!manager) {
      return
    }

    return () => {
    }
  },
}
