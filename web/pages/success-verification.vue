<template>
  <outcome-message :title="title" :message="message"></outcome-message>
</template>

<script>
import OutcomeMessage from '@/components/outcome-message'

export default {
  components: {
    OutcomeMessage,
  },
  data: () => {
    return {
      title: 'E-mail Verification',
      message: `Your e-mail was verified with success. Thank you.`,
    }
  },
}
</script>
