import webpack from 'webpack';
import WebpackObfuscator from 'webpack-obfuscator';
import MonacoEditorPlugin from 'monaco-editor-webpack-plugin';

const buildPlugins = [
  new MonacoEditorPlugin({
    languages: ['java'],
    features: ['!gotoSymbol'],
  }),
]

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
    WEBHOOKS_SERVER: process.env.WEBHOOKS_SERVER || 'http://localhost:9090',
    KEYGEN_ACCOUNT_ID: process.env.KEYGEN_ACCOUNT_ID || '78edb4be-f034-4809-9ea9-b29b0dff113e',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51HJP5dGES2qDPBojjEaDhVwhbPgJ1W3lN5H24uMvlUqPgA9KxEJGdTyA2DIzi8lywEjsSLOW4rOLINW4oHwXfquo00Syg6gw0d',
    STRIPE_PRODUCT_KEY: process.env.STRIPE_PRODUCT_KEY || 'prod_IlXQl78y4QXvKS',
    SALESFORCE_API_VERSION: process.env.SALESFORCE_API_VERSION || 'v50.0',
    SALESFORCE_SERVER: process.env.SALESFORCE_SERVER || 'http://127.0.0.1:5000',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Salesforce Query Editor',
    htmlAttrs: {
      lang: 'en',
      ...(process.env === 'dev' && {oncontextmenu: 'return false'})
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [],
    script: [
      {
        src: 'https://js.stripe.com/v3/',
        crossorigin: 'anonymous',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/global.css',
    '~/assets/css/vscode-dark.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/vuelidate.js' , ssr: false },
    { src: '~plugins/confirm-dialog.js' , ssr: false },
    { src: '~plugins/vue-multiselect.js' , ssr: false },
    { src: '~plugins/vue-clipboard2.js' , ssr: false },
    { src: '~plugins/vue-drag-drop.js' , ssr: false },
    { src: '~plugins/vue-json-viewer.js' , ssr: false },
    { src: '~plugins/vue-shortkey.js' , ssr: false },
    { src: '~plugins/vue-inline-svg.js' , ssr: false },
    { src: '~plugins/fontawesome.js', ssr: false },
    { src: '~plugins/vue-socket.io.js', ssr: false },
    { src: '~plugins/vue-infinite-loading.js', ssr: false },
    { src: '~plugins/vue-columns-resizable.js', ssr: false},
    ...(!process.env.IS_VSCODE ? [{ src: '~plugins/vue-gtag.js', ssr: false}] : [])
  ],

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
    '@nuxtjs/axios',
    ...(!process.env.IS_VSCODE ? ['@nuxtjs/pwa'] : []),
  ],

  axios: {},

  ...(!process.env.IS_VSCODE ? {
    pwa: {
      manifest: {
        short_name: 'SOQL',
        name: 'Salesforce Query Editor',
        description:
          'This Web App helps Salesforce Developers to write queries and work with data.',
        start_url: '/',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone'
      },
      icons: {
        purpose: ['maskable', 'any']
      }
    },
  } : {}),
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
      }

      if (!ctx.isDev && ctx.isClient && config.plugins) {
        config.plugins.push(
          new WebpackObfuscator({
            compact: true,
            identifierNamesGenerator: 'mangled',
            selfDefending: true,
            stringArray: true,
            rotateStringArray: true,
            shuffleStringArray: true,
            stringArrayThreshold: 0.8
          }, [])
        );
      }
      
      const nuxtFontLoaderIndex = config.module.rules.findIndex((rule) => String(rule.test) == String(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i));

      const newFontLoader = {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
      }

      config.module.rules.splice(nuxtFontLoaderIndex, 1, newFontLoader);
    },

    plugins: buildPlugins
  },

  router: {
    mode: 'hash',
  },
}
