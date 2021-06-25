<template>
  <div class="d-flex flex-column vw-100 vh-100">
    <div class="d-flex flex-column m-auto">
      <h3 class="mx-auto">Fatal Error</h3>
      <p v-if="error" class="mx-auto mb-2">
        {{ error.message }}
      </p>
      <a class="mx-auto" @click="onClickReportIssue">Report this error</a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import colorChange from '~/mixins/color-change'
import configurationChange from '~/mixins/configuration-change'

export default {
  mixins: [colorChange, configurationChange],
  props: ['error'],
  computed: {
    ...mapState({
      auth: (state) => state.user.auth,
    }),
  },
  methods: {
    onClickReportIssue() {
      window.open(
        'https://github.com/AllanOricil/SOQL-Editor-Issues/issues/new',
        '_blank'
      )
    },
  },
}
</script>

<style scoped>
a {
  cursor: pointer;
}

p {
  font-size: 15px;
}
</style>
