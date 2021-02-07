export default {
  setAuth(state, auth) {
    state.auth = {
      email: auth.email,
      token: auth.token,
      expiry: auth.expiry,
      created: auth.created,
      updated: auth.updated,
      kind: auth.kind,
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
  setLicensekey(state, { key }){
    state.license.key = key;
  },
  setLicenses(state, licenses){
    state.licenses = licenses;
  }
}
