import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

const socketInstance = io(`${process.env.LOCALHOST_API}`, {
  transports: ['websocket'],
})

Vue.use(VueSocketIOExt, socketInstance)
