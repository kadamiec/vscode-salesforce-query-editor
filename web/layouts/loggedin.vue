<template>
  <div class="overflow-hidden">
    <side-bar :active="!isVSCode"></side-bar>
    <Nuxt
      keep-alive
      :class="{
        main: !this.isVSCode,
        'w-100': !!this.isVSCode,
      }"
      style="position: fixed"
      class="margin-transition"
    />
    <cookie-banner v-if="!isVSCode"></cookie-banner>
  </div>
</template>

<script>
import CookieBanner from '@/components/cookie-banner.vue'
import SideBar from '@/components/side-bar'
import { mapState } from 'vuex'
import disableInspect from '~/mixins/disable-inspect'
import colorChange from '~/mixins/color-change'
import configurationChange from '~/mixins/configuration-change'

export default {
  components: {
    SideBar,
    CookieBanner,
  },
  mixins: [colorChange, configurationChange, disableInspect],
  middleware: ['fetch-colors', 'is-local-server-running'],
  computed: {
    ...mapState({
      isVSCode: (state) => state.user.isVSCode,
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
