<template>
  <div>
    <github-button v-if="configuration.displayHelpButton"></github-button>
    <Nuxt style="overflow-y: hidden" />
    <cookie-banner v-if="!isVSCode"></cookie-banner>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CookieBanner from '@/components/cookie-banner.vue'
import GithubButton from '@/components/github-button.vue'
import disableInspect from '~/mixins/disable-inspect'
import configurationChange from '~/mixins/configuration-change'
import colorChange from '~/mixins/color-change'
import isVscode from '~/mixins/is-vscode'

export default {
  components: {
    CookieBanner,
    GithubButton,
  },
  mixins: [colorChange, configurationChange, disableInspect, isVscode],
  middleware: ['is-local-server-running', 'fetch-colors'],
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
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
