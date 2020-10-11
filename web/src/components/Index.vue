<template>
  <div class="container vh-100 vw-100 px-xl-5 py-2">
    <div v-if="loading" class="d-flex justify-content-center h-100">
      <square-grid class="m-auto" size="100px" background="var(--vscode-button-background)"></square-grid>
    </div>
    <span v-else>
          <div class="row">
      <div class="col">
        <button
          class="btn btn-primary"
          @click="toogleForm"
        >{{ showForm ? 'Hide Form' : 'Show Form' }}</button>
      </div>
      <div class="col-auto">
        <div class="row pr-3">
            <span
              class="icon fa fa-sync mr-2"
              data-placement="top"
              @click="refreshSobjects()"
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
                @click="field.hasNext ? onSelectReference(field) : null"
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
            <button class="btn btn-primary" @click="addFilter()">Add Filter</button>
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
              @deleteEntry="onDelete"
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
                <button class="btn btn-primary" @click="formatSOQL()">Click to Format</button>
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
              heigth="200px"
              @ready="onCmReady"
            />
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-12">
            <button class="btn btn-primary" @click="executeQuery()" :disabled="isExecutingSOQL  || isRetrievingSOQLPlan">
              Execute
              <i v-if="isExecutingSOQL" class="fa fa fa-circle-o-notch fa-spin"></i>
            </button>
            <button class="btn btn-primary" @click="getSOQLPlan()" :disabled="isExecutingSOQL || isRetrievingSOQLPlan">
              Query Plan
              <i v-if="isRetrievingSOQLPlan" class="fa fa fa-circle-o-notch fa-spin"></i>
            </button>
            <button class="btn btn-primary" @click="addToApex()">Add to Apex</button>
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
                <th scope="col" v-for="(field, indexFieldName) in soqlResultFields" :key="indexFieldName">{{ field }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, indexRecord) in soqlResultRecords" :key="indexRecord">
                <td v-for="(value, indexValue) in Object.values(record)" :key="indexValue">
                  <pre v-if="typeof value === 'object'">{{ JSON.stringify(value, undefined, 2).replace(/^\s*/g, '') }}</pre>
                  <span v-else>
                    <span @click="Object.keys(record)[indexValue] === 'Id' ? openRecordDetailPage(value): null" :class="Object.keys(record)[indexValue] === 'Id' ? 'record-id' : ''">{{value}}</span>
                  </span>
                </td>
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
          @click="insertField($refs.relationshipSelector.fieldToInsert)"
        >Insert</button>
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
import FilterEntry from './FilterEntry.vue';
import sqlFormatter from 'sql-formatter';
import RelationshipSelector from './RelationshipSelector.vue';
import { SquareGrid } from 'vue-loading-spinner';

export default {
    name: 'Index',
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
            window.vscode.showMessage({
                txt: 'SObjects Loaded',
            });
            this.loading = false;
        });
        window.vscode.onReceiveSObjectDescription((message) => {
            if (message.data) {
                const objectApiName = message.data.name;
                this.$store.commit('sobjects/setSObject', message.data);
                if(objectApiName === this.object){
                  this.sobjectFields = this.$store.getters['sobjects/getSObjectFields'](objectApiName);
                  window.vscode.showMessage({
                      txt: 'SObject Details Received',
                  });
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
            } else {
                this.soqlResult = response;
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
    },
    mounted() {
        this.$store.dispatch('sobjects/getAvailableSObjects');
    },
    data() {
        return {
            loading: true,
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
            soqlResult: undefined,
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
            isRetrievingSOQLPlan: false
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
                      (key) => key !== 'attributes'
                  )
                : [];
        },
        soqlResultRecords() {
            return this.soqlResult && this.soqlResult.length > 0
                ? this.soqlResult.map(function (item) {
                      delete item.attributes;
                      return item;
                  })
                : [];
        },
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
            if (newValue) this.formatSOQL();
        }
    },
    methods: {
        refreshSobjects() {
            window.vscode.post({
                cmd: 'refreshSObjects',
            });
            this.loading = true;
        },
        addFilter() {
            this.filters.push({
                field: undefined,
                operator: undefined,
                value: undefined,
                filter: undefined,
                logic: undefined,
            });
        },
        executeQuery() {
            this.isExecutingSOQL = true;
            this.soqlResult = undefined;
            this.error = undefined;
            window.vscode.post({
                cmd: 'executeSOQL',
                args: this.soql,
            });
        },
        getSOQLPlan() {
            this.isRetrievingSOQLPlan = true;
            this.soqlPlan = undefined;
            this.error = undefined;
            window.vscode.post({
                cmd: 'getSOQLPlan',
                args: this.soql,
            });
        },
        addToApex() {
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
        formatSOQL() {
            this.soql = sqlFormatter.format(this.soql);
        },
        onCmReady(cm) {
            cm.setSize(null, 200);
        },
        onDelete(index) {
            this.filters.splice(index, 1);
        },
        onSelectReference(field){
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
        insertField(field){
            this.selectedFields.forEach(selectedField => {
                if(selectedField.value === field.split('.')[0]){
                    selectedField.value = field;
                }
            });
            this.$bvModal.hide('relationshipSelectorModal');
        },
        toogleForm(){
            this.showForm = !this.showForm;
        },
        openRecordDetailPage(id){
          window.vscode.post({
            cmd: 'openRecordDetailPage',
            args: id
          })
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
</style>
