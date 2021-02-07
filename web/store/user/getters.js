export default {
  isLicenseValid: (state) => () => {
    return state.license?.meta?.valid
  },
  getLicenses: (state) => () => {
    return state.licenses?.map(license => {
      return {
        key: license.attributes.key,
        expiry: license.attributes.expiry,
        uses: license.attributes.uses,
        maxUses: license.attributes.maxUses
      }
    });
  },
  getUserEmail: (state) => () => {
    return state.auth.emal;
  }
}
