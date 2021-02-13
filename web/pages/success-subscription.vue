<template>
  <success-message :title="title" :message="message" page-name="account" page-label="Account"></success-message>
</template>

<script>
import SuccessMessage from '@/components/success-message'

export default {
  components: {
    SuccessMessage
  },
  data: () => {
    return {
      title: 'Thank you for your Purchase!',
      message: `You will receive an e-mail with your License Key and instructions on how
        to activate it. If you did not receive your licenses, send an email to
        support@salesforcequeryeditor.com.`
    }
  }
}
</script>
