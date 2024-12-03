import { primaryColor } from '$renderer/configs/index.js'
import remote from '@electron/remote'
import { FindInPage } from 'electron-find-in-page'

const theme = {
  isDark: false,
}

let findInPage = null

async function open({ ...args } = {}) {
  await create(args)

  return findInPage.openFindWindow()
}

function close() {
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

  findInPage = new FindInPage(remote.getCurrentWebContents(), {
    ...args,
    preload: true,
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
