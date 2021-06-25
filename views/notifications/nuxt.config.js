import webpack from 'webpack';
import fs from 'fs';
import path from 'path';

const packageFile = fs.readFileSync(path.resolve(__dirname, 'package.json'), { encoding: 'utf-8' });
const packageVersion = JSON.parse(packageFile).version;

const buildPlugins = [];
if(process.env.IS_VSCODE){
  buildPlugins.push(
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  )
}

export default {
  target: 'static',
  ssr: false,
  env: {
    IS_VSCODE: process.env.IS_VSCODE || false
  },
  head: {
    title: 'Notifications',
    htmlAttrs: {
      lang: 'en',
      ...(process.env === 'dev' && {oncontextmenu: 'return false'})
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      ...(!process.env.IS_VSCODE ? [{ 'http-equiv': 'cache-control', content: 'max-age=0'},
      { 'http-equiv': 'cache-control', content: 'no-cache'},
      { 'http-equiv': 'cache-control', content: '0'},
      { 'http-equiv': 'cache-control', content: 'Tue, 01 Jan 1980 1:00:00 GMT'},
      { 'http-equiv': 'cache-control', content: 'no-cache'}] : [])
    ],
    link: [],
    script: [],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/global.css',
    '~/assets/css/vscode-dark.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  components: true,

  generate: {
    fallback: '404.html'
  },

  buildModules: [
    ['@nuxtjs/eslint-module', { fix: true, quiet: true }],
    "@nuxtjs/svg"
  ],

  loading: {
    height: '0px'
  },

  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],

  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    ...(!process.env.IS_VSCODE && {
      extractCSS: true,
      optimization :{
        splitChunks: {
          chunks: 'all',
          automaticNameDelimiter: '.',
          name: 'test',
          maxSize : 51200
        }
      },
    }),
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
      
      if (ctx.isClient && process.env.IS_VSCODE) {
        config.output.filename = 'app.js',
        config.output.chunkFilename = '[id].js';
        config.optimization.splitChunks.cacheGroups.default = false;
        config.optimization.runtimeChunk = false;
      }else{
        config.output.chunkFilename = `[chunkhash].js?v=${packageVersion}`;
      }
          
      if(process.env.IS_VSCODE){
        const nuxtFontLoader = config.module.rules.find((rule) => String(rule.test) == String(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i));
        nuxtFontLoader.use = 'base64-inline-loader?limit=1000&name=[name].[ext]';

        const nuxtImageLoader = config.module.rules.find((rule) => String(rule.test) == String(/\.(png|jpe?g|gif|svg|webp|avif)$/i));
        nuxtImageLoader.use[0].options.limit = 2000000;
      }
    },

    plugins: buildPlugins
  },

  router: {
    mode: 'hash',
  },
}
