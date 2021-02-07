<template>
  <section
    v-show="isActive"
    :id="computedId"
    :aria-hidden="!isActive"
    class="tabs-component-panel"
    role="tabpanel"
  >
    <slot />
  </section>
</template>

<script>
export default {
  props: {
    id: { default: null },
    name: { required: true },
    label: { required: true},
    prefix: { default: '' },
    suffix: { default: '' },
    isDisabled: { default: false },
    isActive: { default: false},
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
