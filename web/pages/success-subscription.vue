<template>
  <div class="d-flex vh-100 vw-100">
    <div class="d-flex flex-column m-auto">
      <div style="font-size: 30px" class="text-center">
        Thank you for your Purchase!
      </div>
      <i class="fas fa-10x mx-auto fa-check-circle my-5"></i>
      <div style="font-size: 30px" class="text-center">
        If your payment is accepted, we will send you an e-mail with your
        License Key and instructions on how to activate it.
      </div>
      <redirect-button redirect-to="index"></redirect-button>
    </div>
  </div>
</template>

<script>
import RedirectButton from '@/components/redirect-button'
export default {
  components: {
    RedirectButton,
  },
}
</script>

<style></style>
