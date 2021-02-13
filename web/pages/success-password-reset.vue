<template>
  <success-message :title="title" :message="message" page-name="signin" page-label="Sign In"></success-message>
</template>

<script>
import SuccessMessage from '@/components/success-message'

export default {
  components: {
    SuccessMessage
  },
  data: () => {
    return {
      title: 'Success',
      message: `You will receive an e-mail to redefine your password.`
    }
  }
}
</script>
