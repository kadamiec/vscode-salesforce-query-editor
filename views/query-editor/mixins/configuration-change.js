import { mapMutations } from 'vuex'

export default {
  sockets: {
    configuration(configuration) {
      this.setConfiguration(configuration)
    },
  },
  methods: {
    ...mapMutations({
        setConfiguration: 'user/setConfiguration',
    }),
  },
}
