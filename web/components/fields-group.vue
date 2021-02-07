<template>
    <div v-if="fields.length" class="d-flex flex-column">
        <div class="fields-group-title">
            {{ sobjectName }}
        </div>
        <div class="fields-group-container">
            <button v-for="(field, fieldIndex) in fields" 
                    :key="field.name" 
                    @click="onClickField({ field, fieldIndex, sobjectName })" 
                    class="vscode-button ml-1 mb-1 noselect">
                {{ field.name }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        sobjectName: {
            type: String,
            default: null
        },
        fields: {
            type: Array,
            default: () => []
        }
    },
    methods:{
        onClickField({ field, fieldIndex, sobjectName }){
            this.$emit('click', { field, fieldIndex, sobjectName })
        }
    }
}
</script>

<style>
.fields-group-title{
    padding-left: 5px;
}

.fields-group-container{
    padding: 5px 5px;
}
</style>