export default {
  methods: {
    showToastMessage(message) {
      this.$bvToast.toast(message, {
        toaster: 'b-toaster-top-center',
        solid: true,
        appendToast: true,
        noCloseButton: true,
      })
    },
  },
}
