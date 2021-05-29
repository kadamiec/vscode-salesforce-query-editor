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
      title: 'Success',
      message: `You will receive an e-mail to redefine your password.`,
    }
  },
}
</script>
