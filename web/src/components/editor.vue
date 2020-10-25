<template>
  <div class="container vh-100 vw-100 px-xl-5 py-2">
    <div v-if="loading" class="d-flex justify-content-center h-100">
      <square-grid class="m-auto" background="var(--vscode-button-background)"></square-grid>
    </div>
    <span v-else>
      <div class="row">
        <div class="col">
          <button
            class="btn btn-primary"
            @click="onClickHideFormButton"
          >{{ showForm ? 'Hide Form' : 'Show Form' }}</button>
        </div>
        <div class="col-auto">
          <div class="row pr-3">
              <span
                class="icon fa fa-sync mr-2"
                data-placement="top"
                @click="refreshSobjects()"
                v-b-tooltip.hover title="Refresh SObjects"
              ></span>
              <a target="_blank" href="https://github.com/AllanOricil/SOQL-Editor-Issues" class="mr-2 my-auto" v-b-tooltip.hover title="Open an Issue">
                <i class="icon fa fa-github"></i>
              </a>
              <a target="_blank" href="https://www.buymeacoffee.com/allanoricil" v-b-tooltip.hover title="Buy me a Coffee if you liked it">
                <img src="../../static/images/buyMeACoffeIcon.svg" alt="Kiwi standing on oval">
              </a>
          </div>
        </div>
      </div>
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
              <select size="16" class="mr-2 w-100" multiple v-model="selectedFields">
                <option
                  v-for="(field, index) in fieldsToQuery"
                  :key="index"
                  :value="field"
                  @click="field.hasNext ? onSelectFieldReferenceOption(field) : null"
                >{{ field.value + (field.hasNext ? ' ➤' : '')}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-8">
          <div class="row">
            <div class="col-12 form-row align-items-center">
              <div class="form-group col-md-5 mr-2">
                <label for="sortBy">Order by:</label>
                <select id="sortBy" class="form-control" v-model="sortBy">
                  <option
                    v-for="(field, index) in sobjectFields"
                    :key="index"
                    :value="field.name"
                  >{{ field.name }}</option>
                </select>
              </div>
              <div class="form-group col-md-2 mr-2">
                <label for="orderBy" style="opacity: 0;">-</label>
                <select id="orderBy" class="form-control" v-model="orderBy">
                  <option value="ASC">A to Z</option>
                  <option value="DESC">Z to A</option>
                </select>
              </div>
              <div class="form-group col-md-2 mr-2">
                <label for="nullsOrder" style="opacity: 0;">-</label>
                <select id="nullsOrder" class="form-control" v-model="nullsOrder">
                  <option value="NULLS FIRST">Null First</option>
                  <option value="NULLS LAST">Null Last</option>
                </select>
              </div>
              <div class="form-group col">
                <label for="limitBy">Max Records:</label>
                <input id="limitBy" type="number" class="form-control" min="0" v-model="limitBy">
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
                :showLogic="index !== filters.length - 1"
                :sObjectFieldsToFilter="sobjectFields"
                :object="object"
                v-model="filters[index]"
                @deleteEntry="onDeleteFilterEntry"
              ></filter-entry>
            </div>
          </div>
        </div>
      </div>
      <div class="row my-2 mb-3">
        <div class="col-12">
          <div class="row mb-2">
            <div class="col my-auto">
              <label>Enter or modify a SOQL query below:</label>
            </div>
            <div class="col-auto">
              <div class="row">
                <div class="col-auto my-auto">
                  <label class="form-check-label custom-checkbox-container" for="autoFormatButton">
                    Autoformat
                    <input
                      id="autoFormatButton"
                      class="form-check-input"
                      type="checkbox"
                      v-model="autoFormat"
                    >
                    <span class="checkmark"/>
                  </label>
                </div>
                <div class="col-auto pl-0">
                  <button class="btn btn-primary" @click="onClickFormatQueryButton()">Click to Format</button>
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
            <div class="col-10">
              <button class="btn btn-primary" @click="onClickExecuteQueryButton()" :disabled="isExecutingSOQL  || isRetrievingSOQLPlan || isCommitingChanges">
                Execute
                <i v-if="isExecutingSOQL" class="fa fa fa-circle-o-notch fa-spin"></i>
              </button>
              <button class="btn btn-primary" @click="onClickQueryPlanButton()" :disabled="isExecutingSOQL || isRetrievingSOQLPlan || isCommitingChanges">
                Query Plan
                <i v-if="isRetrievingSOQLPlan" class="fa fa fa-circle-o-notch fa-spin"></i>
              </button>
              <button class="btn btn-primary" @click="onClickAddToApexButton()">Add to Apex</button>
            </div>
            <div class="col-auto" 
                 v-if="showCommitButton" >
              <button class="btn btn-primary" @click="onClickCommitButton" :disabled="isCommitingChanges">
                Commit
                <i v-if="isCommitingChanges" class="fa fa fa-circle-o-notch fa-spin"></i>
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
                    <td>{{plan.cardinality}}</td>
                    <td><span v-for="(field, indexField) in plan.fields" :key="indexField">{{field}}</br></span></td>
                    <td>{{plan.leadingOperationType}}</td>
                    <td>{{plan.relativeCost}}</td>
                    <td>{{plan.sobjectCardinality}}</td>
                    <td>{{plan.sobjectType}}</td>
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
                    {{note.description}}. Table: {{note.tableEnumOrId}} Fields: {{note.fields}}
                  </li>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- SOQL DATA -->
      <div v-if="soqlResult && soqlResult.length > 0" class="row">
        <div class="col">
          <div class="table-responsive">
            <table class="table table-dark table-sm table-bordered">
              <thead>
                <tr>
                  <th v-if="showTableActionButtons" style="width: 70px;"></th>
                  <th scope="col" v-for="(field, indexFieldName) in soqlResultFields" :key="indexFieldName">{{ field }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, indexRecord) in soqlResult" :key="indexRecord">
                  <td v-if="showTableActionButtons">
                    <span v-if="record.editing">
                      <!--<button class="btn btn-primary btn-sm" @click="confirmChanges(indexRecord)" :disabled="isCommitingChanges">
                        <span class="fa fa-check fa-xs"></span>
                      </button>-->
                      <button class="btn btn-primary btn-sm" @click="onClickCancelChangesButton(indexRecord)" :disabled="isCommitingChanges">
                        <span class="fa fa-times-circle fa-xs"></span>
                      </button>
                    </span>
                    <span v-else>
                      <button v-if="showEditRecordButton" class="btn btn-primary btn-sm" @click="onClickEditRecordButton(indexRecord)" :disabled="isCommitingChanges">
                        <span class="fa fa-pencil fa-xs"></span>
                      </button>
                      <button class="btn btn-primary btn-sm" @click="onClickDeleteRecordButton(indexRecord)" :disabled="isCommitingChanges">
                        <span class="fa fa-trash fa-xs"></span>
                      </button>
                    </span>
                  </td>
                  <template v-for="(value, indexValue) in Object.values(record)">
                    <td :key="indexValue" v-if="!excludedKeys.includes(Object.keys(record)[indexValue])">
                      <pre v-if="typeof value === 'object' && value !== null">{{ JSON.stringify(value, undefined, 2).replace(/^\s*/g, '') }}</pre>
                      <span v-else-if="Object.keys(record)[indexValue] === 'Id'" 
                            @click="onClickRecordId(value)" 
                            class="record-id">
                            {{value}}
                      </span>
                      <span v-else-if="notEditableFields.includes(Object.keys(record)[indexValue])">
                            {{value}}
                      </span>
                      <span v-else>
                        <input v-if="record.editing" class="w-100" type="text" v-model="soqlResult[indexRecord][Object.keys(record)[indexValue]]">
                        <span v-else>{{value}}</span>
                      </span>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else-if="soqlResult && soqlResult.length === 0" class="row">
        <div class="col-12">
          <label class="m-auto">0 Results</label>
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
      <b-modal
        id="relationshipSelectorModal"
        size="xl"
        :title="selectedReference + ': ' + selectedReferenceValue"
        centered
        cancel-disabled
      >
        <relationship-selector
          :referenceName="selectedReference"
          :referenceValue="selectedReferenceValue"
          ref="relationshipSelector"
        ></relationship-selector>

        <template v-slot:modal-footer="{ close }">
          <button type="button" class="btn btn-md danger" @click="close()">Close</button>
          <button
            type="button"
            class="btn btn-md danger"
            @click="onClickInsertFieldButton($refs.relationshipSelector.fieldToInsert)"
          >Insert</button>
        </template>
      </b-modal>
      <b-modal 
        id="commitResultModal"
        size="xl"
        title="Commit Result Errors"
        centered
        cancel-disabled>
        <ol>
          <li v-for="(commitResult, index) in commitResults" :key="index">
            <p>{{commitResult.Id}}</p>
            <ul>
              <li v-for="(commitResultError, indexError) in commitResult.errors" :key="indexError">
                {{commitResultError.statusCode}} {{commitResultError.message}} {{ commitResultError.fields }}
              </li>
            </ul>
          </li>
        </ol>
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
import sqlFormatter from 'sql-formatter';
import RelationshipSelector from './relationship-selector.vue';
import { SquareGrid } from 'vue-loading-spinner';
import { checkDifferences, getDifferences, removeKeys } from '../utils/objectUtils.js';

export default {
    name: 'Editor',
    components: {
        codemirror,
        FilterEntry,
        RelationshipSelector,
        SquareGrid
    },
    beforeMount() {
        window.vscode.onLoading(()=>{
          this.loading = true;
        });
        window.vscode.onReceiveObjects((message) => {
            this.object = undefined;
            this.$store.commit('sobjects/setSObjects', message.data);
            this.loading = false;
        });
        window.vscode.onReceiveSObjectDescription((message) => {
            if (message.data) {
                const objectApiName = message.data.name;
                this.$store.commit('sobjects/setSObject', message.data);
                if(objectApiName === this.object){
                  this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](objectApiName);
                }

                this.sobjectFields.forEach(field => {
                  field.referenceTo.forEach((reference) => {
                      if (this.$store.getters['sobjects/getSObjectFields'](reference).length === 0 && !this.sObjectsToGetFields.includes(reference)) {
                        this.sObjectsToGetFields.push(reference);
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
                response.forEach((record) => removeKeys(record, ['attributes']));
                this.soqlResult = [...response];
                this.backupForChanges = [...response];
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
    },
    mounted() {
        this.$store.dispatch('sobjects/getAvailableSObjects');
    },
    data() {
        return {
            commitResults: [],
            excludedKeys: ['editing', 'error', 'attributes'],
            notEditableFields: ['Id', 'CreatedDate', 'LastModifiedDate'],
            loading: false,
            cmOptions: {
                tabSize: 4,
                mode: 'sql',
                theme: 'vscode-dark',
                lineNumbers: true,
                lineWrapping: true,
                line: true,
            },
            autoFormat: false,
            soql: '',
            soqlResult: [
        {
            "attributes": {
                "type": "Case",
                "url": "/services/data/v48.0/sobjects/Case/5001k00000Dm0LNAAZ"
            },
            "Id": "5001k00000Dm0LNAAZ",
            "Account": {
                "attributes": {
                    "type": "Account",
                    "url": "/services/data/v48.0/sobjects/Account/0011k00000cywmdAAA"
                },
                "Name": "Gustavo Bernal Valentini"
            },
            "error" : "erros",
            "email" : 'Allan'
        },
        {
            "attributes": {
                "type": "Case",
                "url": "/services/data/v48.0/sobjects/Case/5001k00000DyljQAAR"
            },
            "Id": "5001k00000DyljQAAR",
            "Account": {
                "attributes": {
                    "type": "Account",
                    "url": "/services/data/v48.0/sobjects/Account/0011k00000cywmdAAA"
                },
                "Name": "Gustavo Bernal Valentini"
            },
            "email" : 'Allan'
        }
    ],
            soqlPlan: undefined,
            error: undefined,
            object: undefined,
            selectedFields: [],
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
            sObjectsToGetFields: [],
            sortBy: undefined,
            orderBy: 'ASC',
            nullsOrder: 'NULLS FIRST',
            limitBy: undefined,
            showForm: true,
            isExecutingSOQL: false,
            isRetrievingSOQLPlan: false,
            isCommitingChanges: false,
            recordsToUpdate: [],
            recordsToDelete: {},
            backupForChanges: [
        {
            "attributes": {
                "type": "Case",
                "url": "/services/data/v48.0/sobjects/Case/5001k00000Dm0LNAAZ"
            },
            "Id": "5001k00000Dm0LNAAZ",
            "Account": {
                "attributes": {
                    "type": "Account",
                    "url": "/services/data/v48.0/sobjects/Account/0011k00000cywmdAAA"
                },
                "Name": "Gustavo Bernal Valentini"
            },
            "error" : "erros",
            "email" : 'Allan'
        },
        {
            "attributes": {
                "type": "Case",
                "url": "/services/data/v48.0/sobjects/Case/5001k00000DyljQAAR"
            },
            "Id": "5001k00000DyljQAAR",
            "Account": {
                "attributes": {
                    "type": "Account",
                    "url": "/services/data/v48.0/sobjects/Account/0011k00000cywmdAAA"
                },
                "Name": "Gustavo Bernal Valentini"
            },
            "email" : 'Allan'
        }
    ],
        };
    },
    computed: {
        objects() {
            return this.$store.getters['sobjects/referenceAbleObjects'];
        },
        fieldsToQuery() {
            let sObjectFieldsToQuery = this.sobjectFields.reduce((acc, cur) => {
              let array = [];
              array.push({
                value: cur.name,
                hasNext: false
              });

              cur.referenceTo.forEach((reference) => {
                if(cur.relationshipName)
                  array.push({
                    value: cur.relationshipName,
                    reference: reference,
                    hasNext: true
                  })
              });

              return acc.concat(array);
            }, []);
            
            if(sObjectFieldsToQuery.length > 0)
              return [{ value: 'COUNT(Id)', hasNext: false }, ...sObjectFieldsToQuery];
            else
              return [];
        },
        computedFields() {
            return this.selectedFields.length > 0
                ? 'SELECT ' +
                      this.selectedFields.reduce((previous, current, index) => {
                          return previous + (index !== 0 ? ', ' : '') + current.value;
                      }, '') +
                      ` FROM ${this.object}`
                : '';
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
        computedSortBy() {
            return this.sortBy
                ? ` ORDER BY ${this.sortBy} ${this.orderBy} ${this.nullsOrder}`
                : '';
        },
        computedLimitBy() {
            return this.limitBy ? ` LIMIT ${this.limitBy}` : '';
        },
        soqlResultFields() {
            return this.soqlResult && this.soqlResult.length > 0
                ? Object.keys(this.soqlResult[0]).filter(
                      (key) => !this.excludedKeys.includes(key)
                  )
                : [];
        },
        sobject(){
          const soqlTokens = this.soql ? this.soql.toLowerCase().replace(/\s+/g, ' ').split(' ') : [];
          const fromTokenIndex = soqlTokens.indexOf('from');
          if(fromTokenIndex === -1) return '';
          else return soqlTokens[fromTokenIndex + 1];
        },
        showCommitButton(){
          return (this.recordsToUpdate && this.recordsToUpdate.length > 0) || 
                 (this.recordsToDelete && Object.keys(this.recordsToDelete).length > 0);
        },
        showTableActionButtons(){
          return this.soqlResultFields.includes('Id') && this.soqlResultFields.length > 1;
        },
        showEditRecordButton(){
          return this.soqlResultFields.find(field => field !== 'Id' && 
                                                     field !== 'CreatedDate' && 
                                                     field !== 'LastModifiedDate' && 
                                                     field !== 'OwnerId' && 
                                                     typeof this.soqlResult[0][field] !== 'object');
        }
    },
    watch: {
        object(newValue) {
            this.resetData();
            const sObjectFields = this.$store.getters['sobjects/getSObjectFields'](this.object);
            if (sObjectFields.length === 0) {
                this.$store.dispatch('sobjects/getSObjectDescribe', newValue);
            }else{
                this.sobjectFields = sObjectFields;
            }
        },
        selectedFields() {
            this.createSOQL();
        },
        computedFields(){
            this.createSOQL();
        },
        computedFilters(){
            this.createSOQL();
        },
        orderBy() {
            this.createSOQL();
        },
        sortBy() {
            this.createSOQL();
        },
        nullsOrder() {
            this.createSOQL();
        },
        limitBy() {
            this.createSOQL();
        },
        autoFormat(newValue) {
            if (newValue) this.onClickFormatQueryButton();
        },
        soqlResult: {
          deep: true,
          handler(){
            this.getRecordsToUpdate()
          }
        },
        isExecutingSOQL(newValue){
          if(newValue){
            this.soqlPlan = undefined;
            this.soqlResult = undefined;
            this.error = undefined;
            this.recordsToUpdate = [];
            this.recordsToDelete = {};
          }
        },
        isRetrievingSOQLPlan(newValue){
          if(newValue){
            this.soqlPlan = undefined;
            this.soqlResult = undefined;
            this.error = undefined;
            this.recordsToUpdate = [];
            this.recordsToDelete = {};
          }
        }
    },
    methods: {
        refreshSobjects() {
            window.vscode.post({
                cmd: 'refreshSObjects',
            });
            this.loading = true;
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
                cmd: 'executeSOQL',
                args: this.soql,
            });
        },
        onClickQueryPlanButton() {
            this.isRetrievingSOQLPlan = true;
            window.vscode.post({
                cmd: 'getSOQLPlan',
                args: this.soql,
            });
        },
        onClickAddToApexButton() {
            window.vscode.post({
                cmd: 'addToApex',
                args: this.soql,
            });
        },
        createSOQL() {
            const soql =
                this.computedFields +
                this.computedFilters +
                this.computedSortBy +
                this.computedLimitBy;
            this.soql = this.autoFormat ? sqlFormatter.format(soql) : soql;
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
        onSelectFieldReferenceOption(field){
            this.selectedFields.forEach(selectedField =>{
                if(selectedField.value === field.value){
                  this.selectedReferenceValue = field.value;
                  this.selectedReference = field.reference;
                  this.$bvModal.show('relationshipSelectorModal');
                }
            });
        },
        resetData() {
            this.autoFormat = false;
            this.soql = '';
            this.soqlResult = undefined;
            this.soqlPlan = undefined;
            this.error = undefined;
            this.selectedFields = [];
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
            this.sObjectsToGetFields = [];
            this.sortBy = undefined;
            this.orderBy = 'ASC';
            this.nullsOrder = 'NULLS FIRST';
            this.limitBy = undefined;
            this.isExecutingSOQL = false;
            this.isRetrievingSOQLPlan = false;
        },
        onClickInsertFieldButton(field){
            this.selectedFields.forEach(selectedField => {
                if(selectedField.value === field.split('.')[0]){
                    selectedField.value = field;
                }
            });
            this.$bvModal.hide('relationshipSelectorModal');
        },
        onClickHideFormButton(){
            this.showForm = !this.showForm;
        },
        onClickRecordId(id){
          window.vscode.post({
            cmd: 'openRecordDetailPage',
            args: id
          })
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
        onClickDeleteRecordButton(indexRow){
          this.$confirm(
            {
              message: `Are you sure you want to delete this record?`,
              button: {
                no: 'No',
                yes: 'Yes'
              },
              callback: confirm => {
                if (confirm) {
                   this.recordsToDelete[Object.keys(this.recordsToDelete).length] = {...this.soqlResult[indexRow]};
                   this.soqlResult.splice(indexRow, 1);
                   this.$forceUpdate();
                }
              }
            }
          )
        },
        onClickCommitButton(){
          this.commitResults = [];

          this.soqlResult.forEach((soqlResultRecord) => {
            const recordToUpdate = this.recordsToUpdate.find(recordToUpdate => recordToUpdate.Id === soqlResultRecord.Id);
            if(!recordToUpdate) soqlResultRecord.editing = false;
          })

          window.vscode.post({
            cmd: 'commitChanges',
            args: { 
              sobject: this.sobject,
              recordsToUpdate: this.recordsToUpdate,
              recordsToDelete: this.recordsToDelete
            }
          })

          this.isCommitingChanges = true;
        },
        getRecordsToUpdate(){
          console.log('Recalculating Records to Update');
          this.recordsToUpdate = [];
          if(this.soqlResult && this.soqlResult.length && this.backupForChanges && this.backupForChanges.length){
            this.soqlResult.forEach((record, index) => {
              const recordChanges = getDifferences(record, this.backupForChanges[index], this.excludedKeys);
              if(Object.keys(recordChanges).length){
                const recordToUpdate = {...recordChanges, Id: record.Id};
                this.excludedKeys.forEach(key => {
                  delete recordToUpdate[key];
                })
                this.recordsToUpdate.push(recordToUpdate);
              }
            })
          }
        }
    },
};
</script>

<style scoped>
.record-id{
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
}

.icon{
  color: var(--vscode-menu-separatorBackground);
  font-size: 2.3em;
}

.icon:hover{
  color: var(--vscode-badge-foreground);
  cursor: pointer;
}

p{
  margin-bottom: 0px;
}

table input{
  border: 3px solid var(--vscode-inputOption-activeBackground) !important;
}

error {
  border: 3px solid rgb(255,0,0) !important;
}
</style>
