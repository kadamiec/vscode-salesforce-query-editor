<template>
  <div
    v-show="isActive"
    :id="computedId"
    :aria-hidden="!isActive"
    class="tab-content"
    role="tabpanel"
  >
    <transition name="fade"><slot></slot></transition>
  </div>
</template>

<script>
export default {
  props: {
    id: { default: null },
    name: { required: true },
    label: { required: true },
    prefix: { default: '' },
    suffix: { default: '' },
    isDisabled: { default: false },
    isActive: { default: false },
  },
  computed: {
    header() {
      return this.prefix + this.name + this.suffix
    },
    computedId() {
      return this.id ? this.id : this.name.toLowerCase().replace(/ /g, '-')
    },
    hash() {
      if (this.isDisabled) {
        return '#'
      }
      return '#' + this.computedId
    },
  },
}
</script>

<style scoped>
.tab-content {
  overflow-y: auto;
  width: 100%;
  height: calc(100vh - var(--tabs-height) - 1px);
}
</style>
