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

    <div class="container text-wrap mt-2">
      <span id="formula">{{ fieldToInsert }}</span>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        referenceName: String,
        referenceValue: String
    },
    mounted(){
        let newPicklist = this.createPicklist(this.referenceName);
        this.picklists.push(newPicklist);
    },
    data() {
        return {
            picklists: [],
        };
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
                let newPicklist = this.createPicklist(picklistReference);
                this.picklists.push(newPicklist);
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
                    
                    if(field.relationshipName)
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
