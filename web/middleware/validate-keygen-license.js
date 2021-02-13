export default async function ({ store }) {
  if (!store.state.user?.license?.meta?.valid) {
    const response = await store.dispatch('user/fetchActivatedLicense')
    if (response?.data?.key) {
      await store.dispatch('user/fetchMachineFingerprint')
      await store.dispatch('user/validateLicense')
    }
  }
}
