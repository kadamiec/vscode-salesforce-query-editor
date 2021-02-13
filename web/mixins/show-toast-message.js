export default {
  methods: {
    showToastMessage(message) {
      this.$bvToast.toast(message, {
        toaster: 'b-toaster-bottom-right',
        solid: true,
        appendToast: true,
        noCloseButton: true,
      })
    },
  },
}
