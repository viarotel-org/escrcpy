import focus from './focus/index.js'
import menu from './menu/index.js'

function install(controlWindow) {
  focus(controlWindow)
  menu(controlWindow)
}

export {
  focus,
  install,
  menu,
}
