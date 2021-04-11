<template>
  <outcome-message
    :title="title"
    :message="message"
    page-name="account"
    page-label="Account"
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
      title: 'Thank you for your Purchase!',
      message: `You will receive an e-mail with your License Key and instructions on how
        to activate it. If you did not receive your licenses, send an email to
        support@salesforcequeryeditor.com.`,
    }
  },
}
</script>
