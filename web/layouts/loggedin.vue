<template>
  <div class="overflow-hidden">
    <side-bar :active="displaySideBar"></side-bar>
    <Nuxt
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
import disableInspect from '~/mixins/disable-inspect'

export default {
  components: {
    SideBar,
  },
  mixins: [disableInspect],
  data: () => {
    return {
      displaySideBar: true,
    }
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
