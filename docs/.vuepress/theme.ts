import { hopeTheme } from 'vuepress-theme-hope';
import { default as pages } from './pages';
import * as path from 'path';

export default () => ({
  name: 'vuepress-theme-local',

  extends: hopeTheme(
    {
      hostname: 'https://docs.nosana.com',
      logo: 'assets/logo.svg',
      repo: 'https://github.com/nosana-ci/docs.nosana.io',
      docsDir: 'docs',
      iconAssets: 'fontawesome',
      editLink: false,
      prevLink: false,
      darkmode: 'disable',

      // footer
      footer: 'MIT Licensed | Copyright © 2021-present Nosana',
      copyright: false,
      displayFooter: true,
      contributors: false,

      // navigation
      sidebar: pages,
      navbar: [
        ...pages,
        {
          text: 'Site',
          // icon: 'link',
          icon: 'globe',
          link: 'https://nosana.com/',
        },
        {
          text: 'Staking',
          icon: 'coins',
          // icon: 'network-wired',
          link: 'https://explorer.nosana.io/stake',
        },
        {
          text: 'Explorer',
          icon: 'gauge',
          // icon: 'network-wired',
          link: 'https://explorer.nosana.io/',
        },
      ],
      navbarLayout: {
        start: ['Brand'],
        center: ['Links'],
        end: ['Repo', 'Search'],
      },

      pageInfo: ['Category', 'Tag', 'ReadingTime'],

      plugins: {
        copyright: true,

        // Disable features you don't want here
        mdEnhance: {
          alert: true,
          align: true,
          attrs: true,
          chart: true,
          codetabs: true,
          component: true,
          demo: true,
          echarts: true,
          figure: true,
          flowchart: true,
          gfm: true,
          imgLazyload: true,
          imgMark: true,
          imgSize: true,
          include: {
            deep: true,
            resolvePath: (file) => {
              if (file.startsWith('@components/'))
                return file.replace('@components', path.resolve(__dirname, '../../../components/src'));

              if (file.startsWith('@echarts/'))
                return file.replace('@echarts', path.resolve(__dirname, '../../../md-enhance/src/echarts'));

              if (file.startsWith('@md-enhance/'))
                return file.replace('@md-enhance', path.resolve(__dirname, '../../../md-enhance/src'));

              if (file.startsWith('@pwa/')) return file.replace('@pwa', path.resolve(__dirname, '../../../pwa2/src'));

              return file;
            },
          },
          kotlinPlayground: true,
          mathjax: true,
          mark: true,
          markmap: false,
          mermaid: true,
          playground: {
            presets: ['ts', 'vue', 'unocss'],
          },
          revealJs: {
            plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
            themes: [
              'auto',
              'beige',
              'black',
              'blood',
              'league',
              'moon',
              'night',
              'serif',
              'simple',
              'sky',
              'solarized',
              'white',
            ],
          },
          sandpack: true,
          stylize: [
            {
              matcher: 'Recommended',
              replacer: ({ tag }) => {
                if (tag === 'em')
                  return {
                    tag: 'Badge',
                    attrs: { type: 'tip' },
                    content: 'Recommended',
                  };
              },
            },
          ],
          sub: true,
          sup: true,
          tabs: true,
          vPre: true,
          vuePlayground: true,
        },

        docsearch: {
          appId: 'O80DOX8SB5',
          apiKey: '3419239266c440c627d6bdd2f1cb82ea',
          indexName: 'nosana',
        },
      },
    },
    { custom: true },
  ),
  alias: {
    '@theme-hope/modules/navbar/components/Navbar': path.resolve(__dirname, './components/Navbar.vue'),
    '@theme-hope/modules/sidebar/components/Sidebar': path.resolve(__dirname, './components/Sidebar.vue'),
    '@theme-hope/components/NormalPage': path.resolve(__dirname, './components/NormalPage.vue'),
    // '@theme-hope/components/PageFooter': path.resolve(__dirname, './components/Footer.vue'),
  },
});
