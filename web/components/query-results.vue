<template>
  <div class="d-flex flex-column">
    <div class="d-flex justify-content-between mb-2" style="height: 30px">
      <div class="mt-auto">

        <div v-if="queryErrors && queryErrors.length">
          <template v-for="(error, errorIndex) in queryErrors">
            <span :key="errorIndex">
              <label class="m-auto">{{ error.message }}</label>
            </span>
          </template>
        </div>

        <div v-else-if="showQueryResults">
          <i
            v-if="soqlResult.length"
            v-b-tooltip.hover
            :title="isDataTableExpanded ? 'Show Form' : 'Expand Table'"
            class="clickable-icon ml-auto fa fa-lg fa-expand-arrows-alt"
            @click="onClickExpandQueryResults"
          ></i>
          <label
            class="mb-0"
          >
            {{ soqlResult.length }} Results
          </label>
        </div>
        
        
      </div>

      <div class="ml-auto">
        <button
          v-if="isDataTableExpanded"
          :disabled="isRefreshingData"
          class="vscode-button btn btn-primary"
          @click="onClickRefreshData()"
        >
          Refresh
          <i v-if="isRefreshingData" class="fa fa-circle-o-notch fa-spin" />
        </button>
        <button
          v-if="showSaveChangesButton"
          v-shortkey="['ctrl', 's']"
          :disabled="isUpdatingRecords"
          class="vscode-button btn btn-primary"
          @click="onClickSaveChangesButton()"
          @shortkey="
            showSaveChangesButton && !isUpdatingRecords
              ? onClickSaveChangesButton()
              : null
          "
        >
          Save
          <i v-if="isUpdatingRecords" class="fa fa-circle-o-notch fa-spin" />
        </button>
        <button
          v-if="showExportDataButton"
          v-shortkey="['ctrl', 'e']"
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

    <transition name="fade">
      <div v-if="soqlResult && soqlResult.length" class="table-responsive">
        <table ref="table" class="table table-sm" @keyup.esc="onCancelChanges">
          <thead>
            <tr>
              <th
                v-if="showTableActionsColumn"
                class="soql-results-actions-column"
              />
              <th
                v-for="field in soqlResultFields"
                :key="field"
                class="w-auto text-nowrap"
                scope="col"
              >
                <div class="d-flex flex-column">
                  <div>{{ field }}</div>
                  <div class="field-type" v-if="configuration.fieldType.table && sobjectFieldsMappedByName[field] && sobjectFieldsMappedByName[field].type">
                    {{ sobjectFieldsMappedByName[field].type }}
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(record, recordIndex) in soqlResult"
              :key="recordIndex"
              :class="{ edited: editingRecords[record.Id] }"
              @click="onClickRow(recordIndex)"
            >
              <td
                v-if="showTableActionsColumn"
                class="soql-results-actions-column"
              >
                <div class="d-flex flex-column">
                  <button
                    v-if="editingRecords[record.Id]"
                    :disabled="isUpdatingRecords"
                    class="vscode-button btn btn-primary btn-sm table-button"
                    @click="onClickCancelChangesButton(record.Id, recordIndex)"
                  >
                    <span class="fa fa-times-circle fa-xs" />
                  </button>
                  <button
                    v-else
                    :disabled="isUpdatingRecords"
                    class="vscode-button btn btn-primary btn-sm table-button"
                    @click="onClickDeleteButton(record.Id, recordIndex)"
                  >
                    <span class="fa fa-trash fa-xs" />
                  </button>
                </div>
              </td>
              <template v-for="(value, fieldName, valueIndex) in record">
                <td
                  :key="valueIndex"
                  class="w-auto text-nowrap"
                  :class="{
                    'soql-result-table-cell':
                      sobjectFieldsMappedByName[fieldName] &&
                      sobjectFieldsMappedByName[fieldName].updateable,
                  }"
                >
                  <template v-if="typeof value === 'object' && value !== null">
                    <vue-json-pretty
                      v-if="configuration.nestedResults.style"
                      :data="value"
                      :show-line="false"
                      :deep="
                        configuration.nestedResults.expanded
                          ? configuration.nestedResults.depth
                            ? configuration.nestedResults.depth
                            : 1
                          : 0
                      "
                    >
                    </vue-json-pretty>
                    <pre v-else>{{
                      JSON.stringify(value, undefined, 2).replace(/^\s*/g, '')
                    }}</pre>
                  </template>
                  <template
                    v-else-if="
                      sobjectFieldsMappedByName[fieldName] &&
                      sobjectFieldsMappedByName[fieldName].updateable
                    "
                  >
                    <select
                      v-if="
                        sobjectFieldsMappedByName[fieldName].picklistValues
                          .length
                      "
                      :value="soqlResult[recordIndex][fieldName]"
                      :class="{ 'no-arrow': !showTableActionsColumn }"
                      :disabled="!showTableActionsColumn"
                      @input="
                        onTableInputChange(
                          $event,
                          record.Id,
                          recordIndex,
                          fieldName
                        )
                      "
                    >
                      <option></option>
                      <option
                        v-for="(
                          picklistValue, picklistValueIndex
                        ) in sobjectFieldsMappedByName[
                          fieldName
                        ].picklistValues.filter(
                          (picklistValue) => picklistValue.active
                        )"
                        :key="picklistValueIndex"
                        :value="picklistValue.value"
                      >
                        {{ picklistValue.label }}
                      </option>
                    </select>
                    <label
                      v-else-if="
                        sobjectFieldsMappedByName[
                          fieldName
                        ].type.toLowerCase() === 'boolean'
                      "
                      class="form-check-label custom-checkbox-container"
                    >
                      <input
                        :value="soqlResult[recordIndex][fieldName]"
                        :disabled="!showTableActionsColumn"
                        class="form-check-input"
                        type="checkbox"
                        @change="
                          onTableInputChange(
                            $event,
                            record.Id,
                            recordIndex,
                            fieldName
                          )
                        "
                      />
                      <span class="checkmark" />
                    </label>
                    <input
                      v-else
                      :disabled="!showTableActionsColumn"
                      :value="soqlResult[recordIndex][fieldName]"
                      type="text"
                      @input="
                        onTableInputChange(
                          $event,
                          record.Id,
                          recordIndex,
                          fieldName
                        )
                      "
                    />

                    <i
                      v-if="
                        showTableActionsColumn &&
                        !sobjectFieldsMappedByName[fieldName].picklistValues
                          .length &&
                        sobjectFieldsMappedByName[
                          fieldName
                        ].type.toLowerCase() !== 'boolean'
                      "
                      class="edit-icon fa fa-pencil"
                    ></i>
                  </template>
                  <p
                    v-else-if="
                      sobjectFieldsMappedByName[fieldName] &&
                      ['id', 'reference'].includes(
                        sobjectFieldsMappedByName[fieldName].type.toLowerCase()
                      )
                    "
                    class="record-id"
                    @click="onClickRecordId(value)"
                  >
                    {{ value }}
                  </p>
                  <p v-else>
                    {{ value }}
                  </p>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>

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
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import VueJsonPretty from 'vue-json-pretty'
import showToastMessage from '~/mixins/show-toast-message'

export default {
  components: {
    VueJsonPretty,
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
    showQueryResults:{
      type: Boolean,
      default: false
    },
    query: {
      type: String,
      default: '',
    },
    apiVersion: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      soqlResult: [],
      editingRecords: {},
      errors: [],
      isUpdatingRecords: false,
      isExportingData: false,
      isRefreshingData: false,
      recordIndex: null,
      showSaveChangesButton: false,
      isDataTableExpanded: false,
    }
  },
  watch: {
    value(newRecords) {
      if (newRecords && newRecords.length) {
        this.isRefreshingData = false
        this.soqlResult = [...newRecords]
      } else {
        this.soqlResult = []
      }

      this.editingRecords = {}
    },
    editingRecords: {
      deep: true,
      handler(newEditingRecords) {
        if (!Object.keys(newEditingRecords).length) {
          this.showSaveChangesButton = false
        } else {
          for (const recordId in newEditingRecords) {
            if (Object.keys(newEditingRecords[recordId]?.differences)?.length) {
              this.showSaveChangesButton = true
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
      getActiveEditorUsername: 'salesforce/getActiveEditorUsername',
    }),
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
    username() {
      return this.getActiveEditorUsername()
    },
    showExportDataButton() {
      return this.query && this.soqlResult && this.soqlResult.length
    },
    soqlResultFields() {
      return this.soqlResult && this.soqlResult[0]
        ? Object.keys(this.soqlResult[0])
        : []
    },
    showTableActionsColumn() {
      if (!this.soqlResultFields.includes('Id')) return false
      let isThereAnUpdateableField = false
      for (const fieldIndex in this.soqlResultFields) {
        const fieldName = this.soqlResultFields[fieldIndex]
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
    sobjectFieldsMappedByName() {
      return this.sobjectName
        ? this.getSObjectFieldsMappedByName({
            sobjectName: this.sobjectName,
            username: this.username,
          })
        : {}
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
    onClickRecordId(id) {
      this.showToastMessage(`Opening Record Id ${id}`)
      this.$axios
        .get(`${process.env.SALESFORCE_SERVER}/sfdx/open/record/${id}`)
        .then(() => {
          this.showToastMessage(`Record Id ${id} opened with Success.`)
        })
        .catch(() => {
          this.showToastMessage(`Record Id ${id} could not be opened.`)
        })
    },
    onClickCancelChangesButton(recordId, rowIndex) {
      this.soqlResult.splice(rowIndex, 1, this.editingRecords[recordId].record)
      delete this.editingRecords[recordId]
      this.soqlResult = [...this.soqlResult]
    },
    onCancelChanges() {
      const recordId = this.soqlResult[this.recordIndex].Id
      if (this.editingRecords[recordId]) {
        this.soqlResult.splice(
          this.recordIndex,
          1,
          this.editingRecords[recordId].record
        )
        delete this.editingRecords[recordId]
        this.editingRecords = { ...this.editingRecords }
      }
    },
    onClickDeleteButton(recordId, rowIndex) {
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
    onClickSaveChangesButton() {
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
    onTableInputChange(event, recordId, recordIndex, fieldName) {
      if (!this.editingRecords[recordId]) {
        this.editingRecords[recordId] = {
          record: { ...this.soqlResult[recordIndex] },
          rowIndex: recordIndex,
          differences: {},
        }
        this.editingRecords = { ...this.editingRecords }
      }

      const oldValue = this.editingRecords[recordId].record[fieldName]
      const newValue = event.target.value || null

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
    onClickRow(recordIndex) {
      this.recordIndex = recordIndex
    },
    onClickExportAsSourceTree() {
      this.isExportingData = true
      this.$axios
        .post(
          `${process.env.SALESFORCE_SERVER}/sfdx/export/sourcetree/${this.apiVersion}`,
          {
            soql: this.query,
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
  },
}
</script>

<style src="vue-json-pretty/lib/styles.css"></style>
<style scoped>
.table-button {
  width: 30px;
}

.soql-result-table-cell {
  position: relative;
}

.soql-result-table-cell:hover {
  background-color: rgba(var(--vscode-input-background), 0.8);
}

.soql-result-table-cell > div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  display: table;
  cursor: pointer;
}

.soql-result-table-cell > div:hover {
  opacity: 0.05;
  background-color: var(--vscode-menu-foreground);
}

.soql-results-actions-column {
  width: 40px !important;
  max-width: 40px !important;
}

.record-id {
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
}

.record-id:hover {
  text-decoration: underline !important;
}

table {
  background-color: var(--vscode-editor-background);
  color: var(--vscode-input-foreground);
}

table input,
table input:focus,
table select,
table select:focus {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  padding: 5px 5px;
  background-color: transparent !important;
}

table select:not(:disabled) {
  width: 100%;
}

table select option {
  background-color: var(--vscode-editor-background);
}

tr {
  height: 30px !important;
}

table td p {
  display: inline-block;
  vertical-align: middle;
  line-height: 30px;
  padding: 5px 5px !important;
}

table th,
table td {
  border-color: var(--vscode-inputOption-activeBackground);
}

table td:not(:first-child) {
  padding: 0px 5px !important;
  height: 30px;
  min-width: 200px;
}

table tr td:first-child {
  padding: 5px 5px !important;
}

table tr.edited td {
  border-bottom: thin solid var(--vscode-activityBarBadge-background);
}

/deep/ .vjs-tree {
  height: 100%;
}

/deep/ .vjs-tree.is-root > div:first-child {
  padding: 9px 0px;
}

select.no-arrow {
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
}

i.edit-icon {
  display: none;
}

td:hover i.edit-icon {
  display: block;
  position: absolute;
  top: 13px;
  right: 20px;
}
</style>
