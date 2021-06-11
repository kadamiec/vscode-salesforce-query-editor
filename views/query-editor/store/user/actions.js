export default {
  fetchConfiguration({ commit }) {
    return this.$axios
      .get(`${process.env.LOCALHOST_API}/vscode/configuration`)
      .then((result) => {
        commit('setConfiguration', result.data)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  fetchThemeColors({ commit }) {
    return this.$axios
      .get(`${process.env.LOCALHOST_API}/vscode/colors`)
      .then((response) => {
        commit('setThemeColors', response.data.colors)
      })
      .catch((error) => {
        console.error(error)
      })
  },
}
