<template>
  <div class="d-flex justify-content-center w-100 vh-100">
    <stretch
      background="var(--vscode-activityBarBadge-background)"
      class="m-auto"
      style="height: 100px; width: 100px"
    />
  </div>
</template>

<script>
import { Stretch } from 'vue-loading-spinner'
export default {
  components: {
    Stretch,
  },
}
</script>

<style></style>
