<template>
  <div class="h-100 w-100 mt-2">
    <div class="d-flex flex-column h-100">
      <!-- TOP MENU BAR -->
      <div class="container">
        <div class="d-flex justify-content-between mb-2">
          <div class="d-flex">
            <div
              v-if="configuration.displayEditor"
              v-b-tooltip.hover
              v-shortkey="['ctrl', 'r']"
              class="refresh-data-button fa fa-sync fa-xs my-auto mr-2"
              data-placement="top"
              title="Refresh Data"
              @click="onClickRefreshObjectsButton()"
              @shortkey="onClickRefreshObjectsButton()"
            ></div>
          </div>

          <button
            v-if="!isLicenseValid()"
            class="golden-btn ml-auto"
            @click="goToSignUp"
          >
            BUY PRO
          </button>
        </div>
      </div>

      <!-- QUERY BUILDER -->
      <div
        class="container"
        :class="showForm ? 'd-block' : 'd-none'"
        style="height: 395px"
      >
        <div class="row h-100">
          <div class="col-6 col-xl-4 pr-2">
            <b-tabs v-model="fieldsSourceTabIndex" no-fade>
              <!--  SOBJECT FIELDS TAB -->
              <b-tab title="Objects" active>
                <div class="d-flex flex-column mt-2" style="height: 317px">
                  <multiselect
                    v-model="selectedSObject"
                    class="mb-1"
                    :options="sobjects"
                    label="label"
                    track-by="name"
                    searcheable
                    :max-height="400"
                    select-label=""
                    deselect-label=""
                    placeholder=""
                    hide-selected
                    @input="onSelectSObject"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">{{
                      option.label + ' - ' + option.name
                    }}</template>
                    <span slot="noResult">Could not find the SObject</span>
                  </multiselect>
                  <fields
                    ref="sobject-fields"
                    :sobject-name="sobjectName"
                    :sobject-fields="sobjectFields"
                    :selected-fields="selectedFields"
                    @selectFieldReference="onSelectFieldReference"
                    @insertField="onInsertField"
                    @insertAllFields="onInsertAllFields"
                    @clearAllFields="onClearAllSObjectFields"
                  >
                  </fields>
                </div>
              </b-tab>

              <!--  CHILD RELATIONSHIP FIELDS TAB -->
              <b-tab
                title="Child Relationships"
                :disabled="
                  !sobjectName ||
                  !sobjectChildRelationships ||
                  !sobjectChildRelationships.length
                "
              >
                <div class="d-flex flex-column mt-2" style="height: 317px">
                  <multiselect
                    v-model="selectedSObjectChildRelationship"
                    class="mb-1"
                    :options="sobjectChildRelationships"
                    label="relationshipName"
                    track-by="field"
                    searcheable
                    :max-height="400"
                    select-label=""
                    deselect-label=""
                    placeholder=""
                    hide-selected
                    @select="onSelectSObjectChildRelationship"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      <div class="d-flex">
                        <div>
                          {{ option.relationshipName }} [{{
                            option.childSObject
                          }}]
                        </div>
                      </div>
                    </template>
                    <template slot="option" slot-scope="{ option }">
                      <div class="d-flex">
                        <div>
                          {{ option.relationshipName }} [{{
                            option.childSObject
                          }}]
                        </div>
                      </div>
                    </template>
                    <span slot="noResult"
                      >Could not find the Child Relationship</span
                    >
                  </multiselect>
                  <fields
                    ref="child-relationship-fields"
                    :sobject-name="sobjectChildRelationshipName"
                    :sobject-fields="sobjectChildRelationshipFields"
                    :selected-fields="selectedFields"
                    @selectFieldReference="onSelectFieldReference"
                    @insertField="onInsertField"
                    @insertAllFields="onInsertAllFields"
                    @clearAllFields="onClearAllSObjectFields"
                  >
                  </fields>
                </div>
              </b-tab>
            </b-tabs>
          </div>
          <div class="col-6 col-xl-8 pl-0">
            <selected-fields
              ref="selected-fields"
              class="h-100"
              :selected-fields="selectedFields"
              @clearAllFields="onClearAllFields"
              @insertField="onInsertField"
              @selectField="onSelectFieldToEdit"
            >
            </selected-fields>
          </div>
        </div>
      </div>

      <!-- QUERY EDITOR -->
      <div class="container mb-3">
        <div class="row">
          <div class="col-12">
            <div class="row mb-2">
              <div class="col mt-auto">
                <label>Enter or modify your Query below:</label>
              </div>
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto pl-0" style="margin-top: 26px">
                    <button
                      v-if="!configuration.format.automatically"
                      class="vscode-button btn btn-primary"
                      :disabled="disableTextAreaActionButtons"
                      @click="onClickFormatQueryButton()"
                    >
                      Format
                    </button>
                  </div>
                  <div v-if="showForm" class="col-auto pl-0">
                    <label for="limit-input">Limit:</label>
                    <input
                      id="limit-input"
                      v-model="soql.limit"
                      type="number"
                      class="form-control"
                      style="width: 100px !important"
                      min="0"
                    />
                  </div>
                  <div v-if="showForm" class="col-auto pl-0">
                    <label for="offset-input">Offset:</label>
                    <input
                      id="offset-input"
                      v-model="soql.offset"
                      type="number"
                      class="form-control"
                      style="width: 100px !important"
                      min="0"
                      max="2000"
                    />
                  </div>
                  <div class="col-auto pl-0">
                    <label for="api-version-input">API:</label>
                    <select
                      id="api-version-input"
                      v-model="apiVersion"
                      class="form-control"
                      style="width: 70px"
                      @change="onSelectApiVersion"
                    >
                      <option
                        v-for="(apiVersion, index) in apiVersions"
                        :key="index"
                        :value="'v' + apiVersion"
                      >
                        {{ apiVersion }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <query-editor v-model="soqlText"></query-editor>
              </div>
            </div>
            <div class="row mt-2 justify-content-between">
              <div class="col-auto">
                <button
                  v-shortkey="isExecutingSOQL ? ['ctrl', 'c'] : ['ctrl', 'r']"
                  class="vscode-button btn btn-primary"
                  :disabled="
                    isExecutingSOQLPlan ||
                    isUpdatingRecords ||
                    isExportingData ||
                    !soqlText
                  "
                  @shortkey="
                    isExecutingSOQL
                      ? onClickCancelRequest()
                      : onClickExecuteQueryButton()
                  "
                  @click="
                    isExecutingSOQL
                      ? onClickCancelRequest()
                      : onClickExecuteQueryButton()
                  "
                >
                  {{ isExecutingSOQL ? 'Cancel' : 'Execute' }}
                  <i
                    v-if="isExecutingSOQL"
                    class="fa fa-circle-o-notch fa-spin"
                  />
                </button>
                <button
                  :disabled="
                    isExecutingSOQL ||
                    isUpdatingRecords ||
                    isExportingData ||
                    !soqlText
                  "
                  class="vscode-button btn btn-primary"
                  @click="
                    isExecutingSOQLPlan
                      ? onClickCancelRequest()
                      : onClickQueryPlanButton()
                  "
                >
                  {{ isExecutingSOQLPlan ? 'Cancel' : 'Query Plan' }}
                  <i
                    v-if="isExecutingSOQLPlan"
                    class="fa fa-circle-o-notch fa-spin"
                  />
                </button>
                <button
                  v-if="isLicenseValid()"
                  :disabled="disableTextAreaActionButtons"
                  class="vscode-button btn btn-primary"
                  @click="setEditorSOQL()"
                >
                  {{ isUpdatingQuery ? 'Update SOQL' : 'Add SOQL' }}
                </button>
              </div>
              <div class="col-auto">
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
                  <i
                    v-if="isUpdatingRecords"
                    class="fa fa-circle-o-notch fa-spin"
                  />
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
                  <i
                    v-if="isExportingData"
                    class="fa fa-circle-o-notch fa-spin"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SOQL PLAN -->
      <div v-if="showSOQLPlanResults" class="container">
        <div class="row">
          <div class="col">
            <div class="table-responsive mb-0">
              <table class="table table-dark table-sm table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Cardinality</th>
                    <th scope="col">Fields</th>
                    <th scope="col">Leading Operation Type</th>
                    <th scope="col">Cost</th>
                    <th scope="col">SObject Cardinality</th>
                    <th scope="col">SObject Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(plan, index) in soqlPlan" :key="index">
                    <td>{{ plan.cardinality }}</td>
                    <td>
                      <span
                        v-for="(field, indexField) in plan.fields"
                        :key="indexField"
                        >{{ field }}<br
                      /></span>
                    </td>
                    <td>{{ plan.leadingOperationType }}</td>
                    <td>{{ plan.relativeCost }}</td>
                    <td>{{ plan.sobjectCardinality }}</td>
                    <td>{{ plan.sobjectType }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <div
              class="p-2"
              style="
                border: thin solid var(--vscode-badge-background);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
              "
            >
              <p
                style="
                  border-bottom: thin slid var(--vscode-badge-background) !important;
                "
              >
                <b>Notes:</b>
              </p>
              <span v-for="(plan, index) in soqlPlan" :key="index">
                <li v-for="(note, indexNote) in plan.notes" :key="indexNote">
                  {{ note.description }}. Table:
                  {{ note.tableEnumOrId }} Fields: {{ note.fields }}
                </li>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- NUMBER OF RECORDS -->
      <label v-if="soqlResult" class="container"
        >{{ soqlResult.length }} Results</label
      >

      <!-- RECORDS -->
      <div
        v-if="isSoqlResultsNotEmpty"
        class="container flex-grow-1"
        style="overflow: auto; display: inline-block"
      >
        <div class="table-responsive">
          <table ref="table" class="table table-dark table-sm table-bordered">
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
                  {{ getFieldName(field) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, recordIndex) in soqlResult"
                :key="recordIndex"
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
                      @click="
                        onClickCancelChangesButton(record.Id, recordIndex)
                      "
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
                    @dblclick="
                      !editingRecords[record.Id] &&
                      record.Id &&
                      sobjectFieldsMappedByName[fieldName] &&
                      sobjectFieldsMappedByName[fieldName].updateable
                        ? onDoubleClickTableCell(record.Id, recordIndex)
                        : null
                    "
                  >
                    <template
                      v-if="typeof value === 'object' && value !== null"
                    >
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
                        JSON.stringify(value, undefined, 2).replace(
                          /^\s*/g,
                          ''
                        )
                      }}</pre>
                    </template>
                    <span
                      v-else-if="
                        sobjectFieldsMappedByName[fieldName] &&
                        ['id', 'reference'].includes(
                          sobjectFieldsMappedByName[
                            fieldName
                          ].type.toLowerCase()
                        )
                      "
                      class="record-id"
                      @click="onClickRecordId(value)"
                    >
                      {{ value }}
                    </span>
                    <span
                      v-else-if="
                        sobjectFieldsMappedByName[fieldName] &&
                        sobjectFieldsMappedByName[fieldName].updateable
                      "
                    >
                      <template v-if="editingRecords[record.Id]">
                        <select
                          v-if="
                            sobjectFieldsMappedByName[fieldName]
                              .picklistValues.length
                          "
                          v-model="soqlResult[recordIndex][fieldName]"
                          @change="
                            onTableInputChange(
                              record.Id,
                              recordIndex,
                              fieldName
                            )
                          "
                        >
                          <option value=""></option>
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
                            v-model="soqlResult[recordIndex][fieldName]"
                            class="form-check-input"
                            type="checkbox"
                            @change="
                              onTableInputChange(
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
                          v-model="soqlResult[recordIndex][fieldName]"
                          type="text"
                          @keyup="
                            onTableInputChange(
                              record.Id,
                              recordIndex,
                              fieldName
                            )
                          "
                        />
                      </template>
                      <span v-else>{{ value }}</span>
                    </span>
                    <span v-else>
                      {{ value }}
                    </span>
                    <div
                      v-if="
                        !editingRecords[record.Id] &&
                        sobjectFieldsMappedByName[fieldName] &&
                        sobjectFieldsMappedByName[fieldName].updateable
                      "
                    ></div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- QUERY ERRORS -->
      <div v-if="errors && errors.length" class="container">
        <template v-for="(error, errorIndex) in errors">
          <span :key="errorIndex">
            <label class="m-auto">{{ error.message }}</label>
          </span>
        </template>
      </div>
    </div>

    <!-- RELATIONSHIP SELECTOR -->
    <b-modal
      :id="relationshipSelectorModalId"
      :title="`${selectedReference}:${selectedReferenceName}`"
      size="xl"
      centered
      cancel-disabled
    >
      <relationship-selector
        ref="relationship-selector"
        :sobject-name="focusedReference"
        :reference-name="selectedReference"
        :reference-value="selectedReferenceName"
        :selected-fields="selectedFields"
        @removeField="onRemoveRelationshipField"
        @insertField="onInsertRelationshipField"
        @insertAllFields="onInsertAllRelationshipFields"
        @clearAllFields="onClearAllRelationshipFields"
      />
      <template #modal-header="{ close }">
        <div
          class="d-flex w-100 justify-content-between"
          style="color: var(--vscode-input-foreground)"
        >
          <span>{{ selectedReference + ': ' + selectedReferenceName }}</span>
          <i class="fa fa-close fa-lg" @click="close()"></i>
        </div>
      </template>
      <template #modal-footer="{ close }">
        <button
          type="button"
          class="vscode-button btn btn-md"
          @click="close()"
        >
          Close
        </button>
      </template>
    </b-modal>

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

    <field-form
      v-if="selectedField"
      ref="fieldForm"
      v-model="selectedField"
      :soql="soql"
      @change="onSelectedFieldChange"
      @deleteField="onDeleteSelectedField"
      @close="onCloseFieldForm"
    >
    </field-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import FieldForm from '@/components/field-form.vue'
import RelationshipSelector from '@/components/relationship-selector.vue'
import Fields from '@/components/fields.vue'
import SelectedFields from '@/components/selected-fields.vue'
import Loading from '@/components/loading.vue'
import QueryEditor from '@/components/query-editor.vue'

import { decode } from 'html-entities'
import sqlFormatter from '@allanoricil/sql-formatter'
import { parseQuery } from 'soql-parser-js'
import VueJsonPretty from 'vue-json-pretty'
import { removeKeys } from '~/assets/js/utils/objectUtils.js'

export default {
  name: 'Editor',
  components: {
    RelationshipSelector,
    Loading,
    VueJsonPretty,
    Fields,
    SelectedFields,
    FieldForm,
    QueryEditor
  },
  props: {
    name: {
      type: String,
      default: null,
      required: true,
    },
    editingSOQL: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      soqlText: null,
      selectedSObject: null,
      selectedSObjectChildRelationship: null,
      selectedField: null,
      fieldsSourceTabIndex: 0,
      sobjectName: null,
      sobjectChildRelationshipName: null,
      parsedSOQL: null,
      apiVersion: 'v50.0',
      soql: {
        sobjects: {},
        limit: null,
        offset: null,
      },
      soqlResult: null,
      soqlPlan: null,
      errors: [],
      selectedReference: null,
      selectedReferenceName: null,
      sobjectFields: [],
      sobjectChildRelationshipFields: [],
      showForm: true,
      isExecutingSOQL: false,
      isExecutingSOQLPlan: false,
      isUpdatingRecords: false,
      isExportingData: false,
      editingRecords: {},
      showSaveChangesButton: false,
    }
  },
  beforeMount() {
    window.addEventListener('keyup', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        this.showForm = this.configuration.displayEditor && !this.showForm
        event.preventDefault()
      }
    })
  },
  computed: {
    ...mapGetters({
      getQueryableSObjects: 'salesforce/getQueryableSObjects',
      getSObjectFields: 'salesforce/getSObjectFields',
      getSObjectFieldsMappedByName: 'salesforce/getSObjectFieldsMappedByName',
      getSObjectChildRelationships: 'salesforce/getSObjectChildRelationships',
      isLicenseValid: 'user/isLicenseValid',
      getConnectedEnvironments: 'salesforce/getConnectedEnvironments',
      getActiveEditorUsername: 'salesforce/getActiveEditorUsername',
    }),
    ...mapState({
      configuration: (state) => state.user.configuration,
      defautUsername: (state) => state.salesforce.defaultUsername,
      environments: (state) => state.salesforce.environments,
      editors: (state) => state.salesforce.editors,
      apiVersions: (state) => state.salesforce.apiVersions,
    }),
    sobjects() {
      return this.getQueryableSObjects({ username: this.username })
    },
    username() {
      return this.getActiveEditorUsername()
    },
    selectedFields() {
      const selectedFields = {}
      for (const [sobjectName, sobject] of Object.entries(this.soql.sobjects)) {
        if (!selectedFields[sobjectName]) selectedFields[sobjectName] = []
        for (const [fieldName, field] of Object.entries(sobject.fields)) {
          selectedFields[sobjectName].push(field)
        }
      }
      return selectedFields
    },
    sobjectChildRelationships() {
      return this.sobjectName && this.username
        ? this.getSObjectChildRelationships({
            sobjectName: this.sobjectName,
            username: this.username,
          })
        : []
    },
    getSObjectByName() {
      return this.$store.getters['sobjects/getSObjectByName']
    },
    sobjectFieldsMappedByName() {
      return this.sobjectName
        ? this.getSObjectFieldsMappedByName({
            sobjectName: this.sobjectName,
            username: this.username,
          })
        : {}
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
    showExportDataButton() {
      return this.soqlText && this.isSoqlResultsNotEmpty
    },
    disableTextAreaActionButtons() {
      return (
        !this.soqlText ||
        this.isExecutingSOQL ||
        this.isExecutingSOQLPlan ||
        this.isUpdatingRecords ||
        this.isExportingData
      )
    },
    isSoqlResultsNotEmpty() {
      return this.soqlResult && this.soqlResult.length
    },
    isUpdatingQuery() {
      return this.editingSOQL && this.editingSOQL.start !== this.editingSOQL.end
    },
    showSOQLPlanResults() {
      return this.soqlPlan && this.soqlPlan.length > 0
    },
    relationshipSelectorModalId() {
      return `relationship-selector-modal${this.name}`
    },
    errorsModalId() {
      return `errors-modal${this.name}`
    },
    focusedReference() {
      return this.fieldsSourceTabIndex === 0
        ? this.sobjectName
        : this.sobjectChildRelationshipName
    },
  },
  watch: {
    editingSOQL(newEditingSOQL) {
      this.soql = {
        sobjects: {},
        limit: null,
        offset: null,
      }
      this.selectedSObject = null
      this.selectedSObjectChildRelationship = null
      if (newEditingSOQL?.soql) {
        this.soqlText = newEditingSOQL.soql
          .replace('[', '')
          .replace(']', '')
          .replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ')
          .replace(/\s+$/, '')
        this.parsedSOQL = parseQuery(this.soqlText)
        this.sobjectName = this.parsedSOQL.sObject
        if (this.configuration.format.automatically)
          sqlFormatter.format(this.soqlText)
        this.onClickExecuteQueryButton()
      }
    },
    soql() {
      this.makeSOQL()
    },
    'selectedField.field'() {
      this.makeSOQL()
    },
  },
  methods: {
    ...mapActions({
      fetchSObjectFields: 'salesforce/fetchSObjectFields',
      fetchSOQLAndSObject: 'salesforce/fetchSOQLAndSObject',
      fetchSObjects: 'salesforce/fetchSObjects',
      cancelRequest: 'salesforce/cancelRequest',
      deleteRecord: 'salesforce/deleteRecord',
      updateRecords: 'salesforce/updateRecords',
      fetchSOQLPlan: 'salesforce/fetchSOQLPlan',
    }),
    ...mapMutations({
      setApiVersion: 'salesforce/setApiVersion',
      setEditorLoadingState: 'salesforce/setEditorLoadingState',
    }),
    onSelectApiVersion(event) {
      this.apiVersion = event.target.value
      this.setApiVersion(this.apiVersion)
    },
    onSelectSObject(sobject) {
      this.soql = {
        sobjects: {},
        limit: null,
        offset: null,
      }
      this.sobjectName = sobject.name
      this.selectedSObjectChildRelationship = null
      this.sobjectChildRelationshipFields = []
      this.sobjectFields = [
        ...this.getSObjectFields({
          sobjectName: this.sobjectName,
          username: this.username,
        }),
      ]
      if (!this.sobjectFields.length) {
        this.fetchSObjectFields({
          sobjectName: this.sobjectName,
          apiVersion: this.apiVersion,
          username: this.username,
        }).then(() => {
          this.sobjectFields = [
            ...this.getSObjectFields({
              sobjectName: this.sobjectName,
              username: this.username,
            }),
          ]
        }).catch(() => {
          this.showToastMessage('Could not fetch sobject fields')
        })
      }
    },
    onSelectSObjectChildRelationship({ childSObject, relationshipName }) {
      this.sobjectChildRelationshipName = relationshipName
      if (childSObject) {
        this.sobjectChildRelationshipFields = [
          ...this.getSObjectFields({
            sobjectName: childSObject,
            username: this.username,
          }),
        ]
        if (!this.sobjectChildRelationshipFields.length) {
          this.fetchSObjectFields({
            sobjectName: childSObject,
            apiVersion: this.apiVersion,
            username: this.username,
          }).then(() => {
            this.sobjectChildRelationshipFields = [
              ...this.getSObjectFields({
                sobjectName: childSObject,
                username: this.username,
              }),
            ]
          })
        }
      }
    },
    onClickRefreshObjectsButton() {
      this.soqlText = null
      this.selectedSObjectChildRelationship = null
      this.selectedField = null
      this.fieldsSourceTabIndex = 0
      this.sobjectName = null
      this.sobjectChildRelationshipName = null
      this.parsedSOQL = null
      this.editingSOQL = null
      ;(this.soql = {
        sobjects: {},
        limit: null,
        offset: null,
      }),
        (this.soqlResult = null)
      this.soqlPlan = null
      this.errors = []
      this.selectedReference = null
      this.selectedReferenceName = null
      this.sobjectFields = []
      this.sobjectChildRelationshipFields = []
      this.isExecutingSOQL = false
      this.isExecutingSOQLPlan = false
      this.isUpdatingRecords = false
      this.isExportingData = false
      this.editingRecords = {}
      this.showSaveChangesButton = false
      this.setEditorLoadingState({ name: this.name, isLoading: true })
      this.fetchSObjects({
        apiVersion: this.apiVersion,
        username: this.username,
      }).then(() => {
        this.setEditorLoadingState({ name: this.name, isLoading: false })
      })
    },
    onClickExecuteQueryButton() {
      this.errors = []
      this.soqlResult = null
      this.soqlPlan = null
      this.editingRecords = {}
      if (!this.isExecutingSOQL && this.soqlText) {
        this.isExecutingSOQL = true
        this.parsedSOQL = parseQuery(this.soqlText)
        this.sobjectName = this.parsedSOQL.sObject
        this.fetchSOQLAndSObject({
          soql: this.soqlText,
          sobjectName: this.sobjectName,
          apiVersion: this.apiVersion,
          username: this.username,
        }).then((responses) => {
          this.selectedSObject = this.sobjects.find(
            (sobject) =>
              sobject.name.toLowerCase() === this.sobjectName.toLowerCase()
          )
          const response = responses.data[0]
          const results = response.results
          const soqlResponse = results[1]
          if (soqlResponse.statusCode === 200) {
            const records = soqlResponse.result.records
            records.forEach((record) =>
              removeKeys(record, [
                'attributes',
                'done',
                'url',
                'type',
                'totalSize',
              ])
            )
            this.soqlResult = records
          } else {
            this.errors.push({
              message: decode(soqlResponse.result[0].message),
            })
          }
          this.isExecutingSOQL = false
        })
      }
    },
    onClickCancelRequest() {
      this.cancelRequest().then((response) => {
        this.isExecutingSOQL = false
      })
    },
    onClickQueryPlanButton() {
      this.isExecutingSOQLPlan = true
      this.soqlPlan = null
      this.soqlResult = null
      this.errors = null
      this.editingRecords = {}
      this.fetchSOQLPlan({
        soql: this.soqlText,
        apiVersion: this.apiVersion,
        username: this.username,
      })
        .then((response) => {
          if (response.data.plans) this.soqlPlan = response.data.plans
          this.isExecutingSOQLPlan = false
          this.showToastMessage('SOQL Plan retrieved with success')
        })
        .catch(() => {
          this.showToastMessage('SOQL Plan failed.')
        })
    },
    setEditorSOQL() {
      this.$axios
        .post(`${process.env.SALESFORCE_API_ENDPOINT}/editor`, {
          editingSOQL: this.soqlText,
        })
        .then(() => {
          this.showToastMessage('SOQL updated with success')
        })
        .catch(() => {
          this.showToastMessage(
            'Could not update the SOQL in the Editor. Please, update it manually.'
          )
        })
    },
    onClickFormatQueryButton() {
      this.soql = sqlFormatter.format(this.soql)
    },
    onDeleteFilterEntry(index) {
      this.filters.splice(index, 1)
    },
    onSelectFieldReference({ referenceName, reference }) {
      this.selectedReferenceName = referenceName
      this.selectedReference = reference
      this.$bvModal.show(this.relationshipSelectorModalId)
    },
    onClickRecordId(id) {
      this.showToastMessage(`Opening Record Id ${id}`)
      this.$axios
        .get(`${process.env.SALESFORCE_API_ENDPOINT}/sfdx/open/record/${id}`)
        .then(() => {
          this.showToastMessage(`Record Id ${id} opened with Success.`)
        })
        .catch(() => {
          this.showToastMessage(`Record Id ${id} could not be opened.`)
        })
    },
    onDoubleClickTableCell(recordId, rowIndex) {
      this.editingRecords[recordId] = {
        record: { ...this.soqlResult[rowIndex] },
        rowIndex,
        differences: {},
      }
      this.editingRecords = { ...this.editingRecords }
    },
    onClickCancelChangesButton(recordId, rowIndex) {
      this.soqlResult.splice(rowIndex, 1, this.editingRecords[recordId].record)
      delete this.editingRecords[recordId]
      this.soqlResult = [...this.soqlResult]
      this.showSaveChangesButton = this.setShowSaveChangesButtonVisibility()
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
      this.errors = []
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
          this.isUpdatingRecords = false
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
              }
            })
          })
          this.showSaveChangesButton = this.setShowSaveChangesButtonVisibility()
          if (this.errors.length) this.$bvModal.show(this.errorsModalId)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onTableInputChange(recordId, recordIndex, fieldName) {
      const oldValue = this.editingRecords[recordId].record[fieldName]
      const newValue = this.soqlResult[recordIndex][fieldName]
      if (oldValue !== newValue) {
        this.editingRecords[recordId].differences[fieldName] = newValue
      } else {
        delete this.editingRecords[recordId].differences[fieldName]
      }

      this.showSaveChangesButton = this.setShowSaveChangesButtonVisibility()
    },
    onClickExportAsSourceTree() {
      this.isExportingData = true
      this.$axios
        .post(
          `${process.env.SALESFORCE_API_ENDPOINT}/sfdx/export/sourcetree/${this.apiVersion}`,
          {
            soql: this.soqlText,
          }
        )
        .then(() => this.showToastMessage('Data exported with success.'))
        .catch((error) => console.error(error))
        .finally(() => {
          this.isExportingData = false
        })
    },
    setShowSaveChangesButtonVisibility() {
      for (const recordId in this.editingRecords) {
        const editingRecord = this.editingRecords[recordId]
        const differences = editingRecord.differences
        if (Object.keys(differences).length) return true
      }
      return false
    },
    getFieldName(field) {
      return (
        field +
        (this.configuration.fieldType.table &&
        this.sobjectFieldsMappedByName[field] &&
        this.sobjectFieldsMappedByName[field].type
          ? ' [' +
            this.sobjectFieldsMappedByName[field].type.toUpperCase() +
            ']'
          : '')
      )
    },
    onClearAllFields() {
      this.soql = {
        sobjects: {},
        offset: this.soql.offset,
        limit: this.soql.limit,
      }
      this.soql = { ...this.soql }
      this.sobjectFields = [
        ...this.getSObjectFields({
          sobjectName: this.sobjectName,
          username: this.username,
        }),
      ]
    },
    makeSOQL() {
      let newSOQL = ''
      for (var [sobjectName, value] of Object.entries(this.soql.sobjects)) {
        newSOQL += this.buildSingleSOQL(sobjectName, value)
      }
      this.soqlText = newSOQL
    },
    buildSingleSOQL(soqlObjectName, soqlObjectConfig) {
      const fields = Object.keys(soqlObjectConfig.fields).reduce(
        (previous, current, index) =>
          previous + (index > 0 ? ', ' : '') + current,
        ''
      )
      const filters = Object.keys(soqlObjectConfig.fields).reduce(
        (previous, current, index) => {
          const field = soqlObjectConfig.fields[current]
          return (
            previous +
            field.filters
              .filter((filter) => filter.logicalOperator && filter.value)
              .reduce((previous, current, index) => {
                return (
                  previous +
                  ' ' +
                  field.details.name +
                  ' ' +
                  current.logicalOperator +
                  ' ' +
                  current.value +
                  (current.logic ? ' ' + current.logic : '')
                )
              }, '')
          )
        },
        ''
      )
      const orderBy = Object.keys(soqlObjectConfig.fields).reduce(
        (previous, current, index) => {
          const field = soqlObjectConfig.fields[current]
          return (
            previous +
            (index > 0 && field.orderBy.order ? ', ' : '') +
            (field.orderBy.order
              ? field.details.name + ' ' + field.orderBy.order
              : '') +
            (field.orderBy.nullsOrder ? ' ' + field.orderBy.nullsOrder : '')
          )
        },
        ''
      )

      const soql =
        'SELECT ' +
        fields +
        ' FROM ' +
        soqlObjectName +
        (filters ? ' WHERE' + filters : '') +
        (orderBy ? ' ORDER BY ' + orderBy : '')
      return soql
    },
    goToSignUp() {
      this.$router.push({ name: 'SignUp' })
    },
    onSelectFieldToEdit({ sobjectName, field }) {
      this.selectedField = {
        ...this.soql.sobjects[sobjectName].fields[field.name],
        sobjectName,
      }
      this.$nextTick(() => {
        this.$refs.fieldForm?.openForm()
      })
    },
    onSelectedFieldChange(newField) {
      this.soql.sobjects[newField.sobjectName].fields[newField.name] = newField
      this.soql = { ...this.soql }
    },
    onCloseFieldForm() {
      this.selectedField = null
    },
    onRemoveRelationshipField({ fieldName }) {
      delete this.soql.sobjects[this.focusedReference].fields[fieldName]
      this.soql = { ...this.soql }
    },
    addFields(fields) {
      if (!this.soql.sobjects[this.focusedReference]) {
        this.soql.sobjects[this.focusedReference] = {
          fields: {},
          modifiers: [],
          functions: [],
        }
      }

      fields.forEach((field) => {
        this.soql.sobjects[this.focusedReference].fields[
          field.computedFieldName || field.name
        ] = {
          details: field.details,
          name: field.computedFieldName || field.name,
          filters: [],
          orderBy: {
            order: null,
            nullsOrder: null,
          },
          groupBy: {},
          having: {},
        }
      })

      this.soql = { ...this.soql }
    },
    onInsertField({ field }) {
      this.addFields([field])
    },
    onInsertRelationshipField({ field }) {
      this.addFields([field])
    },
    onInsertAllRelationshipFields({ fields }) {
      this.addFields(fields)
    },
    onInsertAllFields({ fields }) {
      this.addFields(fields)
    },
    onClearAllSObjectFields({ sobjectName }) {
      this.soql.sobjects[sobjectName] = {
        fields: {},
        modifiers: [],
        functions: [],
      }
      this.soql = { ...this.soql }
    },
    onClearAllRelationshipFields(parentRelationshipName) {
      Object.keys(this.soql.sobjects[this.focusedReference].fields).forEach(
        (fieldName) => {
          if (fieldName.includes(parentRelationshipName + '.'))
            delete this.soql.sobjects[this.focusedReference].fields[fieldName]
        }
      )

      this.soql = { ...this.soql }
    },
    onCloseErrorsModal() {
      this.errors = []
      this.$bvModal.hide(this.errorsModalId)
    },
    onDeleteSelectedField() {
      delete this.soql.sobjects[this.selectedField.sobjectName].fields[
        this.selectedField.name
      ]
      if (
        !Object.keys(this.soql.sobjects[this.selectedField.sobjectName].fields)
          .length
      ){
        delete this.soql.sobjects[this.selectedField.sobjectName]
      }
      this.soql = { ...this.soql }
      this.$refs.fieldForm?.closeForm()
    },
    showToastMessage(message) {
      this.$bvToast.toast(message, {
        toaster: 'b-toaster-bottom-right',
        solid: true,
        appendToast: true,
        noCloseButton: true,
      })
    },
    onSelectEnvironment() {},
  },
}
</script>

<style src="vue-json-pretty/lib/styles.css"></style>
<style src="@allanoricil/vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.record-id {
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
}

.record-id:hover {
  text-decoration: underline !important;
}

.refresh-data-button {
  color: var(--vscode-menu-separatorBackground);
  font-size: 1.8em;
}

.refresh-data-button:hover {
  color: var(--vscode-badge-foreground);
  cursor: pointer;
}

.field-has-next {
  position: absolute !important;
  top: 0px !important;
  left: 4px !important;
  height: 20px !important;
  width: 20px !important;
  background-color: var(--vscode-input-background) !important;
}

.field-has-next:hover {
  color: var(--vscode-button-background) !important;
}

.table-button {
  width: 30px;
}

.soql-result-table-cell {
  cursor: pointer;
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
}

.soql-result-table-cell > div:hover {
  opacity: 0.05;
  background-color: var(--vscode-menu-foreground);
}

.soql-results-actions-column {
  width: 40px !important;
  max-width: 40px !important;
}

input,
select {
  width: 100% !important;
}

table input,
table input:focus,
table select,
table select:focus {
  border: 3px solid var(--vscode-inputOption-activeBackground) !important;
  height: 30px !important;
}

/deep/ .nav-tabs {
  border-bottom: none !important;
}

.golden-btn + .golden-btn {
  margin-top: 1em;
}

.golden-btn {
  width: 100px;
  display: inline-block;
  outline: none;
  font-family: inherit;
  font-size: 1em;
  box-sizing: border-box;
  font-weight: bold;
  border: none;
  border-radius: 0.3em;
  height: 2.75em;
  line-height: 2.5em;
  text-transform: uppercase;
  padding: 0 1em;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(110, 80, 20, 0.4),
    inset 0 -2px 5px 1px rgba(139, 66, 8, 1),
    inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
  background-image: linear-gradient(
    160deg,
    #a54e07,
    #b47e11,
    #fef1a2,
    #bc881b,
    #a54e07
  );
  border: 1px solid #a55d07;
  color: rgb(120, 50, 5);
  text-shadow: 0 2px 2px rgba(250, 227, 133, 1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-size: 100% 100%;
  background-position: center;
}
.golden-btn:focus,
.golden-btn:hover {
  background-size: 150% 150%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23),
    inset 0 -2px 5px 1px #b17d10, inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
  border: 1px solid rgba(165, 93, 7, 0.6);
  color: rgba(120, 50, 5, 0.8);
}
.golden-btn:active {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(110, 80, 20, 0.4),
    inset 0 -2px 5px 1px #b17d10, inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
}

@media only screen and (max-width: 576px) {
  .environment-select-input {
    width: 100% !important;
  }
}

@media only screen and (min-width: 576px) {
  .environment-select-input {
    width: 500px;
  }
}

i.fa-close:hover {
  cursor: pointer;
  color: var(--vscode-button-foreground);
}
</style>
