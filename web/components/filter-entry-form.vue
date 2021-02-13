<template>
  <div v-if="filterEntry" class="d-flex">
    <div class="d-flex flex-column mr-2 w-100">
      <label for="operator">Operator</label>
      <select
        ref="operator"
        v-model="filterEntry.operator"
        class="mr-2 w-100"
        @change="onChangeFilterEntry"
      >
        <option value="=">=</option>
        <option value="!=">!=</option>
        <option value="<">&lt;</option>
        <option value=">">></option>
        <option value="<=">&lt;=</option>
        <option value=">=">>=</option>
        <option value="startsWith">Starts With</option>
        <option value="endsWith">Ends With</option>
        <option value="contains">Contains</option>
        <option value="in">In</option>
        <option value="notIn">Not In</option>
        <option value="includes">Includes</option>
        <option value="excludes">Excludes</option>
      </select>
    </div>

    <div class="d-flex flex-column mr-2 w-100">
      <label for="value">Value</label>
      <input
        ref="value"
        v-model="filterEntry.value"
        type="text"
        class="mr-2 w-100"
        @input="onChangeFilterEntry"
      />
    </div>
    <button
      v-if="['date', 'datetime'].includes(field.type)"
      class="vscode-button btn btn-primary mt-auto ml-auto mr-2"
      @click="onClickUseFunctionButton"
    >
      <i class="fa fa-calendar"></i>
    </button>
    <div class="d-flex flex-column mr-2 w-100">
      <label for="logic">Logic</label>
      <select
        ref="logic"
        v-model="filterEntry.logic"
        class="mr-2 w-100"
        @change="onChangeFilterEntry"
      >
        <option value=""></option>
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
    </div>
    <button
      class="vscode-button btn btn-primary mt-auto ml-auto"
      @click="deleteFilter()"
    >
      <span class="fa fa-trash"></span>
    </button>

    <b-modal :id="modalName" size="md" centered no-close-on-esc>
      <date-literals-value-entry-form
        v-if="['date', 'datetime'].includes(field.details.type)"
        ref="lookup-form"
        v-model="formValue"
      ></date-literals-value-entry-form>
      <template #modal-header="{ close }">
        <div
          class="d-flex w-100 justify-content-end"
          style="color: var(--vscode-input-foreground)"
        >
          <i class="fa fa-close fa-lg" @click="close()"></i>
        </div>
      </template>
      <template #modal-footer="{ close }">
        <button type="button" class="vscode-button btn btn-md" @click="close()">
          Close
        </button>
        <button
          type="button"
          class="vscode-button btn btn-md"
          @click="onClickInsert()"
        >
          Insert
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DateLiteralsValueEntryForm from '@/components/date-literals-value-entry-form'

export default {
  components: {
    DateLiteralsValueEntryForm,
  },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: null,
    },
    field: {
      type: Object,
      default: () => {},
    },
  },
  data: () => {
    return {
      filterEntry: null,
      formValue: null,
    }
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
    computedFilterEntry() {
      let computedFilterEntry
      switch (this.filterEntry.operator) {
        case '=':
          computedFilterEntry = `${this.field.name} = ${this.filterEntry.value}`
          break
        case '!=':
          computedFilterEntry = `${this.field.name} != ${this.filterEntry.value}`
          break
        case '<':
          computedFilterEntry = `${this.field.name} < ${this.filterEntry.value}`
          break
        case '>':
          computedFilterEntry = `${this.field.name} > ${this.filterEntry.value}`
          break
        case '<=':
          computedFilterEntry = `${this.field.name} <= ${this.filterEntry.value}`
          break
        case '>=':
          computedFilterEntry = `${this.field.name} >= ${this.filterEntry.value}`
          break
        case 'startsWith':
          computedFilterEntry = `${this.field.name} LIKE '${this.filterEntry.value}%'`
          break
        case 'endsWith':
          computedFilterEntry = `${this.field.name} LIKE '%${this.filterEntry.value}'`
          break
        case 'contains':
          computedFilterEntry = `${this.field.name} LIKE '%${this.filterEntry.value}%'`
          break
        case 'in':
          computedFilterEntry = `${this.field.name} IN (${this.filterEntry.value})`
          break
        case 'notIn':
          computedFilterEntry = `${this.field.name} NOT IN (${this.filterEntry.value})`
          break
        case 'includes':
          computedFilterEntry = `${this.field.name} INCLUDES (${this.filterEntry.value})`
          break
        case 'excludes':
          computedFilterEntry = `${this.field.name} EXCLUDES (${this.filterEntry.value})`
          break
        default:
          computedFilterEntry = null
      }
      return computedFilterEntry
    },
    modalName() {
      return `filter-entry-function${this.$vnode.key}`
    },
  },
  mounted() {
    this.filterEntry = { ...this.value }
  },
  methods: {
    deleteFilter() {
      this.$emit('deleteFilter', { filterIndex: this.index })
    },
    onChangeFilterEntry() {
      this.filterEntry.computed = this.computedFilterEntry
      this.$emit('input', this.filterEntry)
      this.$emit('change', this.filterEntry)
    },
    onClickUseFunctionButton() {
      this.$bvModal.show(this.modalName)
    },
    onClickInsert() {
      this.$refs['lookup-form'].$v.$touch()
      if (!this.$refs['lookup-form'].$v.$invalid) {
        this.filterEntry.value = this.formValue
        this.$bvModal.hide(this.modalName)
      }
    },
  },
}
</script>

<style scoped>
input,
select,
button {
  height: 30px !important;
}
</style>
