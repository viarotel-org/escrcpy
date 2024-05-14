import remote from '@electron/remote'
import { FindInPage } from 'electron-find-in-page'
import { primaryColor } from '#renderer/configs/index.js'

export default () => {
  const theme = {
    isDark: false,
  }

  let findInPage = create()

  async function open({ isDark = false } = {}) {
    if (theme.isDark !== isDark) {
      theme.isDark = isDark
      await update()
    }

    return findInPage.openFindWindow()
  }

  function close() {
    return findInPage.closeFindWindow()
  }

  async function update() {
    try {
      await findInPage.destroy()
    }
    catch (error) {
      console.warn('error', error.message)
    }

    findInPage = create()
  }

  function create() {
    return new FindInPage(remote.getCurrentWebContents(), {
      preload: true,
      inputFocusColor: primaryColor,
      ...(theme.isDark
        ? {
            boxShadowColor: '#4C4D4F',
            boxBgColor: '#262727',
            inputColor: '#CFD3DC',
            inputBgColor: '#141414',
            textColor: '#CFD3DC',
            textHoverBgColor: '#4C4D4F',
          }
        : {}),
    })
  }

  return {
    open,
    close,
  }
}
