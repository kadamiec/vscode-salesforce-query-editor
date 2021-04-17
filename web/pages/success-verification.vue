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
      title: 'Thank You!',
      message: `Your e-mail has been successfully verified.`,
    }
  },
}
</script>
