<template>
  <div class="d-flex flex-column">
    <router-link :to="pageName" class="d-flex mx-auto mt-5">
      <i class="fa fa-arrow-circle-right fa-2x mr-2"></i>
      <div class="my-auto" style="font-size: 20px">Go to {{ pageLabel }}</div>
    </router-link>
    <div class="text-center">
      You will be redirected in {{ counter }} / {{ redirectTimer }} seconds
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageName: {
      type: String,
      default: null,
    },
    pageLabel: {
      typ: String,
      default: null,
    },
  },
  data: () => {
    return {
      redirectTimer: 10,
      counter: 0,
      intervalId: null,
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if (this.counter > this.redirectTimer - 1) {
        clearInterval(this.intervalId)
        this.$router.push({ name: this.pageName })
      } else {
        this.counter++
      }
    }, 1000)
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
}
</script>

<style></style>
