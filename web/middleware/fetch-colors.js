export default async function ({ store }) {
  if (store.state.user.isLocalServerRunning)
    await store.dispatch('user/fetchThemeColors')
}
