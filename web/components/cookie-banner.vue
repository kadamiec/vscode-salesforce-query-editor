<template>
  <div
    v-if="isOpen"
    class="fixed-bottom d-flex flex-column justify-content-center"
  >
    <p class="mx-auto">
      🍪 Can I use cookies for analytics? Read
      <nuxt-link to="/privacy-policy">the privacy policy</nuxt-link>
      for more information.
    </p>
    <div class="d-flex justify-content-center mt-1 mb-2">
      <div class="vscode-button mr-2" @click="accept">Yes, sure</div>
      <div class="vscode-button" @click="deny">No</div>
    </div>
  </div>
</template>

<script>
import { bootstrap } from 'vue-gtag'

export default {
  data: () => {
    return {
      isOpen: false,
    }
  },
  created() {
    if (!this.getGDPR() === true) {
      this.isOpen = true
    }
  },
  methods: {
    deny() {
      if (process.browser) {
        this.isOpen = false
        localStorage.setItem('GDPR:accepted', false)
      }
    },
    accept() {
      if (process.browser) {
        bootstrap().then((gtag) => {
          this.isOpen = false
          localStorage.setItem('GDPR:accepted', true)
          location.reload()
        })
      }
    },
    getGDPR() {
      if (process.browser) {
        return localStorage.getItem('GDPR:accepted', true)
      }
    },
  },
}
</script>

<style></style>
