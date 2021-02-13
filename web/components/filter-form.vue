<template>
  <b-card v-if="filters" no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button v-b-toggle.filter-accordion block class="vscode-button btn"
        >Filter</b-button
      >
    </b-card-header>
    <b-collapse
      id="filter-accordion"
      visible
      accordion="filter-accordion"
      role="tabpanel"
    >
      <b-card-body style="padding: 5px">
        <div class="d-flex flex-column">
          <filter-entry-form
            v-for="(filter, filterIndex) in value"
            :key="filterIndex"
            v-model="filters[filterIndex]"
            :field="field"
            :index="filterIndex"
            class="mb-1"
            @change="onChangeFilter(filterIndex)"
            @deleteFilter="onDeleteFilter"
          />
          <button
            class="vscode-button btn mb-1 ml-auto"
            @click="onClickAddFilter"
          >
            New Filter
          </button>
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import FilterEntryForm from '@/components/filter-entry-form.vue'
export default {
  components: {
    FilterEntryForm,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    field: {
      type: Object,
      default: () => {},
    },
    showFilterLogicFirstLine: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      filters: null,
    }
  },
  mounted() {
    this.filters = [...this.value]
  },
  methods: {
    onDeleteFilter({ filterIndex }) {
      this.filters.splice(filterIndex, 1)
      this.$emit('input', this.filters)
      this.$emit('change', this.filters)
    },
    onClickAddFilter() {
      this.filters.push({
        operator: undefined,
        value: undefined,
        logic: undefined,
      })
      this.$emit('input', this.filters)
      this.$emit('change', this.filters)
    },
    onChangeFilter(newFilterIndex) {
      this.$emit('input', this.filters)
      this.$emit('change', this.filters[newFilterIndex])
    },
  },
}
</script>

<style></style>
