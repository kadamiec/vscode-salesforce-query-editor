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
  isVSCode: isVScode(),
  isLocalServerRunning: false
})

function isVScode() {
  try {
    acquireVsCodeApi()
    return true
  } catch (_) {
    return false
  }
}
