<template>
  <div class="overflow-hidden">
    <github-button
      v-if="isVSCode && configuration.displayHelpButton"
    ></github-button>
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

    <feedback-modal ref="feedback-modal"></feedback-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CookieBanner from '@/components/cookie-banner.vue'
import FeedbackModal from '@/components/feedback-modal.vue'
import SideBar from '@/components/side-bar'
import disableInspect from '~/mixins/disable-inspect'
import colorChange from '~/mixins/color-change'
import configurationChange from '~/mixins/configuration-change'
import isVscode from '~/mixins/is-vscode'

export default {
  components: {
    SideBar,
    CookieBanner,
    FeedbackModal,
  },
  mixins: [colorChange, configurationChange, disableInspect, isVscode],
  middleware: ['is-local-server-running', 'fetch-colors'],
  mounted() {
    this.$axios
      .get(`${process.env.WEBHOOKS_SERVER}/feedback/${this.auth.userId}`, {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
        },
      })
      .then((response) => {
        if (!response.data.feedback) {
          setTimeout(() => {
            this.$refs['feedback-modal'].open()
          }, 30 * 1000)
        }
      })
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
      auth: (state) => state.user.auth,
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
