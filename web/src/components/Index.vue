<template>
    <div class="container h-100 px-xl-5 py-2">
        <div class="row">
            <div class="col-4">
                <div class="row mb-3">
                    <div class="col">
                        <label for="fieldRelatedTo">Object</label>
                        <select
                            id="fieldRelatedTo"
                            v-model="object"
                            class="form-control"
                        >
                            <option
                                v-for="(object, index) in objects"
                                :key="index"
                                :value="object.name"
                                >{{ object.name }}</option
                            >
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <select
                            size="16"
                            class="mr-2 w-100"
                            multiple
                            v-model="selectedFields"
                        >
                            <option
                                v-for="(field, index) in sObjectFieldsToQuery"
                                :key="index"
                                :value="field.name"
                            >
                                {{ field.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div class="row">
                    <div class="col-12 form-row align-items-center">
                        <div class="form-group col-md-5 mr-2">
                            <label for="sortBy">Order by:</label>
                            <select
                                id="sortBy"
                                class="form-control"
                                v-model="sortBy"
                            >
                                <option
                                    v-for="(field,
                                    index) in sObjectFieldsToSort"
                                    :key="index"
                                    :value="field.name"
                                >
                                    {{ field.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group col-md-2 mr-2">
                            <label for="orderBy" style="opacity: 0;">-</label>
                            <select
                                id="orderBy"
                                class="form-control"
                                v-model="orderBy"
                            >
                                <option value="ASC">A to Z</option>
                                <option value="DESC">Z to A</option>
                            </select>
                        </div>
                        <div class="form-group col-md-2 mr-2">
                            <label for="nullsOrder" style="opacity: 0;"
                                >-</label
                            >
                            <select
                                id="nullsOrder"
                                class="form-control"
                                v-model="nullsOrder"
                            >
                                <option value="NULLS FIRST">Null First</option>
                                <option value="NULLS LAST">Null Last</option>
                            </select>
                        </div>
                        <div class="form-group col">
                            <label for="limitBy">Max Records:</label>
                            <input
                                id="limitBy"
                                type="number"
                                class="form-control"
                                min="0"
                                v-model="limitBy"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 form-row justify-content-between mb-2">
                        <label class="my-auto" for="inputCity">
                            Filter Results By:
                        </label>
                        <button class="btn btn-primary" @click="addFilter()">
                            Add Filter
                        </button>
                    </div>
                    <div
                        class="col-12 px-0 overflow-auto"
                        style="max-height: 310px;"
                    >
                        <filter-entry
                            v-for="(filter, index) in filters"
                            :key="index"
                            :index="index"
                            :showLogic="index !== filters.length - 1"
                            :sObjectFieldsToFilter="sObjectFieldsToSort"
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
                        <label>Enter or modify a SOQL query below: </label>
                    </div>
                    <div class="col-auto">
                        <div class="row">
                            <div class="col-auto my-auto">
                                <label
                                    class="form-check-label custom-checkbox-container"
                                    for="autoFormatButton"
                                >
                                    Autoformat
                                    <input
                                        id="autoFormatButton"
                                        class="form-check-input"
                                        type="checkbox"
                                        v-model="autoFormat"
                                    />
                                    <span class="checkmark" />
                                </label>
                            </div>
                            <div class="col-auto pl-0">
                                <button
                                    class="btn btn-primary"
                                    @click="formatSOQL()"
                                >
                                    Click to Format
                                </button>
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
                        <button class="btn btn-primary" @click="executeQuery()">
                            Query
                        </button>
                        <button class="btn btn-primary" @click="addToApex()">
                            Add to Apex
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="soqlResult && soqlResult.length > 0" class="row">
            <div class="col">
                <div class="table-responsive">
                    <table class="table table-dark table-sm table-bordered">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    v-for="(field, index) in soqlResultKeys"
                                    :key="index"
                                >
                                    {{ field }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(record,
                                indexRecord) in soqlResultValues"
                                :key="indexRecord"
                            >
                                <td
                                    v-for="(value, indexValue) in Object.values(
                                        record
                                    )"
                                    :key="indexValue"
                                >
                                    {{ value }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="soqlResult && soqlResult.length === 0" class="row">
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
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/lib/codemirror.css';
import '../../static/css/vscode-dark.css';
import FilterEntry from './FilterEntry.vue';
import sqlFormatter from 'sql-formatter';

export default {
    name: 'Index',
    components: {
        codemirror,
        FilterEntry,
    },
    beforeMount() {
        window.vscode.onReceiveObjects((message) => {
            this.$store.commit('sobjects/setSObjects', message.data);
            window.vscode.showMessage({
                txt: 'SObjects Loaded',
            });
        });
        window.vscode.onReceiveSObjectDescription((message) => {
            if (message.data) {
                this.$store.commit('sobjects/setSObject', message.data);
                this.setSObjectFieldsToQuery();
                this.setSObjectFieldsToSort();
                window.vscode.showMessage({
                    txt: 'SObject Details Received',
                });
            }
        });
        window.vscode.onReceiveSOQLResult((message) => {
            let response = message.data;
            if (response.errorCode) {
                this.error = response;
            } else {
                this.soqlResult = response;
            }
        });
    },
    mounted() {
        this.$store.dispatch('sobjects/getAvailableSObjects');
    },
    data() {
        return {
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
            isRefreshingMetadata: false,
            sObjectFieldsToQuery: [],
            sObjectFieldsToSort: [],
            sortBy: undefined,
            orderBy: 'ASC',
            nullsOrder: 'NULLS FIRST',
            limitBy: undefined,
        };
    },
    computed: {
        objects() {
            return this.$store.getters['sobjects/referenceAbleObjects'];
        },
        computedFields() {
            return this.selectedFields.length > 0
                ? 'SELECT ' +
                      this.selectedFields.reduce((previous, current, index) => {
                          return previous + (index !== 0 ? ', ' : '') + current;
                      }, '') +
                      ` FROM ${this.object}`
                : '';
        },
        computedFilters() {
            return this.filters.length !== 0 && this.filters[0].filter
                ? this.filters.reduce((previous, current, index) => {
                      return (
                          previous +
                          ' ' +
                          (index > 0 && this.filters[index - 1].logic
                              ? this.filters[index - 1].logic + ' '
                              : '') +
                          (current.filter ? current.filter : '')
                      );
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
        soqlResultKeys() {
            return this.soqlResult && this.soqlResult.length > 0
                ? Object.keys(this.soqlResult[0]).filter(
                      (key) => key !== 'attributes'
                  )
                : [];
        },
        soqlResultValues() {
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
            const sObjectFields = this.$store.getters[
                'sobjects/getSObjectFields'
            ](this.object);
            if (sObjectFields.length === 0) {
                this.$store.dispatch('sobjects/getSObjectDescribe', newValue);
            } else {
                this.setSObjectFieldsToQuery();
            }
            this.soql = '';
            this.soqlResult = undefined;
            this.error = undefined;
            this.filters = [
                {
                    field: undefined,
                    operator: undefined,
                    logic: undefined,
                    value: undefined,
                    filter: undefined,
                },
            ];
            this.selectedFields = [];
            this.isRefreshingMetadata = false;
            this.sObjectFieldsToQuery = [];
            (this.sObjectFieldsToSort = []), (this.sortBy = undefined);
            this.orderBy = 'ASC';
            this.nullsOrder = 'NULLS FIRST';
            this.limitBy = undefined;
        },
        selectedFields(newValue) {
            this.createSOQL();
        },
        filters: {
            deep: true,
            handler() {
                this.createSOQL();
            },
        },
        orderBy(newValue) {
            this.createSOQL();
        },
        sortBy(newValue) {
            this.createSOQL();
        },
        nullsOrder(newValue) {
            this.createSOQL();
        },
        limitBy(newValue) {
            this.createSOQL();
        },
        autoFormat(newValue) {
            if (newValue) this.formatSOQL();
        },
    },
    methods: {
        refreshSObjects() {
            window.vscode.post({
                cmd: 'refreshSObjects',
            });
            this.isRefreshingMetadata = true;
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
            this.soqlResult = undefined;
            this.error = undefined;
            window.vscode.post({
                cmd: 'executeSOQL',
                args: this.soql,
            });
        },
        addToApex() {
            window.vscode.post({
                cmd: 'addToApex',
                args: this.soql,
            });
        },
        setSObjectFieldsToQuery() {
            const sobjectFields = this.$store.getters[
                'sobjects/getSObjectFields'
            ](this.object);
            this.sObjectFieldsToQuery = [{ name: 'count()' }, ...sobjectFields];
        },
        setSObjectFieldsToSort() {
            this.sObjectFieldsToSort = this.$store.getters[
                'sobjects/getSObjectFields'
            ](this.object);
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
    },
};
</script>

<style></style>
