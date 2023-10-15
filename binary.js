export default function CustomPlugin() {
  return {
    name: 'vite-plugin-path',
    transform(src, id) {
      if (id.endsWith('?path')) {
        return `export default ${JSON.stringify(id.slice(0, -5))}`
      }
    },
  }
}
