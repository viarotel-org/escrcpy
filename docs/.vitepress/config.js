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
  server: {
    port: 1127,
  },
  resolve: {
    alias: {
      $root: resolve(),
      $docs: resolve('docs'),
    },
  },
}

const vueConfig = {
  template: {
    compilerOptions: {
      isCustomElement: tag => ['amp-ad', 'ins'].includes(tag),
    },
  },
}

const vitePressConfig = {
  title: appName,
  description: appDescription,
  head: [
    ['link', { rel: 'icon', href: '/images/logo.ico' }],
    // AdSense
    [
      'script',
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5328953201873088',
        async: '',
        crossorigin: 'anonymous',
      },
    ],
    // 百度统计工具
    [
      'script',
      {
        src: 'https://hm.baidu.com/hm.js?4984552ac1c9b6041c7f9edffff4089f',
        async: '',
      },
    ],
    // 不蒜子统计工具
    [
      'script',
      {
        src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
        async: '',
      },
    ],
  ],

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
        <span id="busuanzi_container_site_pv"> Views <span id="busuanzi_value_site_pv"></span>, </span>
        <span id="busuanzi_container_site_uv"> Visitors <span id="busuanzi_value_site_uv"></span> </span>
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
    hostname: 'https://viarotel.eu.org',
  },

  vite: viteConfig,

  vue: vueConfig,
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
        { text: 'Donate', link: '/donate' },
        { text: 'Contact', link: '/contact' },
        { text: 'Blog', link: 'https://viarotel.eu.org/en' },
      ],
    },
    zhHans: {
      nav: [
        { text: '指引', link: '/zhHans/guide' },
        { text: '参考', link: '/zhHans/reference' },
        { text: '帮助', link: '/zhHans/help' },
        { text: '变更日志', link: '/zhHans/changelog' },
        { text: '捐赠', link: '/zhHans/donate' },
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
    manualSortFileNameByPriority: ['index.md', 'guide', 'reference', 'help', 'changelog.md', 'donate.md', 'contact.md', 'started.md', 'milestones.md'],
  })),
]

// https://vitepress.dev/reference/site-config
export default defineConfig(
  // @ts-ignore
  withSidebar(withI18n(vitePressConfig, vitePressI18nConfig), vitePressSidebarConfig),
)
