<template>
  <div></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  middleware: ['auth'],
  created() {
    this.fetchMachineFingerprint()
    this.$router.push({ name: 'signin' })
  },
  methods: {
    ...mapActions({
      fetchMachineFingerprint: 'user/fetchMachineFingerprint',
      fetchThemeColors: 'user/fetchThemeColors',
    }),
  },
}
</script>

<style></style>
