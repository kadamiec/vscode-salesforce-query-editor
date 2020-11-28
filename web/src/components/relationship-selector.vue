<template>
  <div>
    <div class="container">
      <select
        v-for="(picklist, index) in picklists"
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

    <button class="btn btn-md my-1" @click="onClickAddField">Add Field</button>

    <div class="container text-wrap mt-2 mb-1">
      <span id="formula">{{ fieldToInsert }}</span>
    </div>

    <button v-for="(field, index) in selectedRelationshipFieldsData" :key="field" @click="onClickRemoveFieldButton(field, index)" class="ml-1 mb-1">
        {{ field }}
        <i class="icon fa fa-times fa-xs"></i>
    </button>

  </div>
</template>

<script>
export default {
    props: {
        referenceName: String,
        referenceValue: String,
        selectedRelationshipFields: []
    },
    mounted(){
        let newPicklist = this.createPicklist(this.referenceName);
        this.picklists.push(newPicklist);
        this.selectedRelationshipFieldsData = this.selectedRelationshipFields;
    },
    data() {
        return {
            picklists: [],
            selectedRelationshipFieldsData: [],
        };
    },
    watch:{
        selectedRelationshipFields(newValue){
            this.selectedRelationshipFieldsData = newValue;
        }
    },
    computed: {
        fieldToInsert() {
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
    },
    methods: {
        addPicklist(e, index) {
            if(this.picklists.length < 5){
                const picklist = JSON.parse(e.target.value);
                const picklistValue = picklist.value;
                const picklistReference = picklist.reference;
                this.picklists.splice(index + 1);
                let newPicklist = this.createPicklist(picklistReference, index);
                this.picklists.push(newPicklist);
            }
        },
        createPicklist(reference, index){
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
                    
                    if(field.relationshipName && index != 3)
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

            return newPicklist;
        },
        removeNext(index) {
            this.picklists.splice(index + 1);
        },
        onClickRemoveFieldButton(field, index){
            this.$emit('removeField', field);
        },
        onClickAddField(){
            console.log(this.fieldToInsert);
            this.$emit('insertField', this.fieldToInsert);
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

#formula {
  color: var(--vscode-menu-foreground) !important;
  font-family: var(--vscode-font-family) !important;
  font-weight: var(--vscode-font-weight) !important;
  font-size: 18px !important;
}
</style>
