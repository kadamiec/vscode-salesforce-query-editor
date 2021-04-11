export default async function ({ store, redirect }) {
  if (process.env.NODE_ENV === 'production') {
    if (!store.state.user?.license?.meta?.valid) {
      await store
        .dispatch('user/fetchActivatedLicense')
        .then(async (response) => {
          if (response?.data?.key) {
            await store.dispatch('user/fetchMachineFingerprint')
            await store
              .dispatch('user/validateLicense')
              .then((response) => {
                if (!process.env.IS_VSCODE && !response.data.meta.valid)
                  redirect('/subscription')
              })
              .catch(() => redirect('/subscription'))
          } else if (!process.env.IS_VSCODE) redirect('/subscription')
        })
        .catch(() => {
          if (!process.env.IS_VSCODE) redirect('/subscription')
        })
    }
  }
}
