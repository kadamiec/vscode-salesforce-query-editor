<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button v-b-toggle.field-details block class="vscode-button btn"
        >Details</b-button
      >
    </b-card-header>
    <b-collapse id="field-details" visible accordion="field-details">
      <b-card-body style="padding: 5px">
        <table class="w-100">
          <thead>
          </thead>
          <tbody>
            <tr>
              <td>Label</td>
              <td>{{ field.label }}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{{ field.name }}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{{ field.type }}</td>
            </tr>
            <tr>
              <td>Custom</td>
              <td>{{ field.custom }}</td>
            </tr>
            <tr>
              <td>Sortable</td>
              <td>{{ field.sortable }}</td>
            </tr>
            <tr>
              <td>Aggregatable</td>
              <td>{{ field.aggregatable }}</td>
            </tr>
            <tr>
              <td>Filterable</td>
              <td>{{ field.filterable }}</td>
            </tr>
            <tr>
              <td>Groupable</td>
              <td>{{ field.groupable }}</td>
            </tr>
            <tr>
              <td>Inline Text Help</td>
              <td>{{ field.inlineHelpText }}</td>
            </tr>
            <tr>
              <td>Unique</td>
              <td>{{ field.unique }}</td>
            </tr>
            <tr>
              <td>Exteral Id</td>
              <td>{{ field.externalId }}</td>
            </tr>
            <tr>
              <td>Encrypted</td>
              <td>{{ field.encrypted }}</td>
            </tr>
            <tr>
              <td>Precision</td>
              <td>{{ field.precision }}</td>
            </tr>
            <tr>
              <td>Scale</td>
              <td>{{ field.scale }}</td>
            </tr>
            <tr>
              <td>Updateable</td>
              <td>{{ field.updateable }}</td>
            </tr>
            <tr>
              <td>Case Sensitive</td>
              <td>{{ field.caseSensitive }}</td>
            </tr>
            <tr>
              <td>Required</td>
              <td>{{ field.nillable }}</td>
            </tr>
            <tr>
              <td>Formula</td>
              <td>{{ field.calculated }}</td>
            </tr>
            <tr>
              <td>Polymorphic</td>
              <td>{{ field.polymorphicForeignKey }}</td>
            </tr>
          </tbody>
        </table>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style></style>
