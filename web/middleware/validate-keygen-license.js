export default async function ({ store, redirect }) {
  if(process.env.NODE_ENV === "production"){
    const isVSCode = store.state.user.isVSCode;
    if (!store.state.user?.license?.meta?.valid) {
      await store.dispatch('user/fetchActivatedLicense')
      .then(async (response) => {
        if (response?.data?.key) {
          await store.dispatch('user/fetchMachineFingerprint')
          await store.dispatch('user/validateLicense')
          .then((response) => {
            if(!isVSCode && !response.data.meta.valid) redirect('/subscription')
          })
        }else{
          if(!isVSCode) redirect('/subscription')
        }
      })
      .catch(() => {
        if(!isVSCode) redirect('/subscription')
      })
    }
  }
}
