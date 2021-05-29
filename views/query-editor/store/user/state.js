import darkTheme from '~/assets/json/dark-theme.json'

export default () => ({
  auth: {},
  license: {
    meta: {
      valid: false,
    },
  },
  theme: darkTheme,
  user: {},
  subscriptions: [],
  fingerprint: null,
  configuration: {},
  activeMenu: null,
  isLocalServerRunning: false
})