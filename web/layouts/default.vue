<template>
  <div>
    <Nuxt style="overflow-y: hidden" />
    <cookie-banner v-if="!isVSCode"></cookie-banner>
  </div>
</template>

<script>
import CookieBanner from '@/components/cookie-banner.vue'
import { mapState } from 'vuex'
import disableInspect from '~/mixins/disable-inspect'
import configurationChange from '~/mixins/configuration-change'
import colorChange from '~/mixins/color-change'

export default {
  components: [CookieBanner],
  mixins: [colorChange, configurationChange, disableInspect],
  middleware: ['fetch-colors', 'is-local-server-running'],
  computed: {
    ...mapState({
      isVSCode: (state) => state.user.isVSCode,
    }),
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
CookieBanner
