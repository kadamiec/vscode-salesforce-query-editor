<template>
  <outcome-message
    :title="title"
    :message="message"
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
      title: 'Thank you for registering!',
      message: `Plese, click on the link sent to your e-mail to verify your account.`,
    }
  },
}
</script>

<style></style>