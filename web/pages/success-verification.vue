<template>
  <success-message :title="title" :message="message"></success-message>
</template>

<script>
import SuccessMessage from '@/components/success-message'

export default {
  components: {
    SuccessMessage,
  },
  data: () => {
    return {
      title: 'E-mail Verification',
      message: `Your e-mail was verified with success. Thank you.`,
    }
  },
}
</script>
