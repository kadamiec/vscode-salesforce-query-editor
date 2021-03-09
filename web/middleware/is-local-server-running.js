import axios from 'axios'

export default async function ({ store }) {
    try{
        await axios.get('http://127.0.0.1:5000')
        store.commit('user/setIsLocalServerRunning', true)
    }catch(_){
        store.commit('user/setIsLocalServerRunning', false)
    }
}
