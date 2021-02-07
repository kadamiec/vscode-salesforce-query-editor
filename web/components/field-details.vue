<template>
    <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.field-details class="vscode-button btn">Details</b-button>
        </b-card-header>
        <b-collapse id="field-details" visible accordion="field-details">
            <b-card-body style="padding: 5px;">
                <div class="d-flex justify-content-between">
                    <div class="d-flex flex-column">
                        <p><strong>Label: </strong> {{ field.label }}</p>
                        <p><strong>Name: </strong>{{ field.name }}</p>
                        <p><strong>Type: </strong> {{ field.type }}</p>
                        <p v-if="field.sortable"><strong>Sortable: </strong> {{ field.sortable }}</p>
                        <p v-if="field.aggregatable"><strong>Aggregatable: </strong> {{ field.aggregatable }}</p>
                        <p v-if="field.filterable"><strong>Filterable: </strong> {{ field.filterable }}</p>
                        <p v-if="field.groupable"><strong>Groupable: </strong> {{ field.groupable }}</p>
                        <p v-if="field.custom"><strong>Custom: </strong>{{ field.custom }}</p>
                        <p v-if="field.inlineHelpText"><strong>Inline Text Help: </strong> {{ field.inlineHelpText }}</p>
                        <p v-if="field.unique"><strong>Unique: </strong> {{ field.unique }}</p>
                        <p v-if="field.externalId"><strong>Exteral Id: </strong> {{ field.externalId }}</p>
                        <p v-if="field.encrypted"><strong>Encrypted: </strong> {{ field.encrypted }}</p>
                        <p v-if="field.precision" ><strong>Precision: </strong> {{ field.precision }}</p>
                        <p v-if="field.scale"><strong>Scale: </strong> {{ field.scale }}</p>
                        <p v-if="field.updateable"><strong>Updateable: </strong> {{ field.updateable }}</p>
                        <p v-if="field.caseSensitive"><strong>Case Sensitive: </strong> {{ field.caseSensitive }}</p>
                        <p v-if="field.nillable"><strong>Required: </strong> {{ field.nillable }}</p>
                        <p v-if="field.calculated"><strong>Formula: </strong> {{ field.calculated }}</p>
                        <p v-if="field.polymorphicForeignKey"><strong>Polymorphic: </strong> {{ field.polymorphicForeignKey }}</p>
                    </div>
                </div>
            </b-card-body>
        </b-collapse>
    </b-card>
    
</template>

<script>
export default {
    props:{
        field: {
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style>

</style>