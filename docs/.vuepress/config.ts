import { defineUserConfig } from 'vuepress';
import vue from '@vitejs/plugin-vue';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import path from 'path';
import theme from './theme';
export default defineUserConfig({
  lang: 'en-US',
  title: 'Documentation',
  description: 'Powering the AI revolution',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/assets/icon/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#10E80C' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Nosana Docs' }],
  ],
  base: '/',
  theme,
  shouldPrefetch: false,
  plugins: [
    vue(),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, '../components'),
      components: {
        AsciinemaCast: path.resolve(__dirname, './components/AsciinemaCast.vue'),
      },
    }),
  ],
});
