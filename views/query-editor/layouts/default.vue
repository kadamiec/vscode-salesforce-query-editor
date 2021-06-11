<template>
  <div class="overflow-hidden">
    <github-button
      v-if="isVSCode && configuration.displayHelpButton"
    ></github-button>
    <side-bar v-if="!this.isVSCode" />
    <Nuxt
      keep-alive
      :class="this.isVSCode ? 'w-100' : 'main'"
      style="position: fixed"
      class="margin-transition"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SideBar from '@/components/side-bar'
import disableInspect from '~/mixins/disable-inspect'
import colorChange from '~/mixins/color-change'
import configurationChange from '~/mixins/configuration-change'
import isVscode from '~/mixins/is-vscode'

export default {
  components: {
    SideBar,
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

<style scoped>
.main {
  margin-left: var(--side-bar-size);
  width: calc(100vw - var(--side-bar-size));
}

.margin-transition {
  transition: margin 0.2s linear;
}
</style>
