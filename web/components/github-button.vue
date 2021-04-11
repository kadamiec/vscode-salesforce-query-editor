<template>
  <div
    v-b-tooltip.hover
    class="button-container"
    title="Help"
    @click="onClickGithubButton"
  >
    <i class="fa fa-github fa-3x"></i>
  </div>
</template>

<script>
import showToastMessage from '~/mixins/show-toast-message'
import openPage from '~/mixins/open-page'

export default {
  mixins: [showToastMessage, openPage],
  methods: {
    onClickGithubButton() {
      this.openPage('https://github.com/AllanOricil/SOQL-Editor-Issues/issues')
    },
  },
}
</script>

<style scoped>
.button-container {
  position: fixed;
  right: 0;
  bottom: 20px;
  width: 50px;
  z-index: 999;
}
</style>
