export default async function({ store , redirect}){
    if(!store.state.user?.license?.meta?.valid){
        const response = await store.dispatch('user/fetchLicense');
        if(response?.data?.key) await store.dispatch('user/validateLicense', { key: response.data.key })
    }
}