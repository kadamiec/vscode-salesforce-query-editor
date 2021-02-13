export default {
  setAuth(state, auth) {
    state.auth = {
      email: auth.data.attributes.email,
      token: auth.data.attributes.token,
      expiry: auth.data.attributes.expiry,
      created: auth.data.attributes.created,
      updated: auth.data.attributes.updated,
      kind: auth.data.attributes.kind,
      userId: auth.data.relationships.bearer.data.id,
    }
  },
  setLicense(state, license) {
    state.license = license
  },
  setConfiguration(state, configuration) {
    state.configuration = configuration
  },
  setFingerprint(state, { fingerprint }) {
    state.fingerprint = fingerprint
  },
  setLicensekey(state, { key }) {
    state.license.key = key
  },
  setLicenses(state, licenses) {
    state.licenses = licenses
  },
  deleteLicense(state) {
    state.license = {
      meta: {
        valid: false,
      },
    }
  },
  setUser(state, user) {
    state.user = user
  },
  setStripeUser(state, stripeCustomerId) {
    state.user.metadata.stripeCustomerId = stripeCustomerId
  },
  setSubscriptions(state, subscriptions) {
    state.subscriptions = subscriptions
  },
  setActiveMenu(state, activeMenu) {
    state.activeMenu = activeMenu
  },
  reset: (state) => {
    state.auth = {}
    state.license = {
      meta: {
        valid: false,
      },
    }
    state.user = {}
    state.subscriptions = []
    state.fingerprint = null
    state.configuration = {
      displayEditor: true,
      format: {
        automatically: true,
      },
      fieldType: {
        table: false,
        form: false,
      },
      nestedResults: {
        style: false,
        expanded: false,
        depth: false,
      },
      groupSelectedFields: true,
    }
  },
}
