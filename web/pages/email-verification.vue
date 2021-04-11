<template>
  <span></span>
</template>

<script>
export default {
  created() {
    this.$axios
      .get(
        `${process.env.WEBHOOKS_SERVER}/verification?code=${this.$route.query.code}`
      )
      .catch(() => {
        this.$router.push({ name: 'bad-verification' })
      })
  },
}
</script>

<style></style>
