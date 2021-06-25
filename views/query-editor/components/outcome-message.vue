<template>
  <div class="d-flex vh-100 vw-100">
    <div class="d-flex flex-column m-auto">
      <div style="font-size: 30px" class="text-center">
        {{ title }}
      </div>
      <i class="fas fa-10x mx-auto my-5" :class="computedIcon"></i>
      <div style="font-size: 30px" class="text-center">
        {{ message }}
      </div>
      <redirect-button
        :page-name="pageName"
        :page-label="pageLabel"
      ></redirect-button>
    </div>
  </div>
</template>

<script>
import RedirectButton from '@/components/redirect-button'
export default {
  components: {
    RedirectButton,
  },
  props: {
    title: {
      type: String,
      default: 'Success',
    },
    message: {
      type: String,
      default: '',
    },
    pageLabel: {
      type: String,
      default: 'Sign In',
    },
    pageName: {
      type: String,
      default: 'signin',
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedIcon() {
      return this.isError ? 'fa-times-circle' : 'fa-check-circle'
    },
  },
}
</script>

<style></style>
