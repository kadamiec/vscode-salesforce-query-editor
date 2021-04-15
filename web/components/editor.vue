<template>
  <div>
    <loading v-if="isLoadingData"></loading>
    <div v-show="!isLoadingData" :ref="name" class="editor px-2 pt-2">
      <div class="d-flex flex-column">
        <editor-header v-if="!isLicenseValid()" />
        <!-- ENVIRONMENTS -->
        <div
          v-if="environments && environments.length"
          :class="!isDataTableExpanded ? 'd-flex' : 'd-none'"
          class="pb-2"
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
          <i
            v-b-tooltip.hover
            v-shortkey="['ctrl', 'shift', 'e']"
            class="clickable-icon fa fa-sync fa-xs my-auto ml-2"
            data-placement="top"
            title="Refresh Environments"
            @click="onClickRefreshEnvironmentsButton()"
            @shortkey="onClickRefreshEnvironmentsButton()"
          ></i>
        </div>

        <!-- QUERY BUILDER -->
        <div
          :class="
            configuration.displayQueryBuilder &&
            showQueryBuilder &&
            !isDataTableExpanded
              ? 'd-block'
              : 'd-none'
          "
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
                      @select="onSelectSObject"
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
                      :ref="'sobject-fields' + name"
                      :sobject-name="sobjectName"
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
                      track-by="relationshipName"
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
                      :ref="'child-relationship-fields' + name"
                      :sobject-name="sobjectChildRelationshipName"
                      @selectFieldReference="onSelectFieldReference"
                      @insertField="onInsertField"
                      @insertAllFields="onInsertAllFields"
                      @clearAllFields="onClearAllSObjectFields"
                    >
                    </fields>
                  </div>
                </b-tab>

                <template #tabs-end>
                  <i
                    v-if="configuration.displayQueryBuilder"
                    v-b-tooltip.hover
                    v-shortkey="['ctrl', 'shift', 'o']"
                    class="clickable-icon fa fa-sync fa-xs my-auto ml-2"
                    data-placement="top"
                    title="Refresh Objects"
                    @click="onClickRefreshObjectsButton()"
                    @shortkey="onClickRefreshObjectsButton()"
                  ></i>
                </template>
              </b-tabs>
            </div>
            <div class="col-6 col-xl-8 p-0">
              <selected-fields
                ref="selected-fields"
                class="h-100"
                :soql="soql"
                @clearAllFields="onClickClearAllFields"
                @insertField="onInsertField"
                @deleteField="onRightClickToDeleteField"
                @selectField="onSelectFieldToEdit"
                @soqlConfig="onChangeSoqlConfig"
              >
              </selected-fields>
            </div>
          </div>
        </div>

        <!-- QUERY EDITOR -->
        <div v-show="!isDataTableExpanded" class="d-flex flex-column">
          <div
            class="justify-content-between"
            :class="isDataTableExpanded ? 'd-none' : 'd-flex'"
          >
            <label class="my-auto">Enter or modify your query below:</label>
            <div class="d-flex mb-1">
              <button
                class="vscode-button btn-primary mr-1 mt-auto"
                style="height: 30px"
                :disabled="disableTextAreaActionButtons"
                @click="onClickFormatQueryButton()"
              >
                Format
              </button>
              <button
                v-clipboard:copy="soqlText"
                v-clipboard:success="onCopySoqlText"
                v-clipboard:error="onCopySoqlTextError"
                class="vscode-button btn-primary mr-1 mt-auto"
                style="height: 30px"
                :disabled="disableTextAreaActionButtons"
              >
                Copy
              </button>

              <div>
                <label for="api-version-input">API</label>
                <select
                  id="api-version-input"
                  v-model="apiVersion"
                  class="form-control"
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
            v-if="!isLoadingSObjects"
            v-show="!isDataTableExpanded"
            v-model="soqlText"
            :is-active="isActive"
            :is-loading-data="isLoadingData"
          ></query-text-editor>
          <div class="d-flex justify-content-between mt-1">
            <div v-show="!isDataTableExpanded">
              <button
                v-shortkey="['ctrl', 'shift', 'q']"
                class="vscode-button btn-primary"
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
                <i
                  v-if="isExecutingQuery"
                  class="fa fa-circle-o-notch fa-spin"
                />
              </button>
              <button
                :disabled="
                  isExecutingQuery ||
                  isUpdatingRecords ||
                  isExportingData ||
                  !soqlText
                "
                class="vscode-button btn-primary"
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
                class="vscode-button btn-primary"
                @click="setApexClassWithQuery()"
              >
                {{ isUpdatingQuery ? 'Update Apex' : 'Add to Apex' }}
              </button>
            </div>
          </div>
        </div>

        <!-- SOQL PLAN -->
        <soql-plan
          v-show="soqlPlan && soqlPlan.length"
          :ref="'query-plan' + name"
          :soql-plan="soqlPlan"
          class="mt-2"
        ></soql-plan>

        <!-- QUERY RESULTS -->
        <query-results
          v-show="soqlResult && soqlResult.length"
          :ref="'query-results' + name"
          class="query-results flex-grow-1 mt-2"
          :value="soqlResult"
          :username="selectedUsername"
          :query-errors="errors"
          :query="soqlText"
          :api-version="apiVersion"
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
          :username="selectedUsername"
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
          <button type="button" class="vscode-button-md" @click="close()">
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
import Loading from '@/components/loading.vue'

import { decode } from 'html-entities'
import sqlFormatter from '@allanoricil/sql-formatter'
import { parseQuery } from 'soql-parser-js'
import EditorHeader from '~/components/editor-header.vue'
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
    Loading,
    EditorHeader,
  },
  mixins: [showToastMessage],
  props: {
    name: {
      type: String,
      required: true,
      default: 'editor-0',
    },
    defaultusername: {
      type: Object,
      required: true,
      default: () => {},
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    isLoadingEnvironments: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data: () => {
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
      soqlResult: [],
      soqlPlan: [],
      errors: [],
      editingSOQL: null,
      selectedReference: null,
      selectedReferenceName: null,
      sobjectChildRelationships: [],
      sobjectFields: [],
      sobjectChildRelationshipFields: [],
      showQueryBuilder: true,
      isExecutingQuery: false,
      isExecutingQueryPlan: false,
      isDataTableExpanded: false,
      isLoadingSObjects: true,
    }
  },
  mounted() {
    this.isLoadingSObjects = !(
      this.defaultusername?.sobjects &&
      Object.keys(this.defaultusername.sobjects)?.length
    )
    if (this.defaultusername) this.selectedEnvironment = this.defaultusername

    window.addEventListener('keyup', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        this.showQueryBuilder = !this.showQueryBuilder
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
    }),
    ...mapState({
      configuration: (state) => state.user.configuration,
      apiVersions: (state) => state.salesforce.apiVersions,
    }),
    sobjects() {
      return this.selectedEnvironment?.username
        ? this.getQueryableSObjects({
            username: this.selectedEnvironment.username,
          })
        : []
    },
    environments() {
      return this.getConnectedEnvironments()
    },
    selectedFields() {
      const selectedFields = {}
      for (const [sobjectName, sobject] of Object.entries(this.soql.sobjects)) {
        selectedFields[sobjectName] = Object.values(sobject.fields) || []
      }
      return selectedFields
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
    selectedUsername() {
      return this.selectedEnvironment ? this.selectedEnvironment.username : null
    },
    isLoadingData() {
      return this.isLoadingSObjects || this.isLoadingEnvironments
    },
  },
  sockets: {
    editingsoql(data) {
      if (this.isActive && this.isLicenseValid()) {
        this.editingSOQL = data
        if (data?.soql && this.configuration.setQueryOnClick) {
          this.soqlText = data.soql
            .replaceAll(/\[/g, '')
            .replaceAll(/\]/g, '')
            .replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ')
            .replace(/\s+$/, '')
          if (this.configuration.format.automatically)
            this.soqlText = this._formatSOQL(this.soqlText)

          if (this.configuration.queryOnClick) {
            this.soql = {
              sobjects: {},
            }
            this.selectedSObject = null
            this.selectedSObjectChildRelationship = null
            this.sobjectFields = []
            this.sobjectChildRelationshipFields = []
            this.onClickExecuteQueryButton()
          }
        }
      }
    },
  },
  watch: {
    defaultusername(defaultusername) {
      if (this.isActive) this.selectedEnvironment = defaultusername
    },
    selectedEnvironment(selectedEnvironment) {
      this.soql = {
        sobjects: {},
      }
      this.soqlText = ''
      this.selectedSObject = null
      this.selectedSObjectChildRelationship = null
      this.selectedField = null
      this.fieldsSourceTabIndex = 0
      this.sobjectName = null
      this.sobjectChildRelationshipName = null
      this.parsedSOQL = null
      this.editingSOQL = null
      this.soqlResult = []
      this.soqlPlan = []
      this.errors = []
      this.selectedReference = null
      this.selectedReferenceName = null
      this.sobjectFields = []
      this.sobjectChildRelationshipFields = []
      this.$refs['sobject-fields' + this.name].clearAvailableFieldsList()
      this.$refs[
        'child-relationship-fields' + this.name
      ].clearAvailableFieldsList()
      const fetchSObjects = !(
        selectedEnvironment?.sobjects &&
        Object.keys(selectedEnvironment.sobjects)?.length
      )

      if (selectedEnvironment.username) {
        if (fetchSObjects) {
          this.isLoadingSObjects = true
          this.fetchSObjects({
            apiVersion: this.apiVersion,
            username: selectedEnvironment.username,
          })
            .catch(() => {
              this.showToastMessage('Could not fetch SObjects')
            })
            .finally(() => (this.isLoadingSObjects = false))
        } else {
          this.isLoadingSObjects = false
        }
      }
    },
    sobjectFields: {
      deep: true,
      handler() {
        this.$refs['sobject-fields' + this.name].setAvailableFieldList(
          this.sobjectFields,
          this.soql.sobjects[this.sobjectName]?.fields || {}
        )
      },
    },
    sobjectChildRelationshipFields: {
      deep: true,
      handler() {
        this.$refs[
          'child-relationship-fields' + this.name
        ].setAvailableFieldList(
          this.sobjectChildRelationshipFields,
          this.soql.sobjects[this.sobjectChildRelationshipName]?.fields || {}
        )
      },
    },
  },
  methods: {
    ...mapActions({
      fetchSObjectFields: 'salesforce/fetchSObjectFields',
      fetchRecords: 'salesforce/fetchRecords',
      fetchSObjects: 'salesforce/fetchSObjects',
      cancelRequest: 'salesforce/cancelRequest',
      fetchSOQLPlan: 'salesforce/fetchSOQLPlan',
    }),
    ...mapMutations({
      setApiVersion: 'salesforce/setApiVersion',
      clearEnvironment: 'salesforce/clearEnvironment',
    }),
    onSelectApiVersion(event) {
      this.apiVersion = event.target.value
      this.setApiVersion(this.apiVersion)
    },
    onSelectSObject(sobject) {
      this.soql = {
        sobjects: {
          [sobject.name]: {
            fields: {},
            modifiers: [],
            functions: [],
            main: true,
            limit: null,
            offset: null,
          },
        },
      }
      this.soqlResult = []
      this.soqlText = ''
      this.sobjectName = sobject.name
      this.selectedSObjectChildRelationship = null
      this.sobjectChildRelationships = []
      this.sobjectChildRelationshipFields = []
      this.sobjectFields = this.getSObjectFields({
        sobjectName: this.sobjectName,
        username: this.selectedEnvironment.username,
      })
      this.sobjectChildRelationships = this.getSObjectChildRelationships({
        sobjectName: this.sobjectName,
        username: this.selectedEnvironment.username,
      })
      if (!this.sobjectFields.length) {
        this.fetchSObjectFields({
          sobjectName: this.sobjectName,
          apiVersion: this.apiVersion,
          username: this.selectedEnvironment.username,
        })
          .then(() => {
            this.sobjectFields = this.getSObjectFields({
              sobjectName: this.sobjectName,
              username: this.selectedEnvironment.username,
            })

            this.sobjectChildRelationships = this.getSObjectChildRelationships({
              sobjectName: this.sobjectName,
              username: this.selectedEnvironment.username,
            })
          })
          .catch(() => {
            this.showToastMessage('Could not fetch sobject fields')
          })
      }
    },
    onSelectSObjectChildRelationship({ childSObject, relationshipName }) {
      this.sobjectChildRelationshipFields = []
      this.sobjectChildRelationshipName = relationshipName
      if (childSObject) {
        this.sobjectChildRelationshipFields = [
          ...this.getSObjectFields({
            sobjectName: childSObject,
            username: this.selectedEnvironment.username,
          }),
        ]
        if (!this.sobjectChildRelationshipFields.length) {
          this.fetchSObjectFields({
            sobjectName: childSObject,
            apiVersion: this.apiVersion,
            username: this.selectedEnvironment.username,
          })
            .then(() => {
              this.sobjectChildRelationshipFields = [
                ...this.getSObjectFields({
                  sobjectName: childSObject,
                  username: this.selectedEnvironment.username,
                }),
              ]
            })
            .catch(() => {
              this.showToastMessage('Could not fetch sobject fields')
            })
        }
      }
    },
    onClickRefreshObjectsButton() {
      this.soql = {
        sobjects: {},
      }
      this.soqlText = ''
      this.selectedSObject = null
      this.selectedSObjectChildRelationship = null
      this.selectedField = null
      this.fieldsSourceTabIndex = 0
      this.sobjectName = null
      this.sobjectChildRelationshipName = null
      this.parsedSOQL = null
      this.editingSOQL = null
      this.soqlResult = []
      this.soqlPlan = []
      this.errors = []
      this.selectedReference = null
      this.selectedReferenceName = null
      this.sobjectFields = []
      this.sobjectChildRelationshipFields = []
      this.$refs['sobject-fields' + this.name].clearAvailableFieldsList()
      this.$refs[
        'child-relationship-fields' + this.name
      ].clearAvailableFieldsList()
      this.isExecutingQuery = false
      this.isExecutingQueryPlan = false
      this.clearEnvironment(this.selectedEnvironment.username)
      this.isLoadingSObjects = true
      this.fetchSObjects({
        apiVersion: this.apiVersion,
        username: this.selectedEnvironment.username,
      })
        .catch(() => {
          this.showToastMessage('Could not fetch SObjects')
        })
        .finally(() => (this.isLoadingSObjects = false))
    },
    onClickExecuteQueryButton() {
      if (!this.isExecutingQuery && this.soqlText) {
        this.isExecutingQuery = true
        this.errors = []
        this.soqlResult = []
        this.soqlPlan = null
        this.sobjectChildRelationships = []
        this.sobjectChildRelationshipFields = []
        try {
          const soqlWithoutChildQueries = this.soqlText
            .replaceAll(/\s\s+|\n/g, ' ')
            .replaceAll(/\(.*\)/g, '')
            .replaceAll(/,/g, '')
          const soqlTokens = soqlWithoutChildQueries.split(' ')
          const fromIndex = soqlTokens.findIndex(
            (token) => token.toLowerCase() === 'from'
          )

          if (this.sobjectName !== soqlTokens[fromIndex + 1]) {
            this.sobjectName = soqlTokens[fromIndex + 1]

            this.soql = {
              sobjects: {
                [this.sobjectName]: {
                  fields: {},
                  modifiers: [],
                  functions: [],
                  main: true,
                  limit: null,
                  offset: null,
                },
              },
            }
          }

          this.fetchRecords({
            soql: this.soqlText,
            sobjectName: this.sobjectName,
            apiVersion: this.apiVersion,
            username: this.selectedEnvironment.username,
          })
            .then((responses) => {
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

              this.sobjectFields = [
                ...this.getSObjectFields({
                  sobjectName: this.sobjectName,
                  username: this.selectedEnvironment.username,
                }),
              ]

              this.sobjectChildRelationships = this.getSObjectChildRelationships(
                {
                  sobjectName: this.sobjectName,
                  username: this.selectedEnvironment.username,
                }
              )

              this.isExecutingQuery = false
              if (this.soqlResult && this.soqlResult.length) {
                this.$nextTick(() => {
                  this.$refs['query-results' + this.name].$el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start',
                  })
                })
              } else {
                this.showToastMessage('0 Records')
              }
            })
            .catch((error) => {
              this.showToastMessage('Could not execute Query')
              this.errors.push(error)
              this.isExecutingQuery = false
            })
        } catch {
          this.showToastMessage('Could not determine the Object Name')
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
      this.soqlResult = null
      this.errors = []
      try {
        this.parsedSOQL = parseQuery(this.soqlText)
        this.fetchSOQLPlan({
          soql: this.soqlText,
          apiVersion: this.apiVersion,
          username: this.selectedEnvironment.username,
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
    setApexClassWithQuery() {
      this.$axios
        .post(`${process.env.SALESFORCE_SERVER}/vscode/editor`, {
          editingSOQL: Object.keys(this.soql.sobjects)?.length
            ? this._makeSOQL(true)
            : this.soqlText,
        })
        .then(() => {
          this.showToastMessage('Apex Class updated with success')
        })
        .catch(() => {
          this.showToastMessage(
            'Could not update the Apex Class. Please, update it manually.'
          )
        })
    },
    onClickFormatQueryButton() {
      this.soqlText = this._formatSOQL(this.soqlText)
    },
    onSelectFieldReference({ referenceName, reference }) {
      this.selectedReferenceName = referenceName
      this.selectedReference = reference
      this.$bvModal.show(this.relationshipSelectorModalId)
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
            '(' +
              this._buildSingleSOQL(sobjectName, value, addApexModifiers).soql +
              ')'
          )
        }
      }

      if (childRelationshipQueries.length) {
        soqlText =
          soqlText.slice(0, childRelationshipQueryPosition - 1) +
          ', ' +
          childRelationshipQueries.join(', ') +
          soqlText.slice(childRelationshipQueryPosition)
      }

      soqlText = this._formatSOQL(soqlText)

      return soqlText
    },
    _buildSingleSOQL(soqlObjectName, soqlObjectConfig, addApexModifiers) {
      const fieldKeys = Object.keys(soqlObjectConfig.fields)

      const fields = fieldKeys.reduce(
        (previous, current, index) =>
          previous + (index > 0 ? ', ' : '') + current,
        ''
      )
      const filters = fieldKeys.reduce((previous, current, index) => {
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
      }, '')
      const orderBy = fieldKeys.reduce((previous, current, index) => {
        const field = soqlObjectConfig.fields[current]
        return (
          previous +
          (previous && field.orderBy.order ? ', ' : '') +
          (field.orderBy.order ? field.name + ' ' + field.orderBy.order : '') +
          (field.orderBy.nullsOrder ? ' ' + field.orderBy.nullsOrder : '')
        )
      }, '')

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
    _formatSOQL(soqlText) {
      soqlText = sqlFormatter.format(soqlText, { indent: '    ' })
      soqlText = formatDateTime(soqlText)
      soqlText = soqlText.replace(/\u200B|\u200B/, '')
      return soqlText
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
      this.soqlText = this._makeSOQL()
    },
    onCloseFieldForm() {
      this.selectedField = null
    },
    onRemoveRelationshipField({ fieldName }) {
      delete this.soql.sobjects[this.focusedReference].fields[fieldName]
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL()
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
        this.$refs['sobject-fields' + this.name].setAvailableFieldList(
          this.sobjectFields,
          this.soql.sobjects[this.sobjectName]?.fields || {}
        )
        this.$refs[
          'child-relationship-fields' + this.name
        ].setAvailableFieldList(
          this.sobjectChildRelationshipFields,
          this.soql.sobjects[this.sobjectChildRelationshipName]?.fields || {}
        )
        this.soqlText = this._makeSOQL()
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
    onClickClearAllFields() {
      Object.keys(this.soql.sobjects).forEach((sobjectName) => {
        delete this.soql.sobjects[sobjectName]
      })
      this.soql = { ...this.soql }
      this.sobjectFields = [
        ...this.getSObjectFields({
          sobjectName: this.sobjectName,
          username: this.selectedEnvironment.username,
        }),
      ]
      this.soqlText = this._makeSOQL()
      this.$refs['sobject-fields' + this.name].setAvailableFieldList(
        this.sobjectFields,
        this.soql.sobjects[this.sobjectName]?.fields || {}
      )
      this.$refs['child-relationship-fields' + this.name].setAvailableFieldList(
        this.sobjectChildRelationshipFields,
        this.soql.sobjects[this.sobjectChildRelationshipName]?.fields || {}
      )
    },
    onClearAllSObjectFields({ sobjectName }) {
      delete this.soql.sobjects[sobjectName]
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL()
      this.$refs['sobject-fields' + this.name].setAvailableFieldList(
        this.sobjectFields,
        this.soql.sobjects[this.sobjectName]?.fields || {}
      )
      this.$refs['child-relationship-fields' + this.name].setAvailableFieldList(
        this.sobjectChildRelationshipFields,
        this.soql.sobjects[this.sobjectChildRelationshipName]?.fields || {}
      )
    },
    onClearAllRelationshipFields(parentRelationshipName) {
      Object.keys(this.soql.sobjects[this.focusedReference].fields).forEach(
        (fieldName) => {
          if (fieldName.includes(parentRelationshipName + '.'))
            delete this.soql.sobjects[this.focusedReference].fields[fieldName]
        }
      )

      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL()
      this.$refs['sobject-fields' + this.name].setAvailableFieldList(
        this.sobjectFields,
        this.soql.sobjects[this.sobjectName]?.fields || {}
      )
      this.$refs['child-relationship-fields' + this.name].setAvailableFieldList(
        this.sobjectChildRelationshipFields,
        this.soql.sobjects[this.sobjectChildRelationshipName]?.fields || {}
      )
    },
    deleteField(sobjectName, field) {
      delete this.soql.sobjects[sobjectName].fields[field.name]
      if (!Object.keys(this.soql.sobjects[sobjectName].fields).length) {
        delete this.soql.sobjects[sobjectName]
      }
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL()
      this.$refs['sobject-fields' + this.name].setAvailableFieldList(
        this.sobjectFields,
        this.soql.sobjects[this.sobjectName]?.fields || {}
      )
      this.$refs['child-relationship-fields' + this.name].setAvailableFieldList(
        this.sobjectChildRelationshipFields,
        this.soql.sobjects[this.sobjectChildRelationshipName]?.fields || {}
      )
      this.$refs.fieldForm?.closeForm()
    },
    onDeleteSelectedField() {
      this.deleteField(this.selectedField.sobjectName, this.selectedField)
    },
    onRightClickToDeleteField({ sobjectName, field }) {
      this.deleteField(sobjectName, field)
    },
    onSelectEnvironment(environment) {
      this.selectedEnvironment = environment
    },
    onChangeSoqlConfig({ soqlConfig, sobjectName }) {
      this.soql.sobjects[sobjectName] = {
        ...this.soql.sobjects[sobjectName],
        ...soqlConfig,
      }
      this.soql = { ...this.soql }
      this.soqlText = this._makeSOQL()
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
    onClickRefreshEnvironmentsButton() {
      this.$emit('reloadEnvironments')
    },
    onCopySoqlText() {
      this.showToastMessage('Query copied with success.')
    },
    onCopySoqlTextError() {
      this.showToastMessage('Error while trying to copy the query.')
    },
  },
}

function removeKeys(obj, keys) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'object':
          if (keys.includes(prop)) {
            delete obj[prop]
          } else {
            removeKeys(obj[prop], keys)
          }
          break
        default:
          if (keys.includes(prop)) {
            delete obj[prop]
          }
          break
      }
    }
  }
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

/deep/ .nav-tabs {
  border-bottom: none !important;
}

.environment /deep/ .multiselect__tags {
  padding-top: 0 !important;
  padding-left: 0 !important;
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  border-bottom: thin solid var(--vscode-inputOption-activeBackground) !important;
}

.environment /deep/ .multiselect__tags input,
.environment /deep/ .multiselect__single,
.environment /deep/ .multiselect__tags .multiselect__placeholder {
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

.query-results {
  height: 900px;
}

select {
  height: 30px;
  width: 80px;
}
</style>
