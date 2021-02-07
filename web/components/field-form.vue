<template>
    <div v-if="field" id="field-form-container" :class="{ 'active' : !closed, 'd-none' : closed }">
        <div class="position-relative">
            <div id="field-form-backdrop"></div>
            <div class="vw-100 position-absolute">
                <div class="d-flex justify-content-end">
                    <div id="field-form-menu" class="d-flex flex-column">
                        <div class="d-flex justify-content-between mr-2 mt-2">
                            <button class="vscode-button btn" style="margin-left: 10px;" @click="onClickDeleteFieldButton"><i class="fa fa-trash"></i></button>
                            <i class="fa fa-close fa-lg" style="margin-right: 5px;" @click="closeForm"></i>
                        </div>
                        <div class="d-flex flex-column mt-2" style="overflow-y: auto;">
                            <field-details v-if="field.details" :field="field.details" class="p-2"></field-details>

                            <filter-form v-if="field.details.filterable"
                                         :field="field.details"
                                         v-model="field.filters"
                                         :showFilterLogicFirstLine="showFilterLogicFirstLine"
                                         @change="onChangeField"
                                         class="p-2">
                            </filter-form>

                            <order-by-form v-if="field.details.sortable && field.orderBy"
                                           v-model="field.orderBy"
                                           @change="onChangeField"
                                           class="p-2">
                            </order-by-form>

                            <group-by-form></group-by-form>
                        </div>        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FieldDetails from '@/components/field-details.vue';
import FilterForm from '@/components/filter-form.vue';
import GroupByForm from '@/components/group-by-form.vue';
import OrderByForm from '@/components/order-by-form.vue';

export default {
    props: {
        value: {
            type: Object,
            default: () => {}
        },
        soql: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        FieldDetails,
        FilterForm,
        OrderByForm,
        GroupByForm
    },
    mounted(){
        this.field = {...this.value}
    },
    data: () => {
        return {
            closed: true,
            field: null
        }
    },
    beforeMount(){
        window.addEventListener('keyup', (event) => {
            if(event.key === "Escape") {
                this.closed = true;
                event.preventDefault();
            }
        })
    },
    computed:{
        showFilterLogicFirstLine(){
            return this.areThereTwoFields && this.isThereAFilter;
        },
        areThereTwoFields(){
            let numFields = 0;
            for (var [_, sobject] of Object.entries(this.soql.sobjects)) {
                for(var [_, field] of Object.entries(sobject.fields)){
                    numFields++;
                    if(numFields === 2)return true;
                }
            }
            return false;
        },
        isThereAFilter(){
            for (var [_, sobject] of Object.entries(this.soql.sobjects)) {
                for(var [_, field] of Object.entries(sobject.fields)){
                    if(field.filters.find(filter => filter.logicalOperator && filter.value)) return true;
                }
            }
            return false;
        }
    },
    methods: {
        openForm(){
            this.closed = false;
        },
        closeForm(){
            this.closed = true;
            this.$emit('close');
        },
        onClickDeleteFieldButton(){
            this.$emit('deleteField');
        },
        onChangeField(){
            this.$emit('change', this.field);
        },
    }
}
</script>

<style scoped>
#field-form-container {
    top: 0;
    z-index: 9;
    width: 0px;
}

#field-form-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.5;
}

#field-form-menu {
    padding: 0px;
    width: 0px;
    height: 0px;
    background-color: var(--vscode-editor-background) !important;
    transition: width 0.2s linear;
    z-index: 10;
}

#field-form-container.active #field-form-menu {
    width: 500px;
    height: 100vh;
    padding: 10px 10px;
}


#field-form-container.active #field-form-backdrop {
    width: 100vw;
    height: 100vh;
}

.active {
    position: fixed;
    width: 100vw;
    height: 100vh;
}

i:hover{
    cursor: pointer;
    color: var(--vscode-button-foreground);
}

</style>