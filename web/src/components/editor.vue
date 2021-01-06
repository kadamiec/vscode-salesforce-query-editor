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
                <select id="fieldRelatedTo" v-model="object" class="form-control">
                  <option
                    v-for="(object, index) in objects"
                    :key="index"
                    :value="object.name"
                  >{{ object.name }}</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="d-flex flex-column"
                     style="height: 352px;
                            border: 1px solid var(--vscode-inputOption-activeBackground) !important;
                            border-radius: 0 !important;
                            background-color: var(--vscode-input-background) !important;
                            color: var(--vscode-input-foreground) !important;
                            overflow-y: auto;">
                  <div
                    v-for="(field, index) in availableFieldsToSelect"
                    :key="index"
                    :value="field"
                    class="p-1"
                    style="width: 100%"
                  >
                    <label v-if="field.hasNext" class="form-check-label custom-checkbox-container"
                           @click="onClickFieldReference(field)">
                      {{ field.value + '    (' + field.numberOfSelectedFields + ')' }}
                      <span class="field-has-next">➤</span>
                    </label>
                    <label v-else class="form-check-label custom-checkbox-container">
                      {{ field.value + (configurations.showFieldType && field.type ? ' [' + field.type.toUpperCase() + ']' : '')}}
                      <input
                        v-model="field.selected"
                        class="form-check-input"
                        type="checkbox"
                        @change="onClickFieldCheckbox(field)"
                      >
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
                    <option
                      v-for="(field, index) in sobjectFields"
                      :key="index"
                      :value="field.name"
                    >{{ field.name + (configurations.showFieldType && field.type ? ' [' + field.type.toUpperCase() + ']': '')}}</option>
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
                  @deleteEntry="onDeleteFilterEntry"
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
                  <button v-if="!configurations.autoFormatSOQL" 
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
              <button :disabled="disableTextAreaActionButtons" class="btn btn-primary" @click="onClickExecuteQueryButton()">
                Execute
                <i v-if="isExecutingSOQL" class="fa fa-circle-o-notch fa-spin"/>
              </button>
              <button :disabled="disableTextAreaActionButtons" class="btn btn-primary" @click="onClickQueryPlanButton()">
                Query Plan
                <i v-if="isRetrievingSOQLPlan" class="fa fa-circle-o-notch fa-spin"/>
              </button>
              <button :disabled="disableTextAreaActionButtons" class="btn btn-primary" @click="onClickAddToApexButton()">
                Add to Apex
              </button>
            </div>
            <div class="col-auto">
              <span v-if="showCommitButton">
                <button :disabled="isCommitingChanges" class="btn btn-primary" @click="onClickCommitButton">
                  Save
                  <i v-if="isCommitingChanges" class="fa fa-circle-o-notch fa-spin"/>
                </button>
              </span>
              <span v-if="showExportDataButton">
                <button :disabled="isExportingData" class="btn btn-primary" @click="onClickExportAsSourceTree">
                  Export
                  <i v-if="isExportingData" class="fa fa-circle-o-notch fa-spin"/>
                </button>
              </span>
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

      <!-- SOQL DATA -->
      <div v-if="soqlResult" class="row">
        <div class="col-12">
          <label class="m-auto">{{soqlResult.length}} Results</label>
        </div>
      </div>
      <div v-if="isSoqlResultsNotEmpty" class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-dark table-sm table-bordered">
              <thead>
                <tr>
                  <th v-if="showTableActionButtons" style="width: 30px;"/>
                  <th v-for="(field, indexFieldName) in soqlResultFields" :key="indexFieldName" scope="col">{{ field + (configurations.showFieldTypeTable && sobjectFieldsMappedByName[field] && sobjectFieldsMappedByName[field].type ? ' [' + sobjectFieldsMappedByName[field].type.toUpperCase() + ']': '')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, recordIndex) in soqlResult" :key="recordIndex">
                  <td v-if="showTableActionButtons">
                    <div class="d-flex flex-column">
                      <span v-if="record.editing">
                        <button :disabled="isCommitingChanges" 
                                class="btn btn-primary btn-sm table-button"
                                @click="onClickCancelChangesButton(recordIndex)">
                          <span class="fa fa-times-circle fa-xs"/>
                        </button>
                      </span>
                      <span v-else>
                        <button :disabled="isCommitingChanges"
                                class="btn btn-primary btn-sm table-button mb-1"
                                @click="onClickEditRecordButton(recordIndex)">
                          <span class="fa fa-pencil fa-xs"/>
                        </button>
                        <button :disabled="isCommitingChanges"
                                class="btn btn-primary btn-sm table-button"
                                @click="onClickDeleteButton(recordIndex)">
                          <span class="fa fa-trash fa-xs"/>
                        </button>
                      </span>
                    </div>
                  </td>
                  <template v-for="(value, fieldName, valueIndex) in record">
                    <td v-if="!excludedKeys.includes(fieldName)" :key="valueIndex">
                      <pre v-if="typeof value === 'object' && value !== null">{{ JSON.stringify(value, undefined, 2).replace(/^\s*/g, '') }}</pre>
                      <span v-else-if="sobjectFieldsMappedByName[fieldName] && ['id', 'reference'].includes(sobjectFieldsMappedByName[fieldName].type.toLowerCase())"
                            class="record-id"
                            @click="onClickRecordId(value)">
                        {{ value }}
                      </span>
                      <span v-else-if="updateableFields.includes(fieldName)">
                        <template v-if="record.editing">
                          <select v-if="sobjectFieldsMappedByName[fieldName].picklistValues.length"
                                  v-model="soqlResult[recordIndex][fieldName]">
                            <option v-for="(picklistValue, picklistValueIndex) in sobjectFieldsMappedByName[fieldName].picklistValues.filter(picklistValue => picklistValue.active)"
                                    :key="picklistValueIndex"
                                    :value="picklistValue.value">
                              {{ picklistValue.label }}
                            </option>
                          </select>
                          <label v-else-if="sobjectFieldsMappedByName[fieldName].type.toLowerCase() === 'boolean'" 
                                 class="form-check-label custom-checkbox-container">
                            <input v-model="soqlResult[recordIndex][fieldName]"
                                   class="form-check-input"
                                   type="checkbox">
                            <span class="checkmark"/>
                          </label>
                          <input v-else
                                 v-model="soqlResult[recordIndex][fieldName]"
                                 type="text">
                        </template>
                        <span v-else>{{ value }}</span>
                      </span>
                      <span v-else>
                        {{ value }}
                      </span>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      

      <div v-if="error" class="row">
        <div class="col-12">
          <label class="m-auto">{{ error.errorCode }}</label>
        </div>
        <div class="col-12">
          <label class="m-auto">{{ error.message }}</label>
        </div>
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
import 'codemirror/mode/sql/sql.js';
import 'codemirror/lib/codemirror.css';
import '../../static/css/vscode-dark.css';
import FilterEntry from './filter-entry.vue';
import sqlFormatter from '@allanoricil/sql-formatter';
import { formatQuery } from 'soql-parser-js';
import RelationshipSelector from './relationship-selector.vue';
import { checkDifferences, getDifferences, removeKeys, convertArrayToObject } from '../utils/objectUtils.js';
import Loading from './loading.vue';
import apiVersions from '../static/api-versions.json';

export default {
    name: 'Editor',
    components: {
        codemirror,
        FilterEntry,
        RelationshipSelector,
        Loading
    },
    data() {
      return {
          configurations: {
              displayEditor: true,
              showFieldType: false,
              showFieldTypeTable: false,
              autoFormatSOQL: false
          },
          soqlParser: {
            format: {
              fieldMaxLineLength: 1,
              fieldSubqueryParensOnOwnLine: true,
              whereClauseOperatorsIndented: true
            }
          },
          apiVersion: 'v50.0',
          apiVersions: apiVersions,
          commitResults: [],
          deleteResult: undefined,
          excludedKeys: ['editing', 'error', 'attributes'],
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
          backupForChanges: [],
          soqlPlan: undefined,
          error: undefined,
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
          availableFieldsToSelect : [],
          selectedFields: [],
          selectedRelationshipFields: {},
          computedRelationshipFields: '',
          sobjectsToFetchFields: [],
          orderByField: undefined,
          orderByDirection: 'ASC',
          nullsOrder: 'NULLS FIRST',
          limitBy: undefined,
          offset: undefined,
          showForm: true,
          isExecutingSOQL: false,
          isRetrievingSOQLPlan: false,
          isCommitingChanges: false,
          recordsToUpdate: [],
          recordIndexToDelete: undefined,
          isExportingData: false
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
      computedSObjectName(){
        if(this.object) return this.object;
        else{
          const soqlTokens = this.soql ? this.soql.toLowerCase().replace(/\s+/g, ' ').split(' ') : [];
          const fromTokenIndex = soqlTokens.lastIndexOf('from');
          if(fromTokenIndex === -1) return '';
          else return soqlTokens[fromTokenIndex + 1];
        }
      },
      showCommitButton(){
        return this.recordsToUpdate && this.recordsToUpdate.length > 0;
      },
      showTableActionButtons(){
        return this.soqlResultFields.includes('Id') && this.soqlResultFields.find(field => this.updateableFields.includes(field));
      },
      showExportDataButton(){
        return this.soql && this.isSoqlResultsNotEmpty;
      },
      updateableFields(){
        return this.sobjectFields.filter(field => field.updateable).map(field => field.name);
      },
      sobjectFieldsMappedByName(){
        return convertArrayToObject(this.sobjectFields, 'name');
      },
      disableTextAreaActionButtons(){
        return !this.soql || this.isExecutingSOQL || this.isRetrievingSOQLPlan || this.isCommitingChanges;
      },
      isSoqlResultsNotEmpty(){
        return this.soqlResult && this.soqlResult.length;
      }
    },
    watch: {
      object(newValue){
        if(newValue){
          this.resetData();
          this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](newValue);
          if(!this.sobjectFields.length){
            this.$store.dispatch('sobjects/getSObjectDescribe', newValue);
          }
        }
      },
      sobjectFields: {
        deep: true,
        handler(newValues){
            if(this.availableFieldsToSelect.length === 0){
                this.availableFieldsToSelect = newValues.reduce((previous, current) => {
                    let array = [];
                    array.push({
                        value: current.name,
                        type: current.type,
                        hasNext: false,
                        selected: false,
                    });

                    current.referenceTo.forEach((reference) => {
                        if(current.relationshipName)
                            array.push({
                                value: current.relationshipName,
                                type: current.type,
                                reference: reference,
                                hasNext: true,
                                numberOfSelectedFields: 0,
                            });
                    });

                    return previous.concat(array);
                }, []);

                if(this.availableFieldsToSelect.length > 0){
                    this.availableFieldsToSelect = [{ value: 'COUNT(Id)', type: null, hasNext: false, selected: false }, ...this.availableFieldsToSelect];
                }
            }
        }
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
      soqlResult: {
        deep: true,
        handler(){
            this.getRecordsToUpdate();
        }
      },
      isExecutingSOQL(newValue){
        if(newValue){
          this.soqlPlan = undefined;
          this.soqlResult = undefined;
          this.error = undefined;
          this.recordsToUpdate = [];
          this.recordIndexToDelete = undefined;
        }
      },
      isRetrievingSOQLPlan(newValue){
        if(newValue){
          this.soqlPlan = undefined;
          this.soqlResult = undefined;
          this.error = undefined;
          this.recordsToUpdate = [];
          this.recordIndexToDelete = undefined;
        }
      }
    },
    beforeMount() {
      window.vscode.onLoading(()=>{
          this.loading = true;
      });
      window.vscode.onReceiveObjects((message) => {
          this.$store.commit('sobjects/setSObjects', message.data);
          this.loading = false;
      });
      window.vscode.onReceiveSObjectDescription((message) => {
        if (message.data) {
            const objectApiName = message.data.name;
            this.$store.commit('sobjects/setSObject', message.data);
            if(objectApiName === this.computedSObjectName){
                this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](objectApiName);
            }

            this.sobjectFields.forEach(field => {
                field.referenceTo.forEach((reference) => {
                    if (this.$store.getters['sobjects/getSObjectFields'](reference).length === 0 && !this.sobjectsToFetchFields.includes(reference)) {
                        this.sobjectsToFetchFields.push(reference);
                        this.$store.dispatch(
                            'sobjects/getSObjectDescribe',
                            reference
                        );
                    }
                });
            });
        }
      });
      window.vscode.onReceiveSOQLResult((message) => {
        this.isExecutingSOQL = false;
        let response = message.data;
        if (response.errorCode) {
            this.error = response;
            this.soqlResult = [];
        } else {
            response.forEach((record) => removeKeys(record, ['attributes', 'done', 'totalSize']));
            this.soqlResult = [...response];
            this.backupForChanges = [...response];
        }
      });
      window.vscode.onReceiveSOQLResultAndSObjectDescribe((message) => {
        this.isExecutingSOQL = false;
        const sobjectDescribeResponse = message.data[0].result;
        const sobjectName = sobjectDescribeResponse.name;
        this.$store.commit('sobjects/setSObject', sobjectDescribeResponse);
        if(sobjectName.toLowerCase() === this.computedSObjectName.toLowerCase()){
            this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](sobjectName);
        }

        this.sobjectFields.forEach(field => {
            field.referenceTo.forEach((reference) => {
                if (this.$store.getters['sobjects/getSObjectFields'](reference).length === 0 && !this.sobjectsToFetchFields.includes(reference)) {
                    this.sobjectsToFetchFields.push(reference);
                    this.$store.dispatch(
                        'sobjects/getSObjectDescribe',
                        reference
                    );
                }
            });
        });
        
        const soqlResultResponse = message.data[1];
        if(soqlResultResponse.result.records) {
            soqlResultResponse.result.records.forEach((record) => removeKeys(record, ['attributes', 'done', 'totalSize']));
            this.soqlResult = [...soqlResultResponse.result.records];
            this.backupForChanges = [...soqlResultResponse.result.records];
        }else {
            this.error = soqlResultResponse.result[0];
            this.soqlResult = [];
        }
      });
      window.vscode.onReceiveSOQLPlan((message) => {
          this.isRetrievingSOQLPlan = false;
          let response = message.data;
          if (response.errorCode) {
              this.error = response;
          } else {
              this.soqlPlan = response;
          }
      });
      window.vscode.onReceiveCommitResult((message) => {
        this.isCommitingChanges = false;

        message.data.forEach((commitResult, indexCommitResult) => {
            if(!commitResult.success){
                this.commitResults.push({...commitResult, Id: this.recordsToUpdate[indexCommitResult].Id});
            }
        });

        message.data.forEach((commitResult, indexCommitResult) => {
            if(commitResult.success){
                for(let i = 0 ; i < this.soqlResult.length; i++){
                    if(this.soqlResult[i].Id === commitResult.id){
                        this.soqlResult[i].editing = false;
                        this.backupForChanges.splice(i, 1, this.soqlResult[i]);
                        this.recordsToUpdate.splice(indexCommitResult, 1);
                        break;
                    }
                }
            }
        });

        if(this.commitResults.length > 0) this.$bvModal.show('commitResultModal');
      });
      window.vscode.onReceiveDeleteResult((message) => {
        if(message.data.errorCode){
          this.deleteResult = message.data;
          this.$bvModal.show('deleteResultModal');
        }else{
          const recordId = this.soqlResult[this.recordIndexToDelete].Id;
          this.$delete(this.soqlResult, this.recordIndexToDelete);
          this.backupForChanges.splice(this.recordIndexToDelete, 1);
          this.recordIndexToDelete = undefined;
          
          this.$bvToast.toast(`The Record [${recordId}] has been deleted.`, {
            toaster: 'b-toaster-top-full',
            solid: true,
            appendToast: true,
            noCloseButton: true
          });
        }
      });
      window.vscode.onReceiveConfigurations((message) => {
        this.configurations = message.data;
      });
      window.vscode.post({ cmd: 'getConfigurations' });
    },
    mounted() {
      this.$store.dispatch('sobjects/getAvailableSObjects');
    },
    methods: {
      onClickRefreshObjectsButton() {
        this.resetData();
        this.object = undefined;
        this.loading = true;
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
          this.isExecutingSOQL = true;
          window.vscode.post({
              cmd: 'executeSOQL2',
              args: {
                  soql: this.soql,
                  sObjectName: this.computedSObjectName,
                  apiVersion: this.apiVersion
              }
          });
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
      onClickAddToApexButton() {
          window.vscode.post({
              cmd: 'addToApex',
              args: this.soql,
          });
      },
      createSOQL() {
          if(this.computedSelectedFields){
              const soql =
                'SELECT ' +
                this.computedSelectedFields +
                ' FROM ' + this.computedSObjectName +
                this.computedFilters +
                this.computedOrderBy +
                this.computedLimitBy + 
                this.computedOffset;
              this.soql = this.configurations.autoFormatSOQL ? sqlFormatter.format(soql) : soql;
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
          this.soql = '';
          this.soqlResult = undefined;
          this.soqlPlan = undefined;
          this.error = undefined;
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
          this.sobjectFields = [];
          this.availableFieldsToSelect = [];
          this.selectedRelationshipFields = {};
          this.computedRelationshipFields = '';
          this.sobjectsToFetchFields = [];
          this.orderByField = undefined;
          this.orderByDirection = 'ASC';
          this.nullsOrder = 'NULLS FIRST';
          this.limitBy = undefined;
          this.offset = undefined;
          this.isExecutingSOQL = false;
          this.isRetrievingSOQLPlan = false;
          this.isCommitingChanges = false;
          this.recordsToUpdate = [];
          this.recordIndexToDelete = undefined;
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
      onClickEditRecordButton(indexRow){
          this.soqlResult[indexRow].editing = true;
          this.backupForChanges[indexRow] = {...this.soqlResult[indexRow]};
          this.$forceUpdate();
      },
      onClickCancelChangesButton(indexRow){
          this.soqlResult.splice(indexRow, 1, {...this.backupForChanges[indexRow]});
          this.soqlResult[indexRow].editing = false;
          this.getRecordsToUpdate();
          this.$forceUpdate();
      },
      onClickDeleteButton(indexRow){
        this.$bvModal.msgBoxConfirm('Are you sure you want to delete this record?', {
          centered: true
        })
        .then(value => {
          if(value === true){
            this.recordIndexToDelete = indexRow;
            window.vscode.post({
              cmd: 'deleteRecord',
              args: {
                sObjectName: this.computedSObjectName,
                recordId: this.soqlResult[indexRow].Id,
                apiVersion: this.apiVersion
              }
            });
          }
        })
      },
      onClickCommitButton(){
          this.commitResults = [];

          this.soqlResult.forEach((soqlResultRecord) => {
              const recordToUpdate = this.recordsToUpdate.find(recordToUpdate => recordToUpdate.Id === soqlResultRecord.Id);
              if(!recordToUpdate) soqlResultRecord.editing = false;
          });

          window.vscode.post({
              cmd: 'commitChanges',
              args: {
                  sobject: this.computedSObjectName,
                  recordsToUpdate: this.recordsToUpdate
              }
          });

          this.isCommitingChanges = true;
      },
      getRecordsToUpdate(){
          this.recordsToUpdate = [];
          if(this.soqlResult && this.soqlResult.length && this.backupForChanges && this.backupForChanges.length){
              this.soqlResult.forEach((record, index) => {
                  const recordChanges = getDifferences(record, this.backupForChanges[index], this.excludedKeys);
                  if(Object.keys(recordChanges).length){
                      const recordToUpdate = {...recordChanges, Id: record.Id};
                      this.excludedKeys.forEach(key => {
                          delete recordToUpdate[key];
                      });
                      this.recordsToUpdate.push(recordToUpdate);
                  }
              });
          }
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
                  if(this.selectedRelationshipFields[parentRelationshipName].length)
                      availableFieldToSelect.numberOfSelectedFields = this.selectedRelationshipFields[parentRelationshipName].length;
                  else
                      availableFieldToSelect.numberOfSelectedFields = 0;
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
      }
    },
};
</script>

<style scoped>
.record-id{
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
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
</style>
