import webpack from 'webpack';

export default {
  target: 'static',
  ssr: false,
  env: {
    WEBHOOKS_SERVER: process.env.WEBHOOKS_SERVER || 'https://ed3m5t2ji5.execute-api.eu-west-1.amazonaws.com/Prod',
    IP_STACK_ACCESS_KEY: process.env.IP_STACK_ACCESS_KEY || '44db5c8179fd4ef094a74e6467b170c0',
    KEYGEN_ACCOUNT_ID: process.env.KEYGEN_ACCOUNT_ID || '78edb4be-f034-4809-9ea9-b29b0dff113e',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51HJP5dGES2qDPBojjEaDhVwhbPgJ1W3lN5H24uMvlUqPgA9KxEJGdTyA2DIzi8lywEjsSLOW4rOLINW4oHwXfquo00Syg6gw0d',
    STRIPE_PRODUCT_KEY: process.env.STRIPE_PRODUCT_KEY || 'prod_IlXQl78y4QXvKS',
    SALESFORCE_API_VERSION: process.env.SALESFORCE_API_VERSION || 'v50.0',
    SALESFORCE_API_ENDPOINT: process.env.SALESFORCE_API_ENDPOINT || 'http://127.0.0.1:5000',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'salesforce-query-editor',
    htmlAttrs: {
      lang: 'en',
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
    '~/assets/css/googleCookieFont.css',
    '~/assets/css/highligthjs.min.css',
    '~/assets/css/vscode-dark.css',
    '~/assets/css/vscode-light.css',
    '~/assets/css/vscode.css',
    '~/assets/css/global.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/vuelidate.js' , ssr: false },
    { src: '~plugins/confirm-dialog.js' , ssr: false },
    { src: '~plugins/vue-multiselect.js' , ssr: false },
    { src: '~plugins/clipboard.js' , ssr: false },
    { src: '~plugins/vue-drag-drop.js' , ssr: false },
    { src: '~plugins/vue-json-viewer.js' , ssr: false },
    { src: '~plugins/vue-shortkey.js' , ssr: false },
    { src: '~plugins/vue-inline-svg.js' , ssr: false },
    { src: '~plugins/vue-codemirror.js', ssr: false },
    { src: '~plugins/fontawesome.js', ssr: false },
    { src: '~plugins/vue-socket.io.js', ssr: false }
  ],

  components: true,

  buildModules: [
    ['@nuxtjs/eslint-module', { fix: true, quiet: true }],
    "@nuxtjs/svg",
  ],

  loading: {
    height: '0px'
  },

  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['@nuxtjs/google-adsense', {
      id: 'ca-pub-2402391224743305'
    }]
  ],

  axios: {},

  pwa: {
    manifest: {
      short_name: 'SOQL',
      name: 'Salesforce Query Editor',
      description:
        'This Web App helps Salesforce Developers to write Queries.',
      start_url: '/',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone'
    },
    icons: {
      purpose: ['maskable', 'any']
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }

      if (ctx.isClient) {
        config.output.filename = 'app.js',
        config.output.chunkFilename = '[id].js';
        config.optimization.splitChunks.cacheGroups.default = false;
        config.optimization.runtimeChunk = false;
      }
    },

    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
    ],
  },

  router: {
    mode: 'hash',
  },
}
