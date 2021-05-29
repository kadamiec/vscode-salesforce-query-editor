export default {
  reset({ commit }) {
    return new Promise((resolve) => {
      ;['user', 'salesforce'].forEach((storeName) => {
        commit(`${storeName}/reset`)
      })
      resolve()
    })
  },
}
