export default {
  name: 'module:explorer:events',
  apply(app) {
    const manager = app.getWindowManager('explorer')

    if (!manager) {
      return false
    }
  },
}
