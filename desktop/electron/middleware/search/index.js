import { primaryColor } from '$renderer/configs/index.js'
import remote from '@electron/remote'

const theme = {
  isDark: false,
}

let findInPage = null

async function open({ ...args } = {}) {
  await create(args)

  return findInPage.openFindWindow()
}

async function close() {
  remote.getCurrentWebContents().stopFindInPage('clearSelection')

  if (!findInPage) {
    return false
  }

  return findInPage.closeFindWindow()
}

async function update({ isDark = false, ...args } = {}) {
  if (isDark === theme.isDark) {
    return findInPage
  }

  try {
    await findInPage.destroy()
  }
  catch (error) {
    console.warn('error', error.message)
  }

  findInPage = null

  return create({ ...args, isDark })
}

async function create({ ...args } = {}) {
  if (findInPage) {
    return update(args)
  }

  theme.isDark = args.isDark

  const { FindInPage } = (await import('electron-find-in-page'))

  findInPage = new FindInPage(remote.getCurrentWebContents(), {
    ...args,
    preload: true,
    offsetTop: 32,
    inputFocusColor: primaryColor,
    ...(theme.isDark
      ? {
          boxShadowColor: '#4C4D4F',
          boxBgColor: '#262626',
          inputColor: '#CFD3DC',
          inputBgColor: '#141414',
          textColor: '#CFD3DC',
          textHoverBgColor: '#4C4D4F',
        }
      : {}),
  })

  return findInPage
}

export default {
  open,
  close,
}
