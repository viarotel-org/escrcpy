export default function (controlWindow) {
  controlWindow.on('focus', () => {
    controlWindow.webContents.send('window-focus', true)
  })

  controlWindow.on('blur', () => {
    controlWindow.webContents.send('window-focus', false)
  })
}
