import appEvents from './app/index.js'
import handles from './handles/index.js'
import shortcuts from './shortcuts/index.js'
import theme from './theme/index.js'
import tray from './tray/index.js'
import updater from './updater/index.js'
import launch from './launch/index.js'
import window from './window/index.js'

export default () => {
  appEvents()
  handles()
  updater()
  tray()
  theme()
  shortcuts()
  launch()
  window()
}
