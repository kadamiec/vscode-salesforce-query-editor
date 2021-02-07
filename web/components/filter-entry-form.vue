<template>
    <div v-if="filterEntry" class="d-flex">
        <div class="d-flex flex-column mr-2 w-100">
            <label for="operator">Expression</label>
            <select ref="operator"
                    class="mr-2 w-100"
                    v-model="filterEntry.logicalOperator"
                    @change="onChangeFilterEntry">
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value="<"><</option>
                <option value=">">></option>
                <option value="<="><=</option>
                <option value=">=">>=</option>
                <option value="startsWith">Starts With</option>
                <option value="endsWith">Ends With</option>
                <option value="contains">Contains</option>
                <option value="in">In</option>
                <option value="notIn">Not In</option>
                <option value="includes">Includes</option>
                <option value="excludes">Excludes</option>
            </select>
        </div>

        <div class="d-flex flex-column mr-2 w-100">
            <label for="value">Value</label>
            <input ref="value"
                    type="text"
                    class="mr-2 w-100"
                    v-model="filterEntry.value"
                    @input="onChangeFilterEntry"/>
                    
        </div>
        <div v-if="showLogic || showFilterLogicFirstLine" :class="{ 'd-flex flex-column mr-2 w-100' : showLogic || showFilterLogicFirstLine }">
            <label for="logic">Logic</label>
            <select ref="logic"
                    class="mr-2 w-100"
                    v-model="filterEntry.logic"
                    @change="onChangeFilterEntry">
                <option value=""></option>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
        </div>
        <button class="vscode-button btn btn-primary my-auto ml-auto " @click="deleteFilter()">
            <span class="fa fa-trash"></span>
        </button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: {
        value: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: null
        },
        field: {
            type: Object,
            default: () => {}
        },
        showFilterLogicFirstLine: {
            type: Boolean,
            default: false
        },
        showLogic: {
            type: Boolean,
            default: false
        }
    },
    mounted(){
        this.filterEntry = {...this.value};
    },
    data: () => {
        return {
            filterEntry: null
        }
    },
    computed: {
        ...mapState({
            configuration: state => state.user.configuration
        }),
        computedExpression() {
            var computedExpression = undefined;
            switch (this.filter.operator) {
                case '=':
                    computedExpression = `${this.filter.field} = ${this.filter.value}`;
                    break;
                case '!=':
                    computedExpression = `${this.filter.field} != ${this.filter.value}`;
                    break;
                case '<':
                    computedExpression = `${this.filter.field} < ${this.filter.value}`;
                    break;
                case '>':
                    computedExpression = `${this.filter.field} > ${this.filter.value}`;
                    break;
                case '<=':
                    computedExpression = `${this.filter.field} <= ${this.filter.value}`;
                    break;
                case '>=':
                    computedExpression = `${this.filter.field} >= ${this.filter.value}`;
                    break;
                case 'startsWith':
                    computedExpression = `${this.filter.field} LIKE '${this.filter.value}%'`;
                    break;
                case 'endsWith':
                    computedExpression = `${this.filter.field} LIKE '%${this.filter.value}'`;
                    break;
                case 'contains':
                    computedExpression = `${this.filter.field} LIKE '%${this.filter.value}%'`;
                    break;
                case 'in':
                    computedExpression = `${this.filter.field} IN (${this.filter.value})`;
                    break;
                case 'notIn':
                    computedExpression = `${this.filter.field} NOT IN (${this.filter.value})`;
                    break;
                case 'includes':
                    computedExpression = `${this.filter.field} INCLUDES (${this.filter.value})`;
                    break;
                case 'excludes':
                    computedExpression = `${this.filter.field} EXCLUDES (${this.filter.value})`;
                    break;
                default:
                    computedExpression = undefined;
            }
            return computedExpression;
        },
    },
    methods: {
        deleteFilter() {
            this.$emit('deleteFilter', { filterIndex: this.index });
        },
        onChangeFilterEntry(){
            this.$emit('input', this.filterEntry);
        }
    },
};
</script>

<style scoped>
button{
    margin-top: 26px !important;
    margin-bottom: 0px !important;
}

input,
select{
    height: 30px !important;
}
</style>
