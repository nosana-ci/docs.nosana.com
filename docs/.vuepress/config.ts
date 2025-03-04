import { defineUserConfig } from 'vuepress';
import vue from '@vitejs/plugin-vue';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import path from 'path';
import theme from './theme.js';
export default defineUserConfig({
  lang: 'en-US',
  title: 'Documentation',
  description: 'Powering the AI revolution',
  base: '/',
  theme,
  shouldPrefetch: false,
  plugins: [
    vue(),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, '../components'),
      components: {
        AsciinemaCast: path.resolve(__dirname, './components/AsciinemaCast.vue')
      }
    })
  ]
});
