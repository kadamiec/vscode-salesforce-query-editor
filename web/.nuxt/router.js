import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6996699b = () => interopDefault(import('..\\pages\\account.vue' /* webpackChunkName: "pages/account" */))
const _2909876f = () => interopDefault(import('..\\pages\\editor.vue' /* webpackChunkName: "pages/editor" */))
const _36a8af73 = () => interopDefault(import('..\\pages\\forgot-password.vue' /* webpackChunkName: "pages/forgot-password" */))
const _d17b4ab8 = () => interopDefault(import('..\\pages\\license-activation.vue' /* webpackChunkName: "pages/license-activation" */))
const _9c374bce = () => interopDefault(import('..\\pages\\privacy-policy.vue' /* webpackChunkName: "pages/privacy-policy" */))
const _3596bbe8 = () => interopDefault(import('..\\pages\\product-description.vue' /* webpackChunkName: "pages/product-description" */))
const _6201af5b = () => interopDefault(import('..\\pages\\reset-password.vue' /* webpackChunkName: "pages/reset-password" */))
const _52c6b324 = () => interopDefault(import('..\\pages\\signin.vue' /* webpackChunkName: "pages/signin" */))
const _675d099a = () => interopDefault(import('..\\pages\\signup.vue' /* webpackChunkName: "pages/signup" */))
const _a0cc60c2 = () => interopDefault(import('..\\pages\\subscription.vue' /* webpackChunkName: "pages/subscription" */))
const _265777a9 = () => interopDefault(import('..\\pages\\success-password-reset.vue' /* webpackChunkName: "pages/success-password-reset" */))
const _7e16c8b8 = () => interopDefault(import('..\\pages\\success-signup.vue' /* webpackChunkName: "pages/success-signup" */))
const _ca8b9bae = () => interopDefault(import('..\\pages\\success-subscription.vue' /* webpackChunkName: "pages/success-subscription" */))
const _4071ffb2 = () => interopDefault(import('..\\pages\\success-verification.vue' /* webpackChunkName: "pages/success-verification" */))
const _4a6990e6 = () => interopDefault(import('..\\pages\\update-password.vue' /* webpackChunkName: "pages/update-password" */))
const _05ab0b40 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'hash',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/account",
    component: _6996699b,
    name: "account"
  }, {
    path: "/editor",
    component: _2909876f,
    name: "editor"
  }, {
    path: "/forgot-password",
    component: _36a8af73,
    name: "forgot-password"
  }, {
    path: "/license-activation",
    component: _d17b4ab8,
    name: "license-activation"
  }, {
    path: "/privacy-policy",
    component: _9c374bce,
    name: "privacy-policy"
  }, {
    path: "/product-description",
    component: _3596bbe8,
    name: "product-description"
  }, {
    path: "/reset-password",
    component: _6201af5b,
    name: "reset-password"
  }, {
    path: "/signin",
    component: _52c6b324,
    name: "signin"
  }, {
    path: "/signup",
    component: _675d099a,
    name: "signup"
  }, {
    path: "/subscription",
    component: _a0cc60c2,
    name: "subscription"
  }, {
    path: "/success-password-reset",
    component: _265777a9,
    name: "success-password-reset"
  }, {
    path: "/success-signup",
    component: _7e16c8b8,
    name: "success-signup"
  }, {
    path: "/success-subscription",
    component: _ca8b9bae,
    name: "success-subscription"
  }, {
    path: "/success-verification",
    component: _4071ffb2,
    name: "success-verification"
  }, {
    path: "/update-password",
    component: _4a6990e6,
    name: "update-password"
  }, {
    path: "/",
    component: _05ab0b40,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config.app && config.app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
