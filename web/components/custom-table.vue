<template>
  <div v-if="pageRecords && pageRecords.length" class="table-responsive">
    <table ref="table" class="table table-sm" @keyup.esc="onCancelChanges">
      <thead>
        <tr>
          <th
            v-if="showTableActionsColumn"
            class="soql-results-actions-column"
          />
          <th
            v-for="field in fields.filter((field) => field !== '_index')"
            :key="field"
            class="w-auto text-nowrap"
            style="position: relative"
            scope="col"
            @click="onClickSortBy(field)"
          >
            <div class="d-flex">
              <div class="d-flex flex-column">
                <div>{{ field }}</div>
                <div
                  v-if="
                    fieldsMappedByName[field] && configuration.fieldType.table
                  "
                  class="field-type"
                >
                  {{ fieldsMappedByName[field].type }}
                </div>
              </div>
              <i
                v-if="field === sort.field"
                class="sorted fa"
                :class="sortedByIconClass"
              ></i>
              <i v-else class="fa fa-sort-up"></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="record in pageRecords"
          :key="record._index"
          :class="{ edited: editingRecords && editingRecords[record.Id] }"
          @click="onClickRow(record._index)"
        >
          <td v-if="showTableActionsColumn" class="soql-results-actions-column">
            <div class="d-flex flex-column">
              <button
                v-if="editingRecords && editingRecords[record.Id]"
                :disabled="isUpdatingRecords"
                class="vscode-button btn-primary btn-sm table-button"
                @click="onClickCancelChangesButton(record._index)"
              >
                <span class="fa fa-times-circle fa-xs" />
              </button>
              <button
                v-else
                :disabled="isUpdatingRecords"
                class="vscode-button btn-primary btn-sm table-button"
                @click="onClickDeleteButton(record._index)"
              >
                <span class="fa fa-trash fa-xs" />
              </button>
            </div>
          </td>
          <template v-for="(value, fieldName) in record">
            <custom-table-cell
              v-if="fieldName !== '_index'"
              :key="fieldName + record._index"
              :value="value"
              :record-id="record.Id"
              :record-index="record._index"
              :field-name="fieldName"
              :username="username"
              :is-updateable="
                fieldsMappedByName[fieldName] &&
                fieldsMappedByName[fieldName].updateable
              "
              :is-boolean="
                fieldsMappedByName[fieldName] &&
                fieldsMappedByName[fieldName].type.toLowerCase() === 'boolean'
              "
              :is-link="
                fieldsMappedByName[fieldName] &&
                ['id', 'reference'].includes(
                  fieldsMappedByName[fieldName].type.toLowerCase()
                )
              "
              :picklist-options="picklistValuesMappedByField[fieldName]"
              :is-disabled="!showTableActionsColumn"
              @change="onTableInputChange"
            >
            </custom-table-cell>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CustomTableCell from '@/components/custom-table-cell'

export default {
  components: {
    CustomTableCell,
  },
  props: {
    isUpdatingRecords: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    fieldsMappedByName: {
      type: Object,
      default: () => {},
    },
    picklistValuesMappedByField: {
      type: Object,
      default: () => {},
    },
    editingRecords: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Array,
      default: () => [],
    },
    username: {
      type: String,
      default: null,
    },
  },
  data: () => {
    return {
      pageRecords: [],
      selectedRowIndex: null,
      sort: {
        field: null,
        order: null,
      },
    }
  },
  watch: {
    value: {
      deep: true,
      handler(newValue) {
        this.pageRecords = [...newValue]
      },
    },
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
    showTableActionsColumn() {
      if (!this.fields.includes('Id')) return false
      let isThereAnUpdateableField = false
      for (const fieldIndex in this.fields) {
        const fieldName = this.fields[fieldIndex]
        if (
          this.fieldsMappedByName[fieldName] &&
          this.fieldsMappedByName[fieldName].updateable
        ) {
          isThereAnUpdateableField = true
          break
        }
      }
      return isThereAnUpdateableField
    },
    sortedByIconClass() {
      return this.sort.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
    },
  },
  methods: {
    onClickCancelChangesButton(rowIndex) {
      this.$emit('cancelRecordChanges', rowIndex)
    },
    onCancelChanges() {
      this.$emit('cancelRecordChanges', this.selectedRowIndex)
    },
    onClickDeleteButton(rowIndex) {
      this.$emit('deleteRecord', rowIndex)
    },
    onClickSaveChangesButton() {
      this.$emit('saveRecordChanges')
    },
    onTableInputChange({ value, recordId, recordIndex, fieldName }) {
      this.$emit('change', { value, recordId, recordIndex, fieldName })
    },
    onClickRow(rowIndex) {
      this.selectedRowIndex = rowIndex
    },
    onClickSortBy(field) {
      this.sort.field = field
      const isAsc = this.sort.order === 'asc'
      this.sort.order = isAsc ? 'desc' : 'asc'
      this.$emit('sort', this.sort)
    },
  },
}
</script>

<style src="vue-json-pretty/lib/styles.css"></style>
<style scoped>
.table-button {
  width: 30px;
}

.soql-results-actions-column {
  width: 40px !important;
  max-width: 40px !important;
}

table {
  background-color: var(--vscode-editor-background);
  color: var(--vscode-input-foreground);
}

tr {
  height: 30px !important;
}

table th,
table td {
  border-color: var(--vscode-inputOption-activeBackground);
}

table td:first-child {
  padding: 0.2rem !important;
  min-width: 40px;
}

table td {
  padding: 0px 5px !important;
  min-width: 200px;
}

table tr.edited td {
  border-bottom: thin solid var(--vscode-activityBarBadge-background);
}

th {
  cursor: pointer;
}

th i.fa {
  padding-left: 10px;
  font-size: 15px;
  position: relative;
}

th:hover i.fa.fa-sort-up {
  visibility: visible;
}

th i.fa.fa-sort-up {
  visibility: hidden;
  top: 5px;
}

th i.fa.fa-sort-down {
  top: -2px;
}

th i.fa.fa-sort-up.sorted,
th i.fa.fa-sort-down.sorted {
  visibility: visible;
}

.soql-results-actions-column button {
  padding: 5px;
}
</style>
