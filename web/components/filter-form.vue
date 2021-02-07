<template>
    <b-card v-if="filters" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.filter-accordion class="vscode-button btn">Filter</b-button>
      </b-card-header>
      <b-collapse id="filter-accordion" visible accordion="filter-accordion" role="tabpanel">
        <b-card-body style="padding: 5px;">
            <div class="d-flex flex-column">
                <button @click="onClickAddFilter" class="vscode-button btn mb-1 ml-auto">New Filter</button>
                <filter-entry-form v-for="(filter, filterIndex) in value" 
                                    :key="filterIndex"
                                    v-model="filters[filterIndex]"
                                    @input="onChangeFilter(filterIndex)"
                                    :field="field"
                                    :index="filterIndex"
                                    :showFilterLogicFirstLine="showFilterLogicFirstLine"
                                    :showLogic="filters.length > 1"
                                    @deleteFilter="onDeleteFilter"
                                    class="mb-1">
                </filter-entry-form>
            </div>
        </b-card-body>
      </b-collapse>
    </b-card>
</template>

<script>
import FilterEntryForm from '@/components/filter-entry-form.vue';
export default {
    props: {
        value: {
            type: Array,
            default: () => []
        },
        field: {
            type: Object,
            default: () => {}
        },
        showFilterLogicFirstLine: {
            type: Boolean,
            default: false
        }
    },
    components: {
        FilterEntryForm
    },
    mounted(){
        this.filters = [...this.value];
    },
    data:()=> {
        return {
            filters: null
        }
    },
    methods:{
        onDeleteFilter({ filterIndex }){
            this.filters.splice(filterIndex, 1);
            this.$emit('input', this.filters);
            this.$emit('change', this.filters);
        },
        onClickAddFilter(){
            this.filters.push({
                logicalOperator: undefined,
                value: undefined,
                logic: undefined
            });
            this.$emit('input', this.filters);
        },
        onChangeFilter(newFilterIndex){
            this.$emit('change', this.filters[newFilterIndex])
        }
    }
}
</script>

<style></style>