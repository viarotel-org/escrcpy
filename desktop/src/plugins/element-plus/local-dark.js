function elementPlusLocalDark(selector = '.dark') {
  return {
    name: 'element-plus-local-dark',
    enforce: 'post',
    transform(code, id) {
      if (id.includes('element-plus/theme-chalk/dark/css-vars.css')) {
        return code.replaceAll('html.dark', `html.dark, ${selector}`)
      }
    },
  }
}

export default elementPlusLocalDark
