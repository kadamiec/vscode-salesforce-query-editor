<template>
  <div class="overflow-hidden">
    <side-bar :active="displaySideBar"></side-bar>
    <Nuxt
      keep-alive
      :class="{
        main: this.displaySideBar,
        'w-100': !this.displaySideBar,
      }"
      style="position: fixed"
      class="margin-transition"
    />
  </div>
</template>

<script>
import SideBar from '@/components/side-bar'
import { mapState } from 'vuex'
import disableInspect from '~/mixins/disable-inspect'
import colorChange from '~/mixins/color-change'
import configurationChange from '~/mixins/configuration-change'

export default {
  components: {
    SideBar,
  },
  middleware: ['fetch-colors', 'is-local-server-running'],
  mixins: [colorChange, configurationChange, disableInspect],
  data: () => {
    return {
      displaySideBar: null,
    }
  },
  computed: {
    ...mapState({
      isVSCode: (state) => state.user.isVSCode
    }),
  },
  beforeMount(){
    this.displaySideBar = !this.isVSCode;
  }
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
