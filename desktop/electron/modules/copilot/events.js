export default {
  name: 'module:copilot:events',
  apply(app) {
    const manager = app.getWindowManager('copilot')

    if (!manager) {
      return false
    }
  },
}
