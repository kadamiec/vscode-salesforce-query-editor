<template>
    <div class="d-flex flex-column noselect">
        <button class="vscode-button btn ml-auto mb-2" style="height: 34px;" @click="clearAllSelectedFields">Clear All</button>
    
        <drop id="fields-container" @drop="onDropField">
            <div v-if="displayDropAFieldText" class="d-flex" style="position: absolute; width: 100%; height: 100%; padding: 0px;">
                <div class="m-auto" style="font-size: 30px;">
                    Drop a Field
                </div>
            </div>
            <div v-else class="d-flex flex-column p-2">
                <template v-if="configuration.groupSelectedFields">
                    <fields-group v-for="(fields, sobjectName) in selectedFields" 
                                  :key="sobjectName"
                                  :sobjectName="sobjectName"
                                  :fields="fields"
                                  @click="onClickField"
                                  class="mb-1">
                    </fields-group>
                </template>
                <div v-else>
                    <template v-for="(fields, sobjectName) in selectedFields">
                        <button v-for="(field, fieldIndex) in fields"
                                :key="field.name"
                                @click="onClickField({ sobjectName, field, fieldIndex })"
                                class="vscode-button ml-1 mb-1 noselect">
                            {{ sobjectName + '.' + field.name }}
                        </button>
                    </template>
                </div>
            </div>
        </drop>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import FieldsGroup from '@/components/fields-group';

export default {
    props:{
        selectedFields: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        FieldsGroup
    },
    computed: {
        ...mapState({
            configuration: state => state.user.configuration,
        }),
        displayDropAFieldText(){
            return this.selectedFields && !Object.keys(this.selectedFields).length;
        }
    },
    methods: {
        clearAllSelectedFields(){
            this.$emit('clearAllFields');
        },
        onClickField({ sobjectName, field, fieldIndex }){
            this.$emit('selectField', { sobjectName, field, fieldIndex });
        },
        onDropField({ sobjectName, field, fieldIndex }){
            this.$emit('insertField', { sobjectName, field, fieldIndex });
        }
    }
}
</script>

<style scoped>
#fields-container {
    overflow-y: auto;
    overflow-x: none;
    width: 100%;
    height: 317px;
    border: thin solid var(--vscode-inputOption-activeBackground) !important;
    border-radius: 0 !important;
    background-color: var(--vscode-input-background) !important;
    position: relative;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

button {
    height: 25px;
}
</style>