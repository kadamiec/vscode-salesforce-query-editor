export default function ({ route, store }) {
  store.commit('user/setActiveMenu', route.name)
}
