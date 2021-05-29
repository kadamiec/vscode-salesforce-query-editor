<template>
  <side-menu v-if="field" ref="side-menu" @close="onCloseForm">
    <template #left-button>
      <button
        class="vscode-button"
        style="margin-left: 12px"
        @click="onClickDeleteFieldButton"
      >
        <i class="fa fa-trash"></i>
      </button>
    </template>
    <div class="d-flex flex-column mt-2" style="overflow-y: auto">
      <field-details
        v-if="field.details"
        :field="field.details"
        class="p-2"
      ></field-details>

      <filter-form
        v-if="field.details.filterable"
        v-model="field.filters"
        :field="field"
        :show-filter-logic-first-line="showFilterLogicFirstLine"
        class="p-2"
        @change="onChangeField"
      >
      </filter-form>

      <order-by-form
        v-if="field.details.sortable && field.orderBy"
        v-model="field.orderBy"
        class="p-2"
        @change="onChangeField"
      >
        >
      </order-by-form>

      <group-by-form></group-by-form>
    </div>
  </side-menu>
</template>

<script>
import SideMenu from '@/components/side-menu.vue'
import FieldDetails from '@/components/field-details.vue'
import FilterForm from '@/components/filter-form.vue'
import GroupByForm from '@/components/group-by-form.vue'
import OrderByForm from '@/components/order-by-form.vue'

export default {
  components: {
    SideMenu,
    FieldDetails,
    FilterForm,
    OrderByForm,
    GroupByForm,
  },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    soql: {
      type: Object,
      default: () => {},
    },
  },
  data: () => {
    return {
      field: null,
    }
  },
  computed: {
    showFilterLogicFirstLine() {
      return this.areThereTwoFields && this.isThereAFilter
    },
    areThereTwoFields() {
      let numFields = 0
      for (var [, sobject] of Object.entries(this.soql.sobjects)) {
        for (var [, field] of Object.entries(sobject.fields)) {
          numFields++
          if (numFields === 2) return true
        }
      }
      return false
    },
    isThereAFilter() {
      for (var [, sobject] of Object.entries(this.soql.sobjects)) {
        for (var [, field] of Object.entries(sobject.fields)) {
          if (
            field.filters.find(
              (filter) => filter.logicalOperator && filter.value
            )
          )
            return true
        }
      }
      return false
    },
  },
  watch: {
    value(newValue) {
      this.field = { ...newValue }
    },
  },
  mounted() {
    this.field = { ...this.value }
  },
  beforeMount() {
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        this.closed = true
        event.preventDefault()
      }
    })
  },
  methods: {
    openForm() {
      this.$refs['side-menu'].open()
    },
    closeForm() {
      this.$refs['side-menu'].close()
    },
    onCloseForm() {
      this.$emit('close')
    },
    onClickDeleteFieldButton() {
      this.$emit('deleteField')
    },
    onChangeField() {
      this.$emit('change', this.field)
    },
  },
}
</script>

<style scoped></style>
