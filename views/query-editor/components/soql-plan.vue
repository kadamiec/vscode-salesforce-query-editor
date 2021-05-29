<template>
  <div v-if="soqlPlan && soqlPlan.length">
    <div class="d-flex flex-column">
      <div class="table-responsive mb-0">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">Cardinality</th>
              <th scope="col">Fields</th>
              <th scope="col">Leading Operation Type</th>
              <th scope="col">Cost</th>
              <th scope="col">SObject Cardinality</th>
              <th scope="col">SObject Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plan, index) in soqlPlan" :key="index">
              <td>{{ plan.cardinality }}</td>
              <td>
                <span
                  v-for="(field, indexField) in plan.fields"
                  :key="indexField"
                  >{{ field }}<br
                /></span>
              </td>
              <td>{{ plan.leadingOperationType }}</td>
              <td>{{ plan.relativeCost }}</td>
              <td>{{ plan.sobjectCardinality }}</td>
              <td>{{ plan.sobjectType }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="notes p-2">
        <p
          style="
            border-bottom: thin slid var(--vscode-badge-background) !important;
          "
        >
          <b>Notes:</b>
        </p>
        <span v-for="(plan, index) in soqlPlan" :key="index">
          <li v-for="(note, indexNote) in plan.notes" :key="indexNote">
            {{ note.description }}. Table: {{ note.tableEnumOrId }} Fields:
            {{ note.fields }}
          </li>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    soqlPlan: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
}
</script>

<style scoped>
table {
  background-color: var(--vscode-editor-background);
  color: var(--vscode-input-foreground);
}

table input,
table input:focus,
table select,
table select:focus {
  width: 100%;
  border: 3px solid var(--vscode-inputOption-activeBackground) !important;
  height: 30px !important;
}

tr {
  height: 30px !important;
}

table td p {
  display: inline-block;
  vertical-align: middle;
}

table th,
table td {
  border-color: var(--vscode-inputOption-activeBackground);
}

.notes {
  border: thin solid var(--vscode-inputOption-activeBackground);
  background-color: var(--vscode-editor-background);
  color: var(--vscode-input-foreground);
}
</style>
