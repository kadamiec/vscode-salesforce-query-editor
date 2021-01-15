<template>
  <div class="container vh-100 vw-100 py-2">
    <loading v-if="loading"/>
    <span v-else>
      <div class="row">
        <div class="col">
          <button
            v-if="configurations.displayEditor"
            class="btn btn-primary"
            @click="onClickHideFormButton()"
            v-shortkey="['ctrl', 'h']" 
            @shortkey="onClickHideFormButton()"
          >{{ showForm ? 'Hide Form' : 'Show Form' }}</button>
        </div>
        <div class="col-auto">
          <div class="row pr-3">
            <span
              v-b-tooltip.hover
              v-if="configurations.displayEditor"
              class="icon-top-bar fa fa-sync mr-2 my-auto"
              data-placement="top"
              title="Refresh SObjects" 
              @click="onClickRefreshObjectsButton()"
              v-shortkey="['ctrl', 'r']" 
              @shortkey="onClickRefreshObjectsButton()"
            />
            <a v-b-tooltip.hover target="_blank" href="https://github.com/AllanOricil/SOQL-Editor-Issues" class="mr-2 my-auto" title="Open an Issue">
              <i class="icon-top-bar fa fa-github"/>
            </a>
            <a v-b-tooltip.hover target="_blank" href="https://www.buymeacoffee.com/allanoricil" title="Buy me a Coffee if you liked it">
              <img src="../../static/images/buyMeACoffeIcon.svg" style="width: 30px; height: 30px;" alt="Kiwi standing on oval">
            </a>
          </div>
        </div>
      </div>

      <template v-if="configurations.displayEditor">
        <div v-if="showForm" class="row">
          <div class="col-4">
            <div class="row mb-3">
              <div class="col">
                <label for="fieldRelatedTo">Object</label>
                <select id="fieldRelatedTo" v-model="object" class="form-control" @change="onSelectSObjectName()">
                  <option v-for="(object) in objects"
                          :key="object.name"
                          :value="object.name">
                    {{ object.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div id="available-fields-to-select-container" class="d-flex flex-column">
                  <div v-for="(field) in availableFieldsToSelect"
                       :key="field.value"
                       class="p-1"
                       style="width: 100%">
                    <label v-if="field.reference" 
                           class="form-check-label custom-checkbox-container"
                           @click="onClickFieldReference(field)">
                      {{ field.value + '    (' + field.numberOfSelectedFields + ')' }}
                      <span class="field-has-next">➤</span>
                    </label>
                    <label v-else class="form-check-label custom-checkbox-container">
                      {{ field.value + (configurations.fieldType.form && field.type ? ' [' + field.type.toUpperCase() + ']' : '')}}
                      <input v-model="field.selected"
                             class="form-check-input"
                             type="checkbox"
                             @change="onClickFieldCheckbox(field)">
                      <span class="checkmark"/>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-8">
            <div class="row">
              <div class="col-12 form-row align-items-center">
                <div class="form-group col-md-5 mr-2">
                  <label for="orderByField">Order by:</label>
                  <select id="orderByField" v-model="orderByField" class="form-control">
                    <option v-for="(field) in sobjectFields"
                            :key="field.name"
                            :value="field.name">
                      {{ getFieldName(field.name) }}
                    </option>
                  </select>
                </div>
                <div class="form-group col mr-2">
                  <label for="orderByDirection" style="opacity: 0;">-</label>
                  <select id="orderByDirection" v-model="orderByDirection" class="form-control">
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                  </select>
                </div>
                <div class="form-group col">
                  <label for="nullsOrder" style="opacity: 0;">-</label>
                  <select id="nullsOrder" v-model="nullsOrder" class="form-control">
                    <option value="NULLS FIRST">Null First</option>
                    <option value="NULLS LAST">Null Last</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 form-row justify-content-between mb-2">
                <label class="my-auto" for="inputCity">Filter Results By:</label>
                <button class="btn btn-primary" @click="onClickAddFilterButton()">Add Filter</button>
              </div>
              <div class="col-12 px-0 overflow-auto" style="max-height: 310px;">
                <filter-entry
                  v-for="(filter, index) in filters"
                  :key="index"
                  :index="index"
                  :show-logic="index !== filters.length - 1"
                  :s-object-fields-to-filter="sobjectFields"
                  :configurations="configurations"
                  :object="object"
                  v-model="filters[index]"
                  @deleteEntry="onDeleteFilterEntry()"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="row my-2 mb-3">
        <div class="col-12">
          <div class="row mb-2">
            <div class="col mt-auto">
              <label>Enter or modify a SOQL query below:</label>
            </div>
            <div class="col-auto">
              <div class="row">
                <div class="col-auto pl-0" style="margin-top: 26px">
                  <button v-if="!configurations.format.automatically" 
                          class="btn btn-primary" 
                          @click="onClickFormatQueryButton()" 
                          :disabled="disableTextAreaActionButtons">
                          Format
                  </button>
                </div>
                <div v-if="configurations.displayEditor && showForm" class="col-auto pl-0">
                  <label for="limit-by-input">Limit:</label>
                  <input id="limit-by-input" v-model="limitBy" type="number" class="form-control" style="width: 100px" min="0">
                </div>
                <div v-if="configurations.displayEditor && showForm" class="col-auto pl-0">
                  <label for="offset-input">Offset:</label>
                  <input id="offset-input" v-model="offset" type="number" class="form-control" style="width: 100px" min="0" max="2000">
                </div>
                <div class="col-auto pl-0">
                  <label for="api-version-input">API:</label>
                  <select id="api-version-input" v-model="apiVersion" class="form-control" style="width: 70px;  ">
                    <option
                      v-for="(apiVersion, index) in apiVersions"
                      :key="index"
                      :value="'v' + apiVersion"
                    >{{ apiVersion }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <codemirror
                ref="cmEditor"
                v-model="soql"
                :options="cmOptions"
                heigth="100px"
                @ready="onCodeMirrorReady"
              />
            </div>
          </div>
          <div class="row mt-2 justify-content-between">
            <div class="col-auto">
              <button class="btn btn-primary"
                      v-shortkey="isExecutingSOQL ? ['ctrl', 'c'] : ['ctrl', 'r']"
                      @shortkey="isExecutingSOQL ? onClickCancel() : onClickExecuteQueryButton()"
                      @click="isExecutingSOQL ? onClickCancel() : onClickExecuteQueryButton()">
                {{ isExecutingSOQL ? 'Cancel' : 'Execute' }}
                <i v-if="isExecutingSOQL" class="fa fa-circle-o-notch fa-spin"/>
              </button>
              <button :disabled="disableTextAreaActionButtons" class="btn btn-primary" @click="onClickQueryPlanButton()">
                Query Plan
                <i v-if="isRetrievingSOQLPlan" class="fa fa-circle-o-notch fa-spin"/>
              </button>
              <button v-if="isUpdatingQuery" 
                      :disabled="disableTextAreaActionButtons" 
                      class="btn btn-primary" 
                      @click="onClickSetDocumentSOQLButton(true)">
                Update SOQL
              </button>
              <button v-else 
                      :disabled="disableTextAreaActionButtons" 
                      class="btn btn-primary" 
                      @click="onClickSetDocumentSOQLButton(false)">
                Add SOQL
              </button>
            </div>
            <div class="col-auto">
              <button v-if="showSaveChangesButton"
                      :disabled="isCommitingChanges" 
                      class="btn btn-primary" 
                      @click="onClickCommitButton()"
                      v-shortkey="['ctrl', 's']"
                      @shortkey="showSaveChangesButton && !isCommitingChanges ? onClickCommitButton() : null">
                Save
                <i v-if="isCommitingChanges" class="fa fa-circle-o-notch fa-spin"/>
              </button>
              <button v-if="showExportDataButton" 
                      :disabled="isExportingData" 
                      class="btn btn-primary"
                      v-shortkey="['ctrl', 'e']"
                      @shortkey="showExportDataButton && !isExportingData ? onClickExportAsSourceTree() : null"
                      @click="showExportDataButton && !isExportingData ? onClickExportAsSourceTree() : null">
                Export
                <i v-if="isExportingData" class="fa fa-circle-o-notch fa-spin"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SOQL PLAN -->
      <div v-if="soqlPlan && soqlPlan.length > 0">
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
                    <td><span v-for="(field, indexField) in plan.fields" :key="indexField">{{ field }}<br></span></td>
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
            <div class="p-2" style="border: thin solid var(--vscode-badge-background); background-color: var(--vscode-input-background); color: var(--vscode-input-foreground)">
              <p style="border-bottom: thin slid var(--vscode-badge-background) !important"><b>Notes:</b></p>
              <span v-for="(plan, index) in soqlPlan" :key="index">
                <li v-for="(note, indexNote) in plan.notes" :key="indexNote">
                  {{ note.description }}. Table: {{ note.tableEnumOrId }} Fields: {{ note.fields }}
                </li>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- # RESULTS -->
      <div v-if="soqlResult" class="row">
        <div class="col-12">
          <label class="m-auto">{{soqlResult.length}} Results</label>
        </div>
      </div>

      <!-- SOQL DATA -->
      <div v-if="isSoqlResultsNotEmpty" class="row" style="max-height: 500px; overflow: scroll">
        <div class="col-12">
          <div class="table-responsive">
            <table ref="table" class="table table-dark table-sm table-bordered">
              <thead>
                <tr>
                  <th v-if="showTableActionButtons" style="width: 25px; max-width: 25px;"/>
                  <th v-for="(field) in soqlResultFields" 
                      :key="field"
                      scope="col">
                      {{ getFieldName(field) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, recordIndex) in soqlResult" :key="recordIndex">
                  <td v-if="showTableActionButtons" style="width: 40px; max-width: 40px;">
                    <div class="d-flex flex-column">
                      <span v-if="editingRecords[record.Id]">
                        <button :disabled="isCommitingChanges" 
                                class="btn btn-primary btn-sm table-button"
                                @click="onClickCancelChangesButton(record.Id, recordIndex)">
                          <span class="fa fa-times-circle fa-xs"/>
                        </button>
                      </span>
                      <span v-else>
                        <!--<button :disabled="isCommitingChanges"
                                class="btn btn-primary btn-sm table-button mb-1"
                                @click="onClickEditRecordButton(record.Id, recordIndex)">
                          <span class="fa fa-pencil fa-xs"/>
                        </button>-->
                        <button :disabled="isCommitingChanges"
                                class="btn btn-primary btn-sm table-button"
                                @click="onClickDeleteButton(record.Id, recordIndex)">
                          <span class="fa fa-trash fa-xs"/>
                        </button>
                      </span>
                    </div>
                  </td>
                  <template v-for="(value, fieldName, valueIndex) in record">
                    <td :key="valueIndex"
                        class="fit"
                        :class="{'soql-result-table-cell' : sobjectFieldsMappedByName[fieldName] && sobjectFieldsMappedByName[fieldName].updateable}"
                        @dblclick="record.Id && sobjectFieldsMappedByName[fieldName] && sobjectFieldsMappedByName[fieldName].updateable ? onClickEditRecordButton(record.Id, recordIndex) : null">
                      <template v-if="typeof value === 'object' && value !== null">
                        <vue-json-pretty v-if="configurations.nestedResults.style"  
                                         :data="value" 
                                         :showLine="false" 
                                         :deep="configurations.nestedResults.expanded ? (configurations.nestedResults.depth ? configurations.nestedResults.depth : 1) : 0">
                        </vue-json-pretty>
                        <pre v-else>{{ JSON.stringify(value, undefined, 2).replace(/^\s*/g, '') }}</pre>
                      </template>
                      <span v-else-if="sobjectFieldsMappedByName[fieldName] && ['id', 'reference'].includes(sobjectFieldsMappedByName[fieldName].type.toLowerCase())"
                            class="record-id"
                            @click="onClickRecordId(value)">
                        {{ value }}
                      </span>
                      <span v-else-if="sobjectFieldsMappedByName[fieldName] && sobjectFieldsMappedByName[fieldName].updateable">
                        <template v-if="editingRecords[record.Id]">
                          <select v-if="sobjectFieldsMappedByName[fieldName].picklistValues.length"
                                  v-model="soqlResult[recordIndex][fieldName]"
                                  @change="onSOQLResultValueChange(record.Id, recordIndex, fieldName)">
                            <option value=""></option>
                            <option v-for="(picklistValue, picklistValueIndex) in sobjectFieldsMappedByName[fieldName].picklistValues.filter(picklistValue => picklistValue.active)"
                                    :key="picklistValueIndex"
                                    :value="picklistValue.value">
                              {{ picklistValue.label }}
                            </option>
                          </select>
                          <label v-else-if="sobjectFieldsMappedByName[fieldName].type.toLowerCase() === 'boolean'" 
                                class="form-check-label custom-checkbox-container">
                            <input v-model="soqlResult[recordIndex][fieldName]"
                                  @change="onSOQLResultValueChange(record.Id, recordIndex, fieldName)"
                                  class="form-check-input"
                                  type="checkbox">
                            <span class="checkmark"/>
                          </label>
                          <input v-else
                                v-model="soqlResult[recordIndex][fieldName]"
                                @keyup="onSOQLResultValueChange(record.Id, recordIndex, fieldName)"
                                type="text">
                        </template>
                        <span v-else>{{ value }}</span>
                      </span>
                      <span v-else>
                        {{ value }}
                      </span>
                      <div v-if="!editingRecords[record.Id] && sobjectFieldsMappedByName[fieldName] && sobjectFieldsMappedByName[fieldName].updateable"></div>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div v-if="errors" class="row">
        <template v-for="(error, errorIndex) in errors">
          <span :key="errorIndex">
            <div class="col-12">
              <label class="m-auto">{{ error.message }}</label>
            </div>
          </span>
        </template>
        
      </div>

      <!-- RELATIONSHIP SELECTOR -->
      <b-modal
        id="relationshipSelectorModal"
        :title="selectedReference + ': ' + selectedReferenceValue"
        size="xl"
        centered
        cancel-disabled
      >
        <relationship-selector
          ref="relationshipSelector"
          :reference-name="selectedReference"
          :reference-value="selectedReferenceValue"
          :selected-relationship-fields="selectedRelationshipFields[selectedReferenceValue]"
          @removeField="onRemoveRelationshipField"
          @insertField="onInsertRelationshipField"
          @insertAllFields="onInsertAllRelationshipFields"
          @clearAllFields="onClearAllRelationshipFields"
        />
        <template v-slot:modal-footer="{ close }">
          <button type="button" class="btn btn-md danger" @click="close()">Close</button>
        </template>
      </b-modal>

      <!-- COMMIT RESULT -->
      <b-modal
        id="commitResultModal"
        size="xl"
        title="Update Errors"
        centered
        cancel-disabled>
        <ol>
          <li v-for="(commitResult, index) in commitResults" :key="index">
            <p>{{ commitResult.Id }}</p>
            <ul>
              <li v-for="(commitResultError, indexError) in commitResult.errors" :key="indexError">
                {{ commitResultError.statusCode }} {{ commitResultError.message }} {{ commitResultError.fields }}
              </li>
            </ul>
          </li>
        </ol>
        <template v-slot:modal-footer="{ close }">
          <button type="button" class="btn btn-md danger" @click="close()">Close</button>
        </template>
      </b-modal>

      <!-- DELETE RESULT -->
      <b-modal
        id="deleteResultModal"
        size="xl"
        title="Delete Errors"
        centered
        cancel-disabled>
        <span v-if="deleteResult">{{ deleteResult.message }}</span>
        <template v-slot:modal-footer="{ close }">
          <button type="button" class="btn btn-md danger" @click="close()">Close</button>
        </template>
      </b-modal>
    </span>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import { decode } from 'html-entities';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/lib/codemirror.css';
import '../../static/css/vscode-dark.css';
import FilterEntry from './filter-entry.vue';
import sqlFormatter from '@allanoricil/sql-formatter';
import { formatQuery, parseQuery } from 'soql-parser-js';
import RelationshipSelector from './relationship-selector.vue';
import { checkDifferences, getDifferences, removeKeys, convertArrayToObject } from '../utils/objectUtils.js';
import Loading from './loading.vue';
import apiVersions from '../static/api-versions.json';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css'

export default {
    name: 'Editor',
    components: {
        codemirror,
        FilterEntry,
        RelationshipSelector,
        Loading,
        VueJsonPretty
    },
    data() {
      return {
          configurations: {
              displayEditor: true,
              fieldType: {
                form: false,
                table: false
              },
              format: {
                automatically: false
              },
              nestedResults: {
                style: true,
                expanded: true,
                depth: 1
              }
          },
          soqlParser: {
            format: {
              fieldMaxLineLength: 1,
              fieldSubqueryParensOnOwnLine: true,
              whereClauseOperatorsIndented: true
            }
          },
          parsedSOQL: null,
          editingQuery: null,
          apiVersion: 'v50.0',
          apiVersions: apiVersions,
          commitResults: [],
          deleteResult: undefined,
          excludedKeys: ['error', 'attributes'],
          loading: true,
          cmOptions: {
              tabSize: 4,
              mode: 'text/x-mysql',
              theme: 'vscode-dark',
              lineNumbers: true,
              lineWrapping: true,
              line: true,
          },
          soql: '',
          soqlResult: null,
          soqlPlan: undefined,
          errors: [],
          object: undefined,
          filters: [
              {
                  field: undefined,
                  operator: undefined,
                  logic: 'AND',
                  value: undefined,
                  filter: undefined,
              },
          ],
          selectedReference: undefined,
          selectedReferenceValue: undefined,
          sobjectFields: [],
          sobjectFieldsMappedByName: {},
          availableFieldsToSelect : [],
          selectedFields: [],
          selectedRelationshipFields: {},
          computedRelationshipFields: '',
          dispatchedSObjectsDescribeRequests: [],
          orderByField: undefined,
          orderByDirection: 'ASC',
          nullsOrder: 'NULLS FIRST',
          limitBy: undefined,
          offset: undefined,
          showForm: true,
          isExecutingSOQL: false,
          isRetrievingSOQLPlan: false,
          isCommitingChanges: false,
          isExportingData: false,
          editingRecords: {},
          showSaveChangesButton: false,
      };
    },
    computed: {
      objects() {
        return this.$store.getters['sobjects/referenceableObjects'];
      },
      computedSelectedFields(){
        const selectedObjectFields = this.selectedFields.reduce((previous, current, index) => {
            return previous + (index !== 0 ? ', ' : '') + current.value;
        }, '');

        return [selectedObjectFields, this.computedRelationshipFields].filter(Boolean).join(', ');
      },
      computedFilters() {
        return this.filters.length !== 0 && this.filters[0].filter
            ? this.filters.reduce((previous, current, index) => {
                const previousLogic =
                        index > 0 && this.filters[index - 1].logic
                            ? this.filters[index - 1].logic + ' '
                            : '';

                return previous + ' ' + previousLogic + (current.filter || '');
            }, ' WHERE')
            : '';
      },
      computedOrderBy() {
        return this.orderByField
            ? ` ORDER BY ${this.orderByField} ${this.orderByDirection} ${this.nullsOrder}`
            : '';
      },
      computedLimitBy() {
        return this.limitBy ? ` LIMIT ${this.limitBy}` : '';
      },
      computedOffset(){
        return this.offset ? ` OFFSET ${this.offset}` : '';
      },
      soqlResultFields() {
        return this.isSoqlResultsNotEmpty
            ? Object.keys(this.soqlResult[0]).filter(
                (key) => !this.excludedKeys.includes(key)
            )
            : [];
      },
      getSObjectByName(){
        return this.$store.getters['sobjects/getSObjectByName'];
      },
      showTableActionButtons(){
        if(!this.soqlResultFields.includes('Id')) return false;
        let isThereAnUpdateableField = false;
        for(const fieldIndex in this.soqlResultFields){
          const fieldName = this.soqlResultFields[fieldIndex];
          if(this.sobjectFieldsMappedByName[fieldName] && this.sobjectFieldsMappedByName[fieldName].updateable){
            isThereAnUpdateableField = true;
            break;
          }
        }
        return this.soqlResultFields.includes('Id') && isThereAnUpdateableField;
      },
      showExportDataButton(){
        return this.soql && this.isSoqlResultsNotEmpty;
      },
      updateableFields(){
        return this.sobjectFields.filter(field => field.updateable).map(field => field.name);
      },
      disableTextAreaActionButtons(){
        return !this.soql || this.isExecutingSOQL || this.isRetrievingSOQLPlan || this.isCommitingChanges;
      },
      isSoqlResultsNotEmpty(){
        return this.soqlResult && this.soqlResult.length;
      },
      isUpdatingQuery(){
        return this.editingQuery && this.editingQuery.start !== this.editingQuery.end;
      }
    },
    watch: {
      object(newValue){
        if(newValue) this.resetData();
      },
      sobjectFields(newValues){
        if(this.availableFieldsToSelect.length === 0){
          this.availableFieldsToSelect = newValues.reduce((previous, current) => {
            let array = [];
            array.push({
                value: current.name,
                type: current.type,
                selected: false,
            });

            if(current.referenceTo.length === 1 && current.relationshipName){
              array.push({
                value: current.relationshipName || current.name.replace('Id', ''),
                reference: current.referenceTo[0],
                numberOfSelectedFields: 0,
              });
            }

            if(current.namePointing){
              if(current.relationshipName){
                array.push({
                  value: current.relationshipName + '.Type',
                  type: 'String',
                  selected: false
                });
                array.push({
                  value: current.relationshipName + '.Name',
                  type: 'String',
                  selected: false
                });
              }

              if(current.referenceTo.includes('User')){
                array.push({
                  value: current.relationshipName + '.FirstName',
                  type: 'String',
                  selected: false
                });
                array.push({
                  value: current.relationshipName + '.LastName',
                  type: 'String',
                  selected: false
                });
              }
            }

            return previous.concat(array);
          }, []);

          if(this.availableFieldsToSelect.length > 0){
            this.availableFieldsToSelect = [{ value: 'COUNT(Id)', type: null, selected: false }, ...this.availableFieldsToSelect];
          }
        }

        this.sobjectFieldsMappedByName = convertArrayToObject(newValues, 'name');
      },
      computedSelectedFields(){
        this.createSOQL();
      },
      computedFilters(){
        this.createSOQL();
      },
      orderByDirection() {
        this.createSOQL();
      },
      orderByField() {
        this.createSOQL();
      },
      nullsOrder() {
        this.createSOQL();
      },
      limitBy() {
        this.createSOQL();
      },
      offset(){
        this.createSOQL();
      },
      isExecutingSOQL(newValue){
        if(newValue){
          this.soqlPlan = undefined;
          this.soqlResult = undefined;
          this.errors = [];
          this.editingRecords = {};
        }
      },
      isRetrievingSOQLPlan(newValue){
        if(newValue){
          this.soqlPlan = undefined;
          this.soqlResult = undefined;
          this.errors = [];
          this.editingRecords = {};
        }
      },
    },
    beforeMount() {
      window.vscode.post({ cmd: 'getConfigurations' });
      window.vscode.post({ cmd: 'getEditingSOQL' });
      window.vscode.onLoading(()=>{
        this.loading = true;
      });
      window.vscode.onReceiveObjects((message) => {
        this.$store.commit('sobjects/setSObjects', message.data);
        if(this.parsedSOQL && this.parsedSOQL.sObject){
          const objectDetail = this.getSObjectByName(this.parsedSOQL.sObject);
          if(objectDetail) this.object = objectDetail.name;
        }
        this.loading = false;
      });
      window.vscode.onReceiveSObjectDescription((message) => {
        if (message.data) {
          const sobjectName = message.data.name;
          this.$store.commit('sobjects/setSObject', message.data);
          if(sobjectName.toLowerCase() === this.object.toLowerCase()){
            this.object = sobjectName;
            this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](sobjectName);
          }

          this.sobjectFields.forEach(field => {
            field.referenceTo.forEach(reference => {
              const referenceFields = this.$store.getters['sobjects/getSObjectFields'](reference);
              if (referenceFields && !referenceFields.length && !this.dispatchedSObjectsDescribeRequests.includes(reference)) {
                this.dispatchedSObjectsDescribeRequests.push(reference);
                this.$store.dispatch('sobjects/getSObjectDescribe', reference);
              }
            });
          });
        }
      });
      window.vscode.onReceiveSOQLResult((message) => {
        this.isExecutingSOQL = false;
        let response = message.data;
        if (response.errorCode) {
            this.errors.push(response);
            this.soqlResult = [];
        } else {
            response.forEach((record) => removeKeys(record, ['attributes', 'done', 'totalSize']));
            this.soqlResult = [...response];
        }
      });
      window.vscode.onReceiveSOQLResultAndSObjectDescribe((message) => {
        this.isExecutingSOQL = false;
        const sobjectDescribeResponse = message.data[0];
        if(sobjectDescribeResponse.result.name){
          const sobjectName = sobjectDescribeResponse.result.name;
          this.$store.commit('sobjects/setSObject', sobjectDescribeResponse.result);
          if(sobjectName.toLowerCase() === this.object.toLowerCase()){
            this.object = sobjectDescribeResponse.result.name;
            this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](sobjectName);
          }

          this.sobjectFields.forEach(field => {
            field.referenceTo.forEach(reference => {
              const referenceFields = this.$store.getters['sobjects/getSObjectFields'](reference);
              if (referenceFields && !referenceFields.length && !this.dispatchedSObjectsDescribeRequests.includes(reference)) {
                this.dispatchedSObjectsDescribeRequests.push(reference);
                this.$store.dispatch('sobjects/getSObjectDescribe', reference);
              }
            });
          });
        }else{
          this.errors.push({ message: decode(sobjectDescribeResponse.result[0].message) });
        }
        
        const soqlResultResponse = message.data[1];
        if(soqlResultResponse.result.records) {
            soqlResultResponse.result.records.forEach((record) => removeKeys(record, ['attributes', 'done', 'totalSize']));
            this.soqlResult = [...soqlResultResponse.result.records];
        }else {
            this.errors.push({ message: decode(soqlResultResponse.result[0].message) });
            this.soqlResult = [];
        }
      });
      window.vscode.onReceiveSOQLPlan((message) => {
          this.isRetrievingSOQLPlan = false;
          let response = message.data;
          if (response.errorCode) {
              this.errors.push({ message: decode(response.message) });
          } else {
              this.soqlPlan = response;
          }
      });
      window.vscode.onReceiveCommitResult((message) => {
        const commitResultResponse = message.data;
        commitResultResponse.forEach((commitResult, commitResultIndex) => {
          if(!commitResult.success){
            this.commitResults.push({...commitResult, Id: this.soqlResult[commitResultIndex].Id});
          }else{
            delete this.editingRecords[commitResult.id];
          }
        });
        this.isCommitingChanges = false;
        this.showSaveChangesButton = this.getShowSaveChangesButtonValue();
        if(this.commitResults.length) this.$bvModal.show('commitResultModal');
      });
      window.vscode.onReceiveDeleteResult((message) => {
        const deleteResponse = message.data;
        if(deleteResponse.errorCode){
          this.deleteResult = deleteResponse;
          this.$bvModal.show('deleteResultModal');
        }else{
          this.$delete(this.soqlResult, deleteResponse.recordIndex);
          this.$bvToast.toast(`The Record [${deleteResponse.recordId}] has been deleted.`, {
            toaster: 'b-toaster-bottom-right',
            solid: true,
            appendToast: true,
            noCloseButton: true
          });
        }
      });
      window.vscode.onReceiveConfigurations((message) => {
        this.configurations = message.data;
      });
      window.vscode.onReceiveEditingSOQL((message) => {
        this.editingQuery = message.data;
        if(this.editingQuery.soql){
          this.soql = this.editingQuery.soql.replace('[', '').replace(']', '').replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ');
          if(this.configurations.format.automatically) sqlFormatter.format(this.soql);
          this.soqlResult = null;
          this.parsedSOQL = parseQuery(this.soql);
          this.object = this.parsedSOQL.sObject;
          this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](this.object);
          if(!this.sobjectFields.length && !this.dispatchedSObjectsDescribeRequests.includes(this.object)){
            this.$store.dispatch('sobjects/getSObjectDescribe', this.object);
          }

          if(this.soql && this.object) {
            this.onClickExecuteQueryButton();
          }
        }
      });
    },
    methods: {
      onSelectSObjectName(event){
        this.object = event.target.value;
        this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](this.object);
        if(!this.sobjectFields.length && !this.dispatchedSObjectsDescribeRequests.includes(this.object)){
          this.$store.dispatch('sobjects/getSObjectDescribe', this.object);
        }
      },
      onClickRefreshObjectsButton() {
        this.resetData();
        this.sobjectFields = [];
        this.object = undefined;
        this.soql = undefined;
        this.parsedSOQL = undefined;
        this.loading = true;
        this.$store.commit('sobjects/clearSObjectsDetails');
        window.vscode.post({
            cmd: 'refreshSObjects',
        });
      },
      onClickAddFilterButton() {
        this.filters.push({
          field: undefined,
          operator: undefined,
          value: undefined,
          filter: undefined,
          logic: undefined,
        });
      },
      onClickExecuteQueryButton() {
        if(!this.isExecutingSOQL){
          this.$nextTick(() => this.isExecutingSOQL = true);
          window.vscode.post({
            cmd: 'executeSOQL2',
            args: {
              soql: this.soql,
              sObjectName: this.object,
              apiVersion: this.apiVersion
            }
          });
        }
      },
      onClickCancel(){
        window.vscode.post({ cmd: 'cancelSOQLRequest' });
      },
      onClickQueryPlanButton() {
        this.isRetrievingSOQLPlan = true;
        window.vscode.post({
            cmd: 'getSOQLPlan',
            args: {
                soql: this.soql,
                apiVersion: this.apiVersion
            }
        });
      },
      onClickSetDocumentSOQLButton(isUpdate) {
        window.vscode.post({
          cmd: 'setDocumentSOQL',
          args: {
            soql: this.soql,
            isUpdate
          }
        });
      },
      createSOQL() {
        if(this.computedSelectedFields){
          const soql =
            'SELECT ' +
            this.computedSelectedFields +
            ' FROM ' + this.object +
            this.computedFilters +
            this.computedOrderBy +
            this.computedLimitBy + 
            this.computedOffset;
          this.soql = this.configurations.format.automatically ? sqlFormatter.format(soql) : soql;
        }else{
          this.soql = '';
        }
      },
      onClickFormatQueryButton() {
        this.soql = sqlFormatter.format(this.soql);
      },
      onCodeMirrorReady(cm) {
        cm.setSize(null, 200);
      },
      onDeleteFilterEntry(index) {
        this.filters.splice(index, 1);
      },
      onClickFieldReference(field){
        this.selectedReferenceValue = field.value;
        this.selectedReference = field.reference;
        this.$bvModal.show('relationshipSelectorModal');
      },
      resetData() {
        this.soqlResult = undefined;
        this.soqlPlan = undefined;
        this.errors = [];
        this.selectedFields = [];
        this.commitResults = [];
        this.deleteResult = undefined;
        this.filters = [
          {
            field: undefined,
            operator: undefined,
            logic: 'AND',
            value: undefined,
            filter: undefined,
          },
        ],
        this.selectedReference = undefined;
        this.selectedReferenceValue = undefined;
        this.availableFieldsToSelect = [];
        this.selectedRelationshipFields = {};
        this.computedRelationshipFields = '';
        this.orderByField = undefined;
        this.orderByDirection = 'ASC';
        this.nullsOrder = 'NULLS FIRST';
        this.limitBy = undefined;
        this.offset = undefined;
        this.isExecutingSOQL = false;
        this.isRetrievingSOQLPlan = false;
        this.isCommitingChanges = false;
        this.recordIdToDelete = undefined;
        this.showExportDataButton = false;
        this.isExportingData = false;
      },
      onClickHideFormButton(){
        this.showForm = !this.showForm;
      },
      onClickRecordId(id){
        window.vscode.post({
          cmd: 'openRecordDetailPage',
          args: id
        });
      },
      onClickEditRecordButton(recordId, rowIndex){
        this.editingRecords[recordId] = { record: {...this.soqlResult[rowIndex]}, rowIndex , differences: {}};
        this.$forceUpdate();
      },
      onClickCancelChangesButton(recordId, rowIndex){
        this.soqlResult.splice(rowIndex, 1, this.editingRecords[recordId].record);
        delete this.editingRecords[recordId];
        this.showSaveChangesButton = this.getShowSaveChangesButtonValue();
        this.$forceUpdate();
      },
      onClickDeleteButton(recordId, rowIndex){
        this.$bvModal.msgBoxConfirm('Are you sure you want to delete this record?', {
          centered: true
        })
        .then(value => {
          if(value === true){
            window.vscode.post({
              cmd: 'deleteRecord',
              args: {
                sObjectName: this.object,
                recordId,
                rowIndex,
                apiVersion: this.apiVersion
              }
            });
          }
        })
      },
      onClickCommitButton(){
        this.commitResults = [];
        const recordsToUpdate = [];
        for (const recordId in this.editingRecords) {
          const editingRecordDifferences = this.editingRecords[recordId].differences;
          if(Object.keys(editingRecordDifferences).length){
            recordsToUpdate.push({...editingRecordDifferences, id: recordId, attributes: { type: this.object }});
          }
        };

        window.vscode.post({
          cmd: 'commitChanges',
          args: {
              recordsToUpdate
          }
        });

        this.isCommitingChanges = true;
      },
      onSOQLResultValueChange(recordId, recordIndex, fieldName){
        if((this.editingRecords[recordId].record[fieldName] && this.editingRecords[recordId].record[fieldName] !== this.soqlResult[recordIndex][fieldName]) || 
           (this.soqlResult[recordIndex][fieldName] && this.editingRecords[recordId].record[fieldName] !== this.soqlResult[recordIndex][fieldName])){
          this.editingRecords[recordId].differences[fieldName] = this.soqlResult[recordIndex][fieldName];
        }else{
          delete this.editingRecords[recordId].differences[fieldName];
        }

        this.showSaveChangesButton = this.getShowSaveChangesButtonValue();
      },
      onClickFieldCheckbox(field){
        if(field.selected){
          this.selectedFields.push(field);
        }else{
          const indexOf = this.selectedFields.findIndex( f => field.value === f.value );
          this.selectedFields.splice(indexOf, 1);
        }
      },
      updateNumberOfSelectedFields(parentRelationshipName){
        this.availableFieldsToSelect.forEach(availableFieldToSelect => {
          if(availableFieldToSelect.value === parentRelationshipName){
            if(this.selectedRelationshipFields[parentRelationshipName].length){
              availableFieldToSelect.numberOfSelectedFields = this.selectedRelationshipFields[parentRelationshipName].length;
            }else{
              availableFieldToSelect.numberOfSelectedFields = 0;
            }
          }
        });
      },
      computeRelationshipFields(){
        this.computedRelationshipFields = [].concat(...Object.values(this.selectedRelationshipFields)).join(', ');
        this.createSOQL();
      },
      onRemoveRelationshipField({ parentRelationshipName, field }){
        const relationshipFieldIndex = this.selectedRelationshipFields[parentRelationshipName].findIndex(relationshipField => relationshipField === field);
        this.selectedRelationshipFields[parentRelationshipName].splice(relationshipFieldIndex, 1);
        this.computeRelationshipFields();
        this.updateNumberOfSelectedFields(parentRelationshipName);
      },
      onInsertRelationshipField({ parentRelationshipName, field }){
        if(!this.selectedRelationshipFields[parentRelationshipName])  this.selectedRelationshipFields[parentRelationshipName]  = [];
        this.selectedRelationshipFields[parentRelationshipName].push(field);
        this.computeRelationshipFields();
        this.updateNumberOfSelectedFields(parentRelationshipName);
      },
      onInsertAllRelationshipFields({ parentRelationshipName, fields }){
        if(!this.selectedRelationshipFields[parentRelationshipName])  this.selectedRelationshipFields[parentRelationshipName]  = [];
        this.selectedRelationshipFields[parentRelationshipName].push(...fields);
        this.computeRelationshipFields();
        this.updateNumberOfSelectedFields(parentRelationshipName);
      },
      onClearAllRelationshipFields(parentRelationshipName){
        this.selectedRelationshipFields[parentRelationshipName]  = [];
        this.computeRelationshipFields();
        this.updateNumberOfSelectedFields(parentRelationshipName);
      },
      onClickExportAsSourceTree(){
        this.isExportingData = true;
        window.vscode.post({
          cmd: 'exportSourceTree',
          args: {
              soql: this.soql,
              apiVersion: this.apiVersion
          }
        }).then(result => this.isExportingData = false);
      },
      getShowSaveChangesButtonValue(){
        for (const recordId in this.editingRecords) {
          const editingRecord = this.editingRecords[recordId];
          const differences = editingRecord.differences;
          if(Object.keys(differences).length) return true;
        };
        return false;
      },
      getFieldName(field){
        return field + (this.configurations.fieldType.table && this.sobjectFieldsMappedByName[field] && this.sobjectFieldsMappedByName[field].type ? ' [' + this.sobjectFieldsMappedByName[field].type.toUpperCase() + ']': '');
      }
    },
};
</script>

<style scoped>
#available-fields-to-select-container{
  height: 352px;
  border: 1px solid var(--vscode-inputOption-activeBackground) !important;
  border-radius: 0 !important;
  background-color: var(--vscode-input-background) !important;
  color: var(--vscode-input-foreground) !important;
  overflow-y: auto;
}

.record-id{
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
}

.record-id:hover{
  text-decoration: underline !important;
}

.icon-top-bar{
  color: var(--vscode-menu-separatorBackground);
  font-size: 2.3em;
}

.icon-top-bar:hover{
  color: var(--vscode-badge-foreground);
  cursor: pointer;
}

.field-has-next{
  position: absolute !important;
  top: 0px !important;
  left: 4px !important;
  height: 20px !important;
  width: 20px !important;
  background-color: var(--vscode-input-background) !important;
}

.field-has-next:hover{
  color: var(--vscode-button-background) !important;
}

.table-button{
  width: 30px;
}

.soql-result-table-cell{
  cursor: pointer;
  position: relative;
}

.soql-result-table-cell:hover{
  background-color: rgba(var(--vscode-input-background), 0.8);
}

.soql-result-table-cell > div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  display: table;
}

.soql-result-table-cell > div:hover{
  opacity: 0.05;
  background-color: var(--vscode-menu-foreground);
}
</style>
