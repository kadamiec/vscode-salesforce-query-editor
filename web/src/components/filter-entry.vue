<template>
    <div class="col-12 form-row align-items-center">
        <div class="form-group col-md-5 mr-2">
            <select ref="fieldname"
                    class="form-control"
                    v-model="value.field"
                    @input="changed">
                <option v-for="(field, index) in sObjectFieldsToFilter"
                        :key="index"
                        :value="field.name">
                    {{ field.name + (configurations.fieldType.form && field.type ? ' [' + field.type.toUpperCase() + ']': '') }}
                </option>
            </select>
        </div>
        <div class="form-group col mr-2">
            <select ref="operator"
                    class="form-control"
                    v-model="value.operator"
                    @input="changed">
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
        <div class="form-group col mr-2">
            <input ref="value"
                   type="text"
                   class="form-control"
                   v-model="value.value"
                   @input="changed"/>
        </div>
        <div v-if="showLogic" class="form-group col mr-2">
            <select ref="logic"
                    class="form-control"
                    v-model="value.logic"
                    @input="changed">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
        </div>
        <div class="form-group col-md-auto">
            <div class="d-flex">
                <button class="ml-auto btn btn-primary" @click="deleteFilter()">
                    <span class="fa fa-trash"></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        index: Number,
        value: Object,
        object: String,
        sObjectFieldsToFilter: {
            type: Array,
            default: () => [],
        },
        showLogic: {
            type: Boolean,
            default: false,
        },
        configurations: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.filter = this.value;
    },
    data() {
        return {
            filter: {
                field: undefined,
                operator: undefined,
                value: undefined,
                logic: undefined,
                filter: undefined,
            },
        };
    },
    computed: {
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
    watch: {
        value(newValue) {
            this.filter = newValue;
        },
        'filter.value'() {
            this.computeFilter();
        },
        'filter.operator'() {
            this.computeFilter();
        },
        'filter.field'() {
            this.computeFilter();
        },
    },
    methods: {
        changed() {
            this.$emit('input', this.filter);
        },
        computeFilter() {
            if (
                this.filter.value &&
                this.filter.operator &&
                this.filter.field
            ) {
                this.filter.filter = this.computedExpression;
            } else {
                this.filter.filter = '';
            }
        },
        deleteFilter() {
            this.$emit('deleteEntry', this.index);
        },
    },
};
</script>

<style></style>
