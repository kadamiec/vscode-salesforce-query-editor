export default {
  methods: {
    openPage(page) {
      if (process.env.IS_VSCODE) {
        this.$axios
          .post(
            `${process.env.SALESFORCE_SERVER}/vscode/page/open`,
            {
              page,
            },
            {
              headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
              },
            }
          )
          .catch(() => {
            this.showToastMessage('Could not open the page.')
          })
      } else {
        window.open(page, '_blank')
      }
    },
  },
}
