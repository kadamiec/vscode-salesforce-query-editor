<template>
  <div>
    <div class="container" ref="picklists-container">
      <select
        v-for="(picklist, index) in picklists"
        :ref="`picklist-${index}`"
        :key="index"
        size="10"
        class="mr-2"
        v-model="picklist.selected"
      >
        <option
          v-for="(option, optionIndex) in picklist.options"
          :key="index + '' + optionIndex"
          :value="JSON.stringify(option)"
          @click="option.hasNext ? addPicklist($event, index) : removeNext(index)"
        >{{ option.label + (option.hasNext ? ' ➤' : '') }}</option>
      </select>
    </div>

    <button class="btn btn-md my-1" @click="onClickAddFieldButton" :disabled="isAddFieldButtonDisabled">Add Field</button>
    <button class="btn btn-md my-1" @click="onClickAddAllButton">Add All</button>
    <button class="btn btn-md my-1" @click="onClickClearAllButton" :disabled="isClearAllButtonDisabled">Clear All</button>

    <div class="container text-wrap mt-2 mb-1">
      <span id="formula">{{ computedSelectedField }}</span>
    </div>

    <div id="fields-container">
        <button v-for="(field, index) in selectedRelationshipFieldsData" :key="field" @click="onClickRemoveFieldButton(field, index)" class="ml-1 mb-1">
        {{ field }}
        <i class="icon fa fa-times fa-xs"></i>
        </button>
    </div>
  </div>
</template>

<script>
const MAX_DEPTH_LEVEL = 5;

export default {
    props: {
        referenceName: String,
        referenceValue: String,
        selectedRelationshipFields: {
            type: Array,
            default: () => []
        }
    },
    mounted(){
        this.createPicklist(this.referenceName);
        this.selectedRelationshipFieldsData = [...this.selectedRelationshipFields];
    },
    data() {
        return {
            picklists: [],
            selectedRelationshipFieldsData: [],
            selectedReference: undefined
        };
    },
    computed: {
        computedSelectedField() {
            return this.referenceValue + '.' + this.picklists.reduce(
                    function (
                        previous,
                        current,
                        index,
                        array
                    ) {
                        let valueToConcatenate =
                            typeof current.selected !== 'undefined'
                                ? JSON.parse(current.selected).value
                                : '';
                        return (
                            previous +
                            (previous !== '' && index > 0 && valueToConcatenate
                                ? '.'
                                : '') +
                            valueToConcatenate
                        );
                    },
            '');
        },
        isAddFieldButtonDisabled(){
            return (this.picklists.length >=1 && !this.picklists[this.picklists.length - 1].selected) || this.selectedReference;
        },
        isClearAllButtonDisabled(){
            return this.selectedRelationshipFieldsData && !this.selectedRelationshipFieldsData.length;
        }
    },
    methods: {
        addPicklist(e, index) {
            if(this.picklists.length < MAX_DEPTH_LEVEL){
                const picklist = JSON.parse(e.target.value);
                this.selectedReference = picklist.reference;
                this.picklists.splice(index + 1);
                this.createPicklist(this.selectedReference);
                this.$nextTick(() => {
                    this.$refs['picklists-container'].scrollLeft = this.$refs['picklists-container'].scrollWidth - this.$refs['picklists-container'].clientWidth;
                })
            }
        },
        createPicklist(reference){
            let newPicklist = {
                options: [],
                selected: undefined,
            };
                
            this.$store.getters['sobjects/getSObjectFields'](reference)
            .forEach((field) => {
                field.referenceTo.forEach((reference) => {
                    if (this.$store.getters['sobjects/getSObjectFields'](reference).length === 0) {
                        this.$store.dispatch('sobjects/getSObjectDescribe', reference);
                    }
                    
                    if(field.relationshipName && this.picklists.length <= 3)
                        newPicklist.options.push({
                            label: field.label,
                            value: field.relationshipName,
                            reference: reference,
                            isVisible: true,
                            hasNext: true,
                        });
                });

                newPicklist.options.push({
                    label: field.label,
                    value: field.name,
                    isVisible: true,
                    hasNext: false,
                });
            });
            this.picklists.push(newPicklist);
        },
        removeNext(index) {
            this.selectedReference = undefined;
            this.picklists.splice(index + 1);
        },
        onClickRemoveFieldButton(field, index){
            this.selectedRelationshipFieldsData.splice(this.selectedRelationshipFieldsData.findIndex(f => f === field), 1);
            this.$emit('removeField', { parentRelationshipName: this.referenceValue, field } );
        },
        onClickAddFieldButton(){
            if(this.selectedRelationshipFieldsData.findIndex(field => field === this.computedSelectedField) === -1){
                this.selectedRelationshipFieldsData.push(this.computedSelectedField);
                this.$emit('insertField', { parentRelationshipName: this.referenceValue, field: this.computedSelectedField });
            }
        },
        onClickAddAllButton(){
            const prefix = this.picklists.reduce((previous, current, index) => {
                if(index >= this.picklists.length - 1) return previous;
                let field = typeof current.selected !== 'undefined' ? JSON.parse(current.selected).value : '';
                return previous + (field ? '.' : '') + field;
            },  this.referenceValue) + '.';

            const newFields = [];
            this.picklists[this.picklists.length - 1].options.forEach(picklistOption => {
                if(!picklistOption.hasNext){
                    const fieldToInsert = prefix + picklistOption.value;
                    if(this.selectedRelationshipFieldsData.findIndex(field => field === fieldToInsert) === -1){
                        newFields.push(fieldToInsert);
                        this.selectedRelationshipFieldsData.push(fieldToInsert);
                    }
                }
            });

            if(newFields.length) this.$emit('insertAllFields', { parentRelationshipName: this.referenceValue, fields: newFields });
        },
        onClickClearAllButton(){
            this.selectedRelationshipFieldsData = [];
            this.$emit('clearAllFields', this.referenceValue);
        }
    },
};
</script>

<style scoped>
.container {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0;
}

#fields-container{
    overflow-y: auto;
    max-height: 200px;
}

#formula {
    color: var(--vscode-menu-foreground) !important;
    font-family: var(--vscode-font-family) !important;
    font-weight: var(--vscode-font-weight) !important;
    font-size: 18px !important;
}
</style>
