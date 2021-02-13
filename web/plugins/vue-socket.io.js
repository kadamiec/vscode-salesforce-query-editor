import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

const socketInstance = io(`${process.env.SALESFORCE_SERVER}`, {
  transports: ['websocket'],
})

Vue.use(VueSocketIOExt, socketInstance)
