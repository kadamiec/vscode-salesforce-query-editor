<template>
  <success-message
    :title="title"
    :message="message"
    page-name="signin"
    page-label="Sign In"
  ></success-message>
</template>

<script>
import SuccessMessage from '@/components/success-message'

export default {
  components: {
    SuccessMessage,
  },
  data: () => {
    return {
      title: 'Thank you for your registering!',
      message: `Plese, click on the link sent to your e-mail to verify your account.`,
    }
  },
}
</script>

<style></style>