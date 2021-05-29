import { mapMutations } from 'vuex'

export default {
  sockets: {
    activecolortheme(colors) {
      if (colors && Object.keys(colors).length) this.setThemeColors(colors)
    },
  },
  methods: {
    ...mapMutations({
      setThemeColors: 'user/setThemeColors',
    }),
  },
}
