<template>
  <outcome-message
    :title="title"
    :message="message"
    :is-error="true"
    page-name="signin"
    page-label="Sign In"
  ></outcome-message>
</template>

<script>
import OutcomeMessage from '@/components/outcome-message'

export default {
  components: {
    OutcomeMessage,
  },
  data: () => {
    return {
      title: 'Error!',
      message: `Sorry, your e-mail could not be verified.`,
    }
  },
}
</script>

<style></style>
