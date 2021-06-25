export default async function ({ store }) {
  if (store.state.user.isLocalServerRunning)
    store.dispatch('user/fetchThemeColors')
}
