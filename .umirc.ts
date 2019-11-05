import { IConfig } from 'umi-types';
import { resolve } from "path";
import pxToViewPort from 'postcss-px-to-viewport';
import ThemeConfig from './src/themes/theme'


// ref: https://umijs.org/config/
const config: IConfig =  {
  publicPath: '/dist/',
  outputPath: './dist',
  targets: {
    android: 5,
    chrome: 58,
    edge: 13,
    firefox: 45,
    ie: 9,
    ios: 7,
    safari: 10,
  },
  history: 'hash',
  hash: true,
  ignoreMomentLocale: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        hmr: true,
      },
      dynamicImport: {
        loadingComponent: './components/Loader/Loader',
        webpackChunkName: true,
      },
      title: ' ',
      hd: true,
      fastClick: true,
      dll: true,
      scripts: [
        // {
        //   src: 'https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js',
        // },
        // {
        //   content: `var vConsole = new VConsole();`,
        // },
        // { src: 'https://cdn.jsdelivr.net/npm/eruda@1.5.4/eruda.min.js' },
        // { content: `eruda.init();` },
      ],
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
          /turntable\//,
        ],
      },
    }],
  ],
  theme: ThemeConfig,
  alias: {
    assets: resolve(__dirname, './src/assets/'),
    components: resolve(__dirname, './src/components'),
    api: resolve(__dirname, './src/services'),
    utils: resolve(__dirname, './src/utils/'),
    themes: resolve(__dirname, './src/themes'),
  },
  // lessLoaderOptions: {
  //   javascriptEnabled: true,
  // },
  disableRedirectHoist: true,
  extraPostCSSPlugins: [
    pxToViewPort({
      viewportWidth: 375,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
    }),
  ],
  proxy: {
    '/wx': {
      target: 'http://ydhtest.fetower.com',
      changeOrigin: true,
      pathRewrite: {
        '^/wx': '/',
      },
    },
  },
}

export default config;
