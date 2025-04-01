import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'
import { withI18n } from 'vitepress-i18n'

export const appName = 'Escrcpy'
export const appDescription = 'Control your Android device with graphical scrcpy.'

export const defaultLocale = 'en'
export const locales = [defaultLocale, 'zhHans']

export function useImgTag(src) {
  return `<img src="${src}" style="width: 20px; height: 20px;" class="hover:opacity-100 opacity-70 duration-500" />`
}

const viteConfig = {
  resolve: {
    alias: {
      $root: resolve(),
      $docs: resolve('docs'),
    },
  },
}

const vitePressConfig = {
  title: appName,
  description: appDescription,
  head: [
    ['link', { rel: 'icon', href: '/images/logo.ico' }],
    // 不蒜子统计工具
    [
      'script',
      {
        src: 'https://busuanzi.9420.ltd/js',
      },
    ],
  ],

  base: '/base/',
  outDir: '../dist-docs',

  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    logo: { src: '/images/logo.ico', alt: appName },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/viarotel/viarotel.github.io',
      },
      {
        icon: {
          svg: useImgTag('https://gitee.com/favicon.ico'),
        },
        link: 'https://gitee.com/viarotel',
      },
      {
        icon: {
          svg: useImgTag('/images/logo-gitcode.png'),
        },
        link: 'https://gitcode.com/viarotel-org',
      },
      {
        icon: {
          svg: useImgTag(
            'https://static.hdslb.com/images/favicon.ico',
          ),
        },
        link: 'https://space.bilibili.com/274990176',
      },
      {
        icon: {
          svg: useImgTag(
            'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png',
          ),
        },
        link: 'https://juejin.cn/user/1275089219751944',
      },
    ],
    footer: {
      message: `
        Views <span id="busuanzi_site_pv"></span>
        ,
        Visitors <span id="busuanzi_site_uv"></span>
        <br />
        Released under the MIT License. 
      `,
      copyright: `Copyright © 2025-${new Date().getFullYear()} viarotel`,
    },
  },

  rewrites: {
    'en/:rest*': ':rest*',
  },

  sitemap: {
    hostname: 'https://escrcpy.viarotel.eu.org',
  },

  vite: viteConfig,
}

const vitePressI18nConfig = {
  locales,
  rootLocale: defaultLocale,
  searchProvider: 'local',
  description: {
    en: 'Control your Android device with graphical scrcpy.',
    zhHans: '使用图形化的 scrcpy 控制你的安卓设备。',
  },
  themeConfig: {
    en: {
      nav: [
        { text: 'Guide', link: '/guide' },
        { text: 'Reference', link: '/reference' },
        { text: 'Help', link: '/help' },
        { text: 'Changelog', link: '/changelog' },
        { text: 'Contact', link: '/contact' },
        { text: 'Blog', link: 'https://viarotel.eu.org/' },
      ],
    },
    zhHans: {
      nav: [
        { text: '指引', link: '/zhHans/guide' },
        { text: '参考', link: '/zhHans/reference' },
        { text: '帮助', link: '/zhHans/help' },
        { text: '变更日志', link: '/zhHans/changelog' },
        { text: '联系', link: '/zhHans/contact' },
        { text: '博客', link: 'https://viarotel.eu.org/' },
      ],
    },
  },
}

const vitePressSidebarConfig = [
  ...locales.map(lang => ({
    ...(defaultLocale === lang
      ? { basePath: '/', resolvePath: '/' }
      : { basePath: `/${lang}/`, resolvePath: `/${lang}/` }),
    documentRootPath: `/docs/${lang}`,
    collapsed: false,
    useTitleFromFrontmatter: true,
    capitalizeFirst: true,
    useFolderLinkFromIndexFile: true,
    includeFolderIndexFile: false,
    useFolderTitleFromIndexFile: true,
    manualSortFileNameByPriority: ['index.md', 'guide', 'reference', 'help', 'changelog.md', 'contact.md', 'started.md', 'milestones.md'],
  })),
]

// https://vitepress.dev/reference/site-config
export default defineConfig(
  // @ts-ignore
  withSidebar(withI18n(vitePressConfig, vitePressI18nConfig), vitePressSidebarConfig),
)
