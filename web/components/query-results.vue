<template>
  <div class="d-flex flex-column">
    <div class="d-flex justify-content-between mb-1" style="height: 30px">
      <div class="my-auto">
        <div v-if="queryErrors && queryErrors.length">
          <template v-for="(error, errorIndex) in queryErrors">
            <span :key="errorIndex">
              <label class="m-auto">{{ error.message }}</label>
            </span>
          </template>
        </div>
        <i
          v-if="areThereRecords"
          v-b-tooltip.hover
          v-shortkey="['ctrl', 'alt', 't']"
          :title="isDataTableExpanded ? 'Show Form' : 'Expand Table'"
          class="clickable-icon ml-auto mr-1 fa fa-lg fa-expand-arrows-alt"
          @click="onClickExpandQueryResults"
          @shortkey="onClickExpandQueryResults"
        ></i>
      </div>

      <div class="ml-auto">
        <button
          v-if="areThereRecords"
          class="vscode-button btn"
          @click="onClickNewRecord"
        >
          New Record
        </button>
        <button
          v-if="isDataTableExpanded"
          :disabled="isRefreshingData"
          class="vscode-button btn btn-primary"
          @click="onClickRefreshData()"
        >
          Refresh
          <i v-if="isRefreshingData" class="fa fa-circle-o-notch fa-spin" />
        </button>
        <template v-if="areThereChanges">
          <button
            v-shortkey="['ctrl', 'shift', 's']"
            :disabled="isUpdatingRecords"
            class="vscode-button btn btn-primary"
            @click="onClickSaveChangesButton()"
            @shortkey="
              areThereChanges && !isUpdatingRecords
                ? onClickSaveChangesButton()
                : null
            "
          >
            Save
            <i v-if="isUpdatingRecords" class="fa fa-circle-o-notch fa-spin" />
          </button>
          <button
            v-shortkey="['ctrl', 'shift', 'c']"
            :disabled="isUpdatingRecords"
            class="vscode-button btn btn-primary"
            @click="onClickCancelAllChangesButton()"
            @shortkey="
              areThereChanges && !isUpdatingRecords
                ? onClickCancelAllChangesButton()
                : null
            "
          >
            Cancel
          </button>
        </template>

        <button
          v-if="showExportDataButton"
          v-shortkey="['ctrl', 'shift', 'd']"
          :disabled="isExportingData"
          class="vscode-button btn btn-primary"
          @shortkey="
            showExportDataButton && !isExportingData
              ? onClickExportAsSourceTree()
              : null
          "
          @click="
            showExportDataButton && !isExportingData
              ? onClickExportAsSourceTree()
              : null
          "
        >
          Export
          <i v-if="isExportingData" class="fa fa-circle-o-notch fa-spin" />
        </button>
      </div>
    </div>

    <custom-table
      :value="pageRecords"
      :fields="fields"
      :username="username"
      :fields-mapped-by-name="sobjectFieldsMappedByName"
      :picklist-values-mapped-by-field="picklistValuesMappedByField"
      :editing-records="editingRecords"
      @cancelRecordChanges="onCancelRecordChanges"
      @deleteRecord="onDeleteRecord"
      @saveRecordChanges="onSaveRecordChanges"
      @change="onRecordChange"
      @sort="onSort"
    >
    </custom-table>

    <!-- UPDATE AND DELETE ERRORS MODAL -->
    <b-modal
      :id="errorsModalId"
      size="xl"
      title="Errors"
      centered
      cancel-disabled
    >
      <template #modal-header>
        <div
          class="d-flex w-100 justify-content-between"
          style="color: var(--vscode-input-foreground)"
        >
          <span>Errors</span>
          <i class="fa fa-close fa-lg" @click="onCloseErrorsModal()"></i>
        </div>
      </template>

      <div style="overflow-y: auto; max-height: 400px">
        <ol>
          <li v-for="(errors, index) in errors" :key="index">
            <p v-if="errors.recordId">{{ errors.recordId }}</p>
            <ul>
              <li
                v-for="(recordError, indexError) in errors.recordErrors"
                :key="indexError"
              >
                {{ recordError.statusCode }} {{ recordError.message }}
                {{
                  recordError.fields && recordError.fields.length
                    ? recordError.fields
                    : ''
                }}
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <template #modal-footer>
        <button
          type="button"
          class="vscode-button btn btn-md danger"
          @click="onCloseErrorsModal()"
        >
          Close
        </button>
      </template>
    </b-modal>

    <pagination
      v-if="soqlResult && soqlResult.length"
      v-model="page"
      :records="soqlResult.length"
      :per-page="pageSize"
      @paginate="onPageSelected"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Pagination from 'vue-pagination-2'
import CustomTable from '@/components/custom-table'
import showToastMessage from '~/mixins/show-toast-message'

export default {
  components: {
    Pagination,
    CustomTable,
  },
  mixins: [showToastMessage],
  props: {
    editorName: {
      type: String,
      default: null,
      required: true,
    },
    sobjectName: {
      type: String,
      default: '',
    },
    queryErrors: {
      type: Array,
      default: () => [],
    },
    showQueryResults: {
      type: Boolean,
      default: false,
    },
    query: {
      type: String,
      default: '',
    },
    apiVersion: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      default: null,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      page: 1,
      pageSize: 20,
      pageRecords: [],
      soqlResult: [],
      editingRecords: {},
      errors: [],
      isUpdatingRecords: false,
      isExportingData: false,
      isRefreshingData: false,
      selectedRowIndex: null,
      areThereChanges: false,
      isDataTableExpanded: false,
      picklistValuesMappedByField: {},
      fields: [],
      curCol: null,
      nxtCol: null,
      pageX: null,
      nxtColWidth: null,
      curColWidth: null,
      addedColumnDivs: false,
    }
  },
  watch: {
    value(newRecords) {
      if (newRecords && newRecords.length) {
        newRecords.forEach((record, index) => (record._index = index))
        this.isRefreshingData = false
        this.soqlResult = [...newRecords]
        this.fields = Object.keys(newRecords[0])
        this.pageRecords = [...newRecords.slice(0, this.pageSize)]
        this.fields.forEach((fieldName) => {
          const fieldDetails = this.sobjectFieldsMappedByName[fieldName]
          if (
            fieldDetails?.picklistValues?.length &&
            !this.picklistValuesMappedByField[fieldName]
          ) {
            this.picklistValuesMappedByField[
              fieldName
            ] = fieldDetails.picklistValues.filter(
              (picklistValue) => picklistValue.active
            )
          }
        })
      } else {
        this.fields = []
        this.picklistValuesMappedByField = {}
        this.soqlResult = []
        this.pageRecords = []
      }
      this.page = 1
      this.selectedRowIndex = null
      this.editingRecords = {}
    },
    editingRecords: {
      deep: true,
      handler(newEditingRecords) {
        if (!Object.keys(newEditingRecords).length) {
          this.areThereChanges = false
        } else {
          for (const recordId in newEditingRecords) {
            if (Object.keys(newEditingRecords[recordId]?.differences)?.length) {
              this.areThereChanges = true
              break
            }
          }
        }
      },
    },
  },
  computed: {
    ...mapGetters({
      getSObjectFieldsMappedByName: 'salesforce/getSObjectFieldsMappedByName',
      getSObjectKeyPrefix: 'salesforce/getSObjectKeyPrefix',
    }),
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
    sobjectFieldsMappedByName() {
      return this.getSObjectFieldsMappedByName({
        sobjectName: this.sobjectName,
        username: this.username,
      })
    },
    areThereRecords() {
      return this.soqlResult && this.soqlResult.length
    },
    showExportDataButton() {
      return this.query && this.areThereRecords
    },
    showTableActionsColumn() {
      if (!this.fields.includes('Id')) return false
      let isThereAnUpdateableField = false
      for (const fieldIndex in this.fields) {
        const fieldName = this.fields[fieldIndex]
        if (
          this.sobjectFieldsMappedByName[fieldName] &&
          this.sobjectFieldsMappedByName[fieldName].updateable
        ) {
          isThereAnUpdateableField = true
          break
        }
      }
      return isThereAnUpdateableField
    },
    errorsModalId() {
      return `errors-modal${this.editorName}`
    },
  },
  methods: {
    ...mapActions({
      deleteRecord: 'salesforce/deleteRecord',
      updateRecords: 'salesforce/updateRecords',
    }),
    onCancelRecordChanges(rowIndex) {
      const recordId = this.soqlResult[rowIndex].Id
      this.soqlResult.splice(rowIndex, 1, this.editingRecords[recordId].record)
      this.onPageSelected(this.page)
      delete this.editingRecords[recordId]
      this.editingRecords = { ...this.editingRecords }
    },
    onClickCancelAllChangesButton() {
      this.soqlResult.forEach((soqlResult) => {
        const editingRecord = this.editingRecords[soqlResult.Id]
        if (editingRecord) {
          this.soqlResult.splice(
            editingRecord.rowIndex,
            1,
            editingRecord.record
          )
          this.onPageSelected(this.page)
        }
      })
      this.editingRecords = {}
    },
    onDeleteRecord(rowIndex) {
      const recordId = this.soqlResult[rowIndex].Id
      this.$bvModal
        .msgBoxConfirm('Are you sure you want to delete this record?', {
          centered: true,
        })
        .then((value) => {
          if (value === true) {
            this.deleteRecord({
              recordId,
              sobjectName: this.sobjectName,
              apiVersion: this.apiVersion,
              username: this.username,
            })
              .then(() => {
                this.$delete(this.soqlResult, rowIndex)
                this.soqlResult.forEach(
                  (record, index) => (record._index = index)
                )
                this.onPageSelected(this.page)
                this.showToastMessage(
                  `The Record [${recordId}] has been deleted.`
                )
              })
              .catch((error) => {
                this.errors.push({
                  isUpdate: false,
                  recordId,
                  recordErrors: [...error.response.data],
                })
                this.$bvModal.show(this.errorsModalId)
              })
          }
        })
    },
    onSaveRecordChanges() {
      this.isUpdatingRecords = true
      this.$emit('updatingRecords', true)
      const recordsToUpdate = []
      for (const recordId in this.editingRecords) {
        const editingRecordDifferences = this.editingRecords[recordId]
          .differences
        if (Object.keys(editingRecordDifferences).length) {
          recordsToUpdate.push({
            ...editingRecordDifferences,
            id: recordId,
            attributes: { type: this.sobjectName },
          })
        }
      }

      this.updateRecords({
        changes: recordsToUpdate,
        apiVersion: this.apiVersion,
        username: this.username,
      })
        .then((batches) => {
          batches.data.forEach((responses) => {
            responses.forEach((updatedRecordResponse, recordIndex) => {
              if (!updatedRecordResponse.success) {
                this.errors.push({
                  isUpdate: true,
                  recordId: this.soqlResult[recordIndex].Id,
                  recordErrors: updatedRecordResponse.errors,
                })
              } else {
                delete this.editingRecords[updatedRecordResponse.id]
                this.editingRecords = { ...this.editingRecords }
              }
            })
          })

          if (this.errors.length) this.$bvModal.show(this.errorsModalId)
        })
        .catch(() => {
          this.showToastMessage('Could not update records')
        })
        .finally(() => {
          this.$emit('recordsUpdated')
          this.isUpdatingRecords = false
          this.$emit('updatingRecords', false)
        })
    },
    onRecordChange({ value, recordId, recordIndex, fieldName }) {
      if (!this.editingRecords[recordId]) {
        this.editingRecords[recordId] = {
          record: { ...this.soqlResult[recordIndex] },
          rowIndex: recordIndex,
          differences: {},
        }
        this.editingRecords = { ...this.editingRecords }
      }
      const oldValue = this.editingRecords[recordId].record[fieldName]
      const newValue = typeof value === 'boolean' ? value : value || null
      if (oldValue != newValue) {
        this.editingRecords[recordId].differences[fieldName] = newValue
      } else {
        delete this.editingRecords[recordId].differences[fieldName]
        if (!Object.keys(this.editingRecords[recordId].differences).length)
          delete this.editingRecords[recordId]
        this.editingRecords = { ...this.editingRecords }
      }
      this.soqlResult[recordIndex][fieldName] = newValue
    },
    onCloseErrorsModal() {
      this.errors = []
      this.$bvModal.hide(this.errorsModalId)
    },
    onClickRow(rowIndex) {
      this.selectedRowIndex = rowIndex
    },
    onClickExportAsSourceTree() {
      this.isExportingData = true
      this.$axios
        .post(
          `${process.env.SALESFORCE_SERVER}/sfdx/export/sourcetree/${this.apiVersion}`,
          {
            soql: this.query,
            username: this.username,
          }
        )
        .then(() => this.showToastMessage('Data exported with success.'))
        .catch(() => this.showToastMessage('Could not export data.'))
        .finally(() => {
          this.isExportingData = false
        })
    },
    onClickExpandQueryResults() {
      this.isDataTableExpanded = !this.isDataTableExpanded
      this.$emit('expandDataTable')
    },
    onClickRefreshData() {
      this.isRefreshingData = true
      this.$emit('refreshData')
    },
    onPageSelected(page) {
      const start = this.pageSize * (page - 1)
      this.pageRecords = this.soqlResult.slice(start, start + this.pageSize)
    },
    onSort(sort) {
      this.soqlResult.sort(alphabetically(sort.order === 'asc', sort.field))
      this.soqlResult.forEach((record, index) => (record._index = index))
      this.onPageSelected(this.page)
    },
    onClickNewRecord() {
      const sobjectKeyPrefix = this.getSObjectKeyPrefix({
        sobjectName: this.sobjectName,
        username: this.username,
      })

      if (sobjectKeyPrefix) {
        this.showToastMessage('Opening New Record Page')
        this.$axios
          .post(`${process.env.SALESFORCE_SERVER}/sfdx/record/new`, {
            sobjectKeyPrefix,
            username: this.username,
          })
          .then(() => {
            this.showToastMessage(`New Record Page opened with Success.`)
          })
          .catch(() => {
            this.showToastMessage(`New Record Page could not be opened.`)
          })
      } else {
        this.showToastMessage('Could not find the SObject Key Prefix')
      }
    },
  },
}

function alphabetically(ascending, field) {
  return function (a, b) {
    if (a[field] === b[field]) {
      return 0
    } else if (a[field] === null) {
      return 1
    } else if (b[field] === null) {
      return -1
    } else if (ascending) {
      return a[field] < b[field] ? 1 : -1
    } else {
      return a[field] < b[field] ? -1 : 1
    }
  }
}
</script>

<style scoped>
.fa-expand-arrows {
  font-size: 20px;
}
</style>
