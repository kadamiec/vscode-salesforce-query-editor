<template>
  <div :ref="name" class="editor">
    <div class="d-flex flex-column">
      <!-- ENVIRONMENTS -->
      <div
        v-if="environments && environments.length"
        class="pb-2"
        :class="!isDataTableExpanded ? 'd-block' : 'd-none'"
      >
        <multiselect
          v-model="selectedEnvironment"
          class="environment mb-1"
          :options="environments"
          label="username"
          track-by="username"
          searcheable
          :max-height="400"
          select-label=""
          deselect-label=""
          placeholder="Select Environment"
          hide-selected
          @select="onSelectEnvironment"
        >
          <template slot="singleLabel" slot-scope="{ option }">
            {{ option.username + (option.alias ? ' - ' + option.alias : '') }}
          </template>
          <template slot="option" slot-scope="{ option }">
            {{ option.username + (option.alias ? ' - ' + option.alias : '') }}
          </template>
          <span slot="noResult">Could not find Environment</span>
        </multiselect>
      </div>

      <!-- QUERY BUILDER -->
      <div
        :class="showForm && !isDataTableExpanded ? 'd-block' : 'd-none'"
        style="height: 395px"
      >
        <div class="row h-100 m-0">
          <div class="col-6 col-xl-4 pl-0 pr-1">
            <b-tabs v-model="fieldsSourceTabIndex" no-fade>
              <!--  SOBJECT FIELDS TAB -->
              <b-tab title="Objects" active>
                <div class="d-flex flex-column mt-1" style="height: 317px">
                  <multiselect
                    v-model="selectedSObject"
                    class="mb-1"
                    :options="sobjects"
                    label="name"
                    track-by="name"
                    searcheable
                    :max-height="400"
                    select-label=""
                    deselect-label=""
                    placeholder="Select Object"
                    hide-selected
                    @input="onSelectSObject"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      {{ option.name + ' - ' + option.label }}
                    </template>
                    <template slot="option" slot-scope="{ option }">
                      {{ option.name + ' - ' + option.label }}
                    </template>
                    <span slot="noResult">Could not find SObject</span>
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
                <div class="d-flex flex-column mt-1" style="height: 317px">
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
                    placeholder="Select Child Relationship"
                    hide-selected
                    @select="onSelectSObjectChildRelationship"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      {{
                        option.relationshipName + ' - ' + option.childSObject
                      }}
                    </template>
                    <template slot="option" slot-scope="{ option }">
                      {{
                        option.relationshipName + ' - ' + option.childSObject
                      }}
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

              <template #tabs-end>
                <div
                  v-if="configuration.displayEditor"
                  v-b-tooltip.hover
                  v-shortkey="['ctrl', 'r']"
                  class="clickable-icon fa fa-sync fa-xs my-auto ml-2"
                  data-placement="top"
                  title="Refresh Data"
                  @click="onClickRefreshObjectsButton()"
                  @shortkey="onClickRefreshObjectsButton()"
                ></div>
              </template>
            </b-tabs>
          </div>
          <div class="col-6 col-xl-8 p-0">
            <selected-fields
              ref="selected-fields"
              class="h-100"
              :selected-fields="selectedFields"
              @clearAllFields="onClickClearAllFields"
              @insertField="onInsertField"
              @selectField="onSelectFieldToEdit"
              @soqlConfig="onChangeSoqlConfig"
            >
            </selected-fields>
          </div>
        </div>
      </div>

      <!-- QUERY EDITOR -->
      <div
        class="d-flex flex-column"
        :class="isDataTableExpanded ? 'd-none' : null"
      >
        <div
          class="justify-content-between"
          :class="isDataTableExpanded ? 'd-none' : 'd-flex'"
        >
          <label class="my-auto">Enter or modify your Query below:</label>
          <div class="d-flex mb-1">
            <button
              class="vscode-button btn btn-primary mr-1 mt-auto"
              style="height: 30px"
              :disabled="disableTextAreaActionButtons"
              @click="onClickFormatQueryButton()"
            >
              Format
            </button>

            <div>
              <label for="api-version-input">API</label>
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
        <query-text-editor
          v-model="soqlText"
          :class="isDataTableExpanded ? 'd-none' : 'd-block'"
          style="height: 396px"
        ></query-text-editor>
        <div class="d-flex justify-content-between mt-1">
          <div :class="isDataTableExpanded ? 'd-none' : 'd-block'">
            <button
              v-shortkey="isExecutingQuery ? ['ctrl', 'c'] : ['ctrl', 'r']"
              class="vscode-button btn btn-primary"
              :disabled="
                isExecutingQueryPlan ||
                isUpdatingRecords ||
                isExportingData ||
                !soqlText
              "
              @shortkey="
                isExecutingQuery
                  ? onClickCancelRequest()
                  : onClickExecuteQueryButton()
              "
              @click="
                isExecutingQuery
                  ? onClickCancelRequest()
                  : onClickExecuteQueryButton()
              "
            >
              {{ isExecutingQuery ? 'Cancel' : 'Execute' }}
              <i v-if="isExecutingQuery" class="fa fa-circle-o-notch fa-spin" />
            </button>
            <button
              :disabled="
                isExecutingQuery ||
                isUpdatingRecords ||
                isExportingData ||
                !soqlText
              "
              class="vscode-button btn btn-primary"
              @click="
                isExecutingQueryPlan
                  ? onClickCancelRequest()
                  : onClickQueryPlanButton()
              "
            >
              {{ isExecutingQueryPlan ? 'Cancel' : 'Query Plan' }}
              <i
                v-if="isExecutingQueryPlan"
                class="fa fa-circle-o-notch fa-spin"
              />
            </button>
            <button
              v-if="isLicenseValid()"
              :disabled="disableTextAreaActionButtons"
              class="vscode-button btn btn-primary"
              @click="setEditorSOQL()"
            >
              {{ isUpdatingQuery ? 'Update Apex' : 'Add to Apex' }}
            </button>
          </div>
        </div>
      </div>

      <!-- SOQL PLAN -->
      <soql-plan :ref="'query-plan' + name" :soql-plan="soqlPlan"></soql-plan>

      <!-- QUERY RESULTS -->
      <query-results
        :ref="'query-results' + name"
        class="flex-grow-1"
        :value="soqlResult"
        :queryErrors="errors"
        :showQueryResults="showQueryResults"
        :query="soqlText"
        :apiVersion="apiVersion"
        :editor-name="name"
        :sobject-name="sobjectName"
        @expandDataTable="onExpandDataTable"
        @refreshData="onClickExecuteQueryButton"
      ></query-results>

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
        <button type="button" class="vscode-button btn btn-md" @click="close()">
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
import QueryTextEditor from '@/components/query-text-editor.vue'
import QueryResults from '@/components/query-results.vue'
import SoqlPlan from '@/components/soql-plan.vue'

import { decode } from 'html-entities'
import sqlFormatter from '@allanoricil/sql-formatter'
import { parseQuery } from 'soql-parser-js'
import { removeKeys } from '~/assets/js/utils/objectUtils.js'
import showToastMessage from '~/mixins/show-toast-message'
import { formatDateTime } from '~/utilities/soql-formatter-fix-methods'

export default {
  name: 'Editor',
  components: {
    RelationshipSelector,
    Fields,
    SelectedFields,
    FieldForm,
    QueryTextEditor,
    QueryResults,
    SoqlPlan,
  },
  mixins: [showToastMessage],
  props: {
    name: {
      type: String,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      soqlText: '',
      selectedSObject: null,
      selectedSObjectChildRelationship: null,
      selectedField: null,
      selectedEnvironment: null,
      fieldsSourceTabIndex: 0,
      sobjectName: null,
      sobjectChildRelationshipName: null,
      parsedSOQL: null,
      apiVersion: 'v50.0',
      soql: {
        sobjects: {},
      },
      soqlResult: null,
      soqlPlan: [],
      errors: [],
      selectedReference: null,
      selectedReferenceName: null,
      sobjectChildRelationships: [],
      sobjectFields: [],
      sobjectChildRelationshipFields: [],
      showForm: true,
      isExecutingQuery: false,
      isExecutingQueryPlan: false,
      isDataTableExpanded: false,
      showQueryResults: false,
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
      getSObjectChildRelationships: 'salesforce/getSObjectChildRelationships',
      isLicenseValid: 'user/isLicenseValid',
      getConnectedEnvironments: 'salesforce/getConnectedEnvironments',
      getActiveEditorUsername: 'salesforce/getActiveEditorUsername',
      getActiveEditor: 'salesforce/getActiveEditor',
    }),
    ...mapState({
      configuration: (state) => state.user.configuration,
      editors: (state) => state.salesforce.editors,
      apiVersions: (state) => state.salesforce.apiVersions,
    }),
    sobjects(){
      return this.selectedEnvironment?.username ? this.getQueryableSObjects({ username: this.selectedEnvironment.username }) : []
    },
    environments() {
      return this.getConnectedEnvironments()
    },
    username() {
      return this.getActiveEditorUsername()
    },
    activeEditor() {
      return this.getActiveEditor()
    },
    selectedFields() {
      const selectedFields = {}
      for (const [sobjectName, sobject] of Object.entries(this.soql.sobjects)) {
        selectedFields[sobjectName] = Object.values(sobject.fields) || []
      }
      return selectedFields
    },
    soqlResultFields() {
      return this.soqlResult && this.soqlResult[0]
        ? Object.keys(this.soqlResult[0])
        : []
    },
    isExportingData() {
      return this.$refs['query-results']
        ? this.$refs['query-results'].$data.isExportingData
        : false
    },
    isUpdatingRecords() {
      return this.$refs['query-results']
        ? this.$refs['query-results'].$data.isUpdatingRecords
        : false
    },
    disableTextAreaActionButtons() {
      return (
        !this.soqlText ||
        this.isExecutingQuery ||
        this.isExecutingQueryPlan ||
        this.isUpdatingRecords ||
        this.isExportingData
      )
    },
    isUpdatingQuery() {
      return this.editingSOQL && this.editingSOQL.start !== this.editingSOQL.end
    },
    relationshipSelectorModalId() {
      return `relationship-selector-modal${this.name}`
    },
    focusedReference() {
      return this.fieldsSourceTabIndex === 0
        ? this.sobjectName
        : this.sobjectChildRelationshipName
    },
  },
  sockets: {
    editingsoql(data) {
      console.log(data);
      if(this.name === this.activeEditor.name){
        this.soql = {
          sobjects: {},
        }
        this.selectedSObject = null
        this.selectedSObjectChildRelationship = null
        if (data?.soql) {
          this.soqlText = data.soql
            .replaceAll(/\[/g, '')
            .replaceAll(/\]/g, '')
            .replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ')
            .replace(/\s+$/, '')
          if (this.configuration.format.automatically)
            this.soqlText = this._formatSOQL(this.soqlText)
          this.onClickExecuteQueryButton()
        }
      }
    },
  },
  watch: {
    username(newUsername){
      this.selectedEnvironment = this.environments.find(env => env.username === newUsername);
    }
  },
  methods: {
    ...mapActions({
      fetchEnvironmentDetails: 'salesforce/fetchEnvironmentDetails',
      fetchSObjectFields: 'salesforce/fetchSObjectFields',
      fetchRecords: 'salesforce/fetchRecords',
      fetchSObjects: 'salesforce/fetchSObjects',
      cancelRequest: 'salesforce/cancelRequest',
      deleteRecord: 'salesforce/deleteRecord',
      updateRecords: 'salesforce/updateRecords',
      fetchSOQLPlan: 'salesforce/fetchSOQLPlan',
    }),
    ...mapMutations({
      setApiVersion: 'salesforce/setApiVersion',
      setEditorLoadingState: 'salesforce/setEditorLoadingState',
      clearEnvironment: 'salesforce/clearEnvironment',
    }),
    onSelectApiVersion(event) {
      this.apiVersion = event.target.value
      this.setApiVersion(this.apiVersion)
    },
    onSelectSObject(sobject) {
      if(sobject){
        this.soql = {
          sobjects: {
            [sobject.name]: {
              fields: {},
              modifiers: [],
              functions: [],
              main: true,
              limit: this.limit,
              offset: this.offset,
            },
          },
        }
        this.soqlResult = null
        this.sobjectName = sobject.name
        this.selectedSObjectChildRelationship = null
        this.sobjectChildRelationships = []
        this.sobjectChildRelationshipFields = []
        this.sobjectFields = [
          ...this.getSObjectFields({
            sobjectName: this.sobjectName,
            username: this.username,
          }),
        ]
        this.sobjectChildRelationships = this.getSObjectChildRelationships({
          sobjectName: this.sobjectName,
          username: this.username,
        })
        if (!this.sobjectFields.length) {
          this.fetchSObjectFields({
            sobjectName: this.sobjectName,
            apiVersion: this.apiVersion,
            username: this.username,
          })
            .then(() => {
              this.sobjectFields = this.getSObjectFields({
                sobjectName: this.sobjectName,
                username: this.username,
              })

              this.sobjectChildRelationships = this.getSObjectChildRelationships({
                sobjectName: this.sobjectName,
                username: this.username,
              })
            })
            .catch(() => {
              this.showToastMessage('Could not fetch sobject fields')
            })
        }
      }else{
        this.sobjectFields = []
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
      this.soql = {
        sobjects: {},
      }
      this.soqlText = null
      this.selectedSObject = null
      this.selectedSObjectChildRelationship = null
      this.selectedField = null
      this.fieldsSourceTabIndex = 0
      this.sobjectName = null
      this.sobjectChildRelationshipName = null
      this.parsedSOQL = null
      this.editingSOQL = null
      this.soqlResult = null
      this.soqlPlan = []
      this.errors = []
      this.selectedReference = null
      this.selectedReferenceName = null
      this.sobjectFields = []
      this.sobjectChildRelationshipFields = []
      this.isExecutingQuery = false
      this.isExecutingQueryPlan = false
      this.clearEnvironment(this.username)
      this.setEditorLoadingState({ editorName: this.name, isLoading: true })
      this.fetchSObjects({
        apiVersion: this.apiVersion,
        username: this.username,
      }).then(() => {
        this.setEditorLoadingState({ editorName: this.name, isLoading: false })
      })
    },
    onClickExecuteQueryButton() {
      this.errors = []
      this.soqlResult = []
      this.soqlPlan = []
      this.showQueryResults = false;
      if (!this.isExecutingQuery && this.soqlText) {
        this.isExecutingQuery = true
        try {
          let soqlWithoutChildQueries = this.soqlText.replaceAll(/\s\s+|\n/g, ' ').replaceAll(/\(.*\)/g, '').replaceAll(/,/g, '')
          let soqlTokens = soqlWithoutChildQueries.split(' ');
          let fromIndex = soqlTokens.findIndex((token) => token.toLowerCase() === "from");
          this.sobjectName = soqlTokens[fromIndex + 1]
          this.fetchRecords({
            soql: this.soqlText,
            sobjectName: this.sobjectName,
            apiVersion: this.apiVersion,
            username: this.username,
          })
            .then((responses) => {
              this.showQueryResults = true;
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
              this.isExecutingQuery = false
              this.$nextTick(() => {
                this.$refs['query-results' + this.name].$el.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'start',
                })
              })
            })
            .catch((error) => {
              this.showToastMessage('SOQL Query failed')
              this.errors.push(error)
              this.isExecutingQuery = false
            })
        } catch {
          this.showToastMessage('Could not determine SObject Name')
          this.isExecutingQuery = false
        }
      }
    },
    onClickCancelRequest() {
      this.cancelRequest().then(() => {
        this.isExecutingQuery = false
      })
    },
    onClickQueryPlanButton() {
      this.isExecutingQueryPlan = true
      this.soqlPlan = []
      this.soqlResult = []
      this.errors = []
      try {
        this.parsedSOQL = parseQuery(this.soqlText)
        this.fetchSOQLPlan({
          soql: this.soqlText,
          apiVersion: this.apiVersion,
          username: this.username,
        })
          .then((response) => {
            if (response.data.plans) this.soqlPlan = response.data.plans
            this.isExecutingQueryPlan = false

            this.$nextTick(() => {
              this.$refs['query-plan' + this.name].$el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start',
              })
            })
          })
          .catch(() => {
            this.isExecutingQueryPlan = false
            this.showToastMessage('SOQL Plan failed.')
          })
      } catch (error) {
        this.isExecutingQueryPlan = false
        this.showToastMessage('Query could not be parsed')
      }
    },
    setEditorSOQL() {
      this.$axios
        .post(`${process.env.SALESFORCE_SERVER}/vscode/editor`, {
          editingSOQL: this._makeSOQL(true),
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
      this.soqlText = this._formatSOQL(this.soqlText);
    },
    onSelectFieldReference({ referenceName, reference }) {
      this.selectedReferenceName = referenceName
      this.selectedReference = reference
      this.$bvModal.show(this.relationshipSelectorModalId)
    },
    onClickClearAllFields() {
      Object.keys(this.soql.sobjects).forEach((sobjectName) => {
        delete this.soql.sobjects[sobjectName]
      })
      this.soql = { ...this.soql }
      this.sobjectFields = [
        ...this.getSObjectFields({
          sobjectName: this.sobjectName,
          username: this.username,
        }),
      ]
      this.soqlText = this._makeSOQL();
    },
    _makeSOQL(addApexModifiers) {
      let soqlText = ''
      const childRelationshipQueries = []
      let childRelationshipQueryPosition = 0
      for (var [sobjectName, value] of Object.entries(this.soql.sobjects)) {
        if (value.main) {
          const mainQuery = this._buildSingleSOQL(
            sobjectName,
            value,
            addApexModifiers
          )
          childRelationshipQueryPosition =
            ('SELECT ' + mainQuery.fields).length + 1
          soqlText = mainQuery.soql
        } else {
          childRelationshipQueries.push(
            this._buildSingleSOQL(sobjectName, value, addApexModifiers).soql
          )
        }
      }

      if (childRelationshipQueries.length) {
        const addFirstComma = soqlText
          .slice(0, childRelationshipQueryPosition - 1)
          .includes(',')

        let childRelationshipQueriesText = ''
        childRelationshipQueries.forEach((soql, index) => {
          childRelationshipQueriesText +=
            (index > 0 ? ', ' : '') + '(' + soql + ')'
        })

        soqlText =
          soqlText.slice(0, childRelationshipQueryPosition - 1) +
          (addFirstComma ? ', ' : '') +
          childRelationshipQueriesText +
          soqlText.slice(childRelationshipQueryPosition)
      }

      if (soqlText) {
        soqlText = this._formatSOQL(soqlText)
      }
      return soqlText
    },
    _buildSingleSOQL(soqlObjectName, soqlObjectConfig, addApexModifiers) {
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
            field.filters.reduce((previous, current, index) => {
              return (
                previous +
                ' ' +
                current.computed +
                ' ' +
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
            (previous && field.orderBy.order ? ', ' : '') +
            (field.orderBy.order
              ? field.name + ' ' + field.orderBy.order
              : '') +
            (field.orderBy.nullsOrder ? ' ' + field.orderBy.nullsOrder : '')
          )
        },
        ''
      )

      const apexModifiers =
        (soqlObjectConfig.allRows ? '  ALL ROWS ' : '') +
        (soqlObjectConfig.forUpdate ? ' FOR UPDATE ' : '') +
        (soqlObjectConfig.forView ? ' FOR VIEW ' : '') +
        (soqlObjectConfig.forReference ? ' FOR REFERENCE ' : '')

      const soql = fields
        ? 'SELECT ' +
          fields +
          ' FROM ' +
          soqlObjectName +
          (filters ? ' WHERE' + filters : '') +
          (orderBy ? ' ORDER BY ' + orderBy : '') +
          (soqlObjectConfig.limit ? ' LIMIT ' + soqlObjectConfig.limit : '') +
          (soqlObjectConfig.offset
            ? ' OFFSET ' + soqlObjectConfig.offset
            : '') +
          (addApexModifiers ? apexModifiers : '')
        : ''
      return {
        soql,
        fields,
        filters,
        orderBy,
        limit: soqlObjectConfig.limit,
        offset: soqlObjectConfig.offset,
      }
    },
    _formatSOQL(soqlText){
      soqlText = sqlFormatter.format(soqlText, {indent: '    '})
      soqlText = formatDateTime(soqlText)
      soqlText = soqlText.replace(/\u200B|\u200b/, '')
      return soqlText;
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
      this.soqlText = this._makeSOQL();
    },
    onCloseFieldForm() {
      this.selectedField = null
    },
    onRemoveRelationshipField({ fieldName }) {
      delete this.soql.sobjects[this.focusedReference].fields[fieldName]
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL();
    },
    addFields(fields) {
      if (fields && fields.length) {
        if (!this.soql.sobjects[this.focusedReference]) {
          this.soql.sobjects[this.focusedReference] = {
            fields: {},
            modifiers: [],
            functions: [],
            main: this.fieldsSourceTabIndex === 0,
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
        this.soqlText = this._makeSOQL();
      }
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
      delete this.soql.sobjects[sobjectName]
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL();
    },
    onClearAllRelationshipFields(parentRelationshipName) {
      Object.keys(this.soql.sobjects[this.focusedReference].fields).forEach(
        (fieldName) => {
          if (fieldName.includes(parentRelationshipName + '.'))
            delete this.soql.sobjects[this.focusedReference].fields[fieldName]
        }
      )

      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL();
    },
    onDeleteSelectedField() {
      delete this.soql.sobjects[this.selectedField.sobjectName].fields[
        this.selectedField.name
      ]
      if (
        !Object.keys(this.soql.sobjects[this.selectedField.sobjectName].fields)
          .length
      ) {
        delete this.soql.sobjects[this.selectedField.sobjectName]
      }
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL();
      this.$refs.fieldForm?.closeForm()
    },
    onSelectEnvironment(environment) {
      if(environment){
        this.selectedEnvironment = environment;
        this.errors = []
        this.selectedSObject = null
        this.selectedSObjectChildRelationship = null
        this.soqlPlan = []
        this.soqlResult = []
        this.soql = {
          sobjects: {}
        }
        this.soqlText = ""
        this.fetchEnvironmentDetails({ username: this.selectedEnvironment.username, editorName: this.name })
      }
    },
    onChangeSoqlConfig({ soqlConfig, sobjectName }) {
      this.soql.sobjects[sobjectName] = {
        ...this.soql.sobjects[sobjectName],
        ...soqlConfig,
      }
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL();
    },
    onExpandDataTable() {
      this.isDataTableExpanded = !this.isDataTableExpanded
      this.$nextTick(() => {
        this.$refs['query-results' + this.name].$el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        })
      })
    },
  },
}
</script>

<style src="@allanoricil/vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.editor {
  min-width: 525px;
  height: 100%;
  overflow-y: auto;
}

.fa.fa-sync {
  font-size: 1.5rem;
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

input,
select {
  width: 100% !important;
  height: 30px;
}

label {
  margin-bottom: 0.2rem;
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

.environment /deep/ .multiselect__tags{
  padding-top: 0 !important;
  padding-left: 0 !important;
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  border-bottom: thin solid var(--vscode-inputOption-activeBackground) !important;
}

.environment /deep/ .multiselect__tags input,
.environment /deep/ .multiselect__single,
.environment /deep/ .multiselect__tags .multiselect__placeholder{
  height: 29px;
  line-height: 29px;
  font-size: 18px !important;
}

.environment /deep/ .multiselect__tags input::placeholder {
  color: transparent !important;
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 750px !important;
  }
}

/deep/ .tabs ul {
  height: 100%;
}

/deep/ .tabs > div {
  height: 30px;
}

/deep/ .nav-item li {
  height: 30px;
}

/deep/ .nav-item a {
  padding: 5px 10px;
}
</style>
