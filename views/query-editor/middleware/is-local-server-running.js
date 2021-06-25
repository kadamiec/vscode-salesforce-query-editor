import axios from 'axios'

export default async function ({ store }) {
    try{
        await axios.get(process.env.LOCALHOST_API);
        store.commit('user/setIsLocalServerRunning', true)
    }catch(_){
        store.commit('user/setIsLocalServerRunning', false)
    }
}
