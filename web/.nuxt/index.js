import Vue from 'vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from '..\\layouts\\error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_plugin_33580086 from 'nuxt_plugin_plugin_33580086' // Source: .\\components\\plugin.js (mode: 'all')
import nuxt_plugin_bootstrapvue_c0da34e2 from 'nuxt_plugin_bootstrapvue_c0da34e2' // Source: .\\bootstrap-vue.js (mode: 'all')
import nuxt_plugin_workbox_3b88f708 from 'nuxt_plugin_workbox_3b88f708' // Source: .\\workbox.js (mode: 'client')
import nuxt_plugin_metaplugin_1e883cfc from 'nuxt_plugin_metaplugin_1e883cfc' // Source: .\\pwa\\meta.plugin.js (mode: 'all')
import nuxt_plugin_iconplugin_232fe270 from 'nuxt_plugin_iconplugin_232fe270' // Source: .\\pwa\\icon.plugin.js (mode: 'all')
import nuxt_plugin_axios_26b13140 from 'nuxt_plugin_axios_26b13140' // Source: .\\axios.js (mode: 'all')
import nuxt_plugin_vuelidate_7b59e9fd from 'nuxt_plugin_vuelidate_7b59e9fd' // Source: ..\\plugins\\vuelidate.js (mode: 'client')
import nuxt_plugin_confirmdialog_94ca5c2a from 'nuxt_plugin_confirmdialog_94ca5c2a' // Source: ..\\plugins\\confirm-dialog.js (mode: 'client')
import nuxt_plugin_vuemultiselect_3dc575a0 from 'nuxt_plugin_vuemultiselect_3dc575a0' // Source: ..\\plugins\\vue-multiselect.js (mode: 'client')
import nuxt_plugin_vueclipboard2_a18a5fc6 from 'nuxt_plugin_vueclipboard2_a18a5fc6' // Source: ..\\plugins\\vue-clipboard2.js (mode: 'client')
import nuxt_plugin_vuedragdrop_496cabcd from 'nuxt_plugin_vuedragdrop_496cabcd' // Source: ..\\plugins\\vue-drag-drop.js (mode: 'client')
import nuxt_plugin_vuejsonviewer_1c812b3e from 'nuxt_plugin_vuejsonviewer_1c812b3e' // Source: ..\\plugins\\vue-json-viewer.js (mode: 'client')
import nuxt_plugin_vueshortkey_0f0f5436 from 'nuxt_plugin_vueshortkey_0f0f5436' // Source: ..\\plugins\\vue-shortkey.js (mode: 'client')
import nuxt_plugin_vueinlinesvg_e267786e from 'nuxt_plugin_vueinlinesvg_e267786e' // Source: ..\\plugins\\vue-inline-svg.js (mode: 'client')
import nuxt_plugin_fontawesome_21e933da from 'nuxt_plugin_fontawesome_21e933da' // Source: ..\\plugins\\fontawesome.js (mode: 'client')
import nuxt_plugin_vuesocketio_69da48d8 from 'nuxt_plugin_vuesocketio_69da48d8' // Source: ..\\plugins\\vue-socket.io.js (mode: 'client')
import nuxt_plugin_vueinfiniteloading_5cc91c16 from 'nuxt_plugin_vueinfiniteloading_5cc91c16' // Source: ..\\plugins\\vue-infinite-loading.js (mode: 'client')
import nuxt_plugin_vuecolumnsresizable_76c1d01a from 'nuxt_plugin_vuecolumnsresizable_76c1d01a' // Source: ..\\plugins\\vue-columns-resizable.js (mode: 'client')
import nuxt_plugin_vuegtag_9d23d474 from 'nuxt_plugin_vuegtag_9d23d474' // Source: ..\\plugins\\vue-gtag.js (mode: 'client')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    return this.$root.$options.$nuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":true,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

const originalRegisterModule = Vuex.Store.prototype.registerModule

function registerModule (path, rawModule, options = {}) {
  const preserveState = process.client && (
    Array.isArray(path)
      ? !!path.reduce((namespacedState, path) => namespacedState && namespacedState[path], this.state)
      : path in this.state
  )
  return originalRegisterModule.call(this, path, rawModule, { preserveState, ...options })
}

async function createApp(ssrContext, config = {}) {
  const router = await createRouter(ssrContext, config)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"Salesforce Query Editor","htmlAttrs":{"lang":"en"},"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":""}],"link":[],"script":[{"src":"https:\u002F\u002Fjs.stripe.com\u002Fv3\u002F","crossorigin":"anonymous"}],"style":[]},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (typeof nuxt_plugin_plugin_33580086 === 'function') {
    await nuxt_plugin_plugin_33580086(app.context, inject)
  }

  if (typeof nuxt_plugin_bootstrapvue_c0da34e2 === 'function') {
    await nuxt_plugin_bootstrapvue_c0da34e2(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_workbox_3b88f708 === 'function') {
    await nuxt_plugin_workbox_3b88f708(app.context, inject)
  }

  if (typeof nuxt_plugin_metaplugin_1e883cfc === 'function') {
    await nuxt_plugin_metaplugin_1e883cfc(app.context, inject)
  }

  if (typeof nuxt_plugin_iconplugin_232fe270 === 'function') {
    await nuxt_plugin_iconplugin_232fe270(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_26b13140 === 'function') {
    await nuxt_plugin_axios_26b13140(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuelidate_7b59e9fd === 'function') {
    await nuxt_plugin_vuelidate_7b59e9fd(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_confirmdialog_94ca5c2a === 'function') {
    await nuxt_plugin_confirmdialog_94ca5c2a(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuemultiselect_3dc575a0 === 'function') {
    await nuxt_plugin_vuemultiselect_3dc575a0(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vueclipboard2_a18a5fc6 === 'function') {
    await nuxt_plugin_vueclipboard2_a18a5fc6(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuedragdrop_496cabcd === 'function') {
    await nuxt_plugin_vuedragdrop_496cabcd(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuejsonviewer_1c812b3e === 'function') {
    await nuxt_plugin_vuejsonviewer_1c812b3e(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vueshortkey_0f0f5436 === 'function') {
    await nuxt_plugin_vueshortkey_0f0f5436(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vueinlinesvg_e267786e === 'function') {
    await nuxt_plugin_vueinlinesvg_e267786e(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_fontawesome_21e933da === 'function') {
    await nuxt_plugin_fontawesome_21e933da(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuesocketio_69da48d8 === 'function') {
    await nuxt_plugin_vuesocketio_69da48d8(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vueinfiniteloading_5cc91c16 === 'function') {
    await nuxt_plugin_vueinfiniteloading_5cc91c16(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuecolumnsresizable_76c1d01a === 'function') {
    await nuxt_plugin_vuecolumnsresizable_76c1d01a(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuegtag_9d23d474 === 'function') {
    await nuxt_plugin_vuegtag_9d23d474(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // If server-side, wait for async component to be resolved first
  if (process.server && ssrContext && ssrContext.url) {
    await new Promise((resolve, reject) => {
      router.push(ssrContext.url, resolve, (err) => {
        // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
        if (!err._isRouter) return reject(err)
        if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

        // navigated to a different route in router guard
        const unregister = router.afterEach(async (to, from) => {
          ssrContext.url = to.fullPath
          app.context.route = await getRouteData(to)
          app.context.params = to.params || {}
          app.context.query = to.query || {}
          unregister()
          resolve()
        })
      })
    })
  }

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
