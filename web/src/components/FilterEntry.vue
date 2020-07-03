<template>
    <div class="col-12 form-row align-items-center">
        <div class="form-group col-md-6 pr-2">
            <select
                ref="fieldname"
                class="form-control"
                v-model="filter.field"
                @input="changed"
            >
                <option
                    v-for="(field, index) in sObjectFieldsToFilter"
                    :key="index"
                    :value="field.name"
                >
                    {{ field.name }}
                </option>
            </select>
        </div>
        <div class="form-group col-md-2 pr-2">
            <select
                ref="operator"
                class="form-control"
                v-model="filter.operator"
                @input="changed"
            >
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
        <div class="form-group col-md-2 pr-2">
            <input
                ref="value"
                type="text"
                class="form-control"
                v-model="filter.value"
                @input="changed"
            />
        </div>
        <div v-if="showLogic" class="form-group col-md-2">
            <select
                ref="logic"
                class="form-control"
                v-model="filter.logic"
                @input="changed"
            >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    props: {
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
                    computedExpression = `${this.filter.field} LIKE '%${this.filter.value}'`;
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
    },
};
</script>

<style></style>
