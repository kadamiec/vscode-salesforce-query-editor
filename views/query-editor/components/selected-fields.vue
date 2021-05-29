<template>
  <div class="d-flex flex-column noselect">
    <button
      id="clearAll"
      class="vscode-button mr-auto mb-1"
      @click="clearAllSelectedFields"
    >
      Clear All
    </button>

    <drop id="fields-container" @drop="onDropField">
      <div
        v-if="displayDropAFieldText"
        class="d-flex"
        style="position: absolute; width: 100%; height: 100%; padding: 0px"
      >
        <div class="m-auto" style="font-size: 30px; text-align: center">
          Drag and Drop Fields
        </div>
      </div>
      <div v-else class="d-flex flex-column p-2">
        <template>
          <fields-group
            v-for="(fields, sobjectName) in selectedFields"
            :key="sobjectName"
            :sobject-name="sobjectName"
            :fields="fields"
            :soql="soql"
            class="mb-1"
            @click="onClickField"
            @rightClick="onRightClickField"
            @soqlConfig="onChangeSoqlConfig"
          >
          </fields-group>
        </template>
      </div>
    </drop>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FieldsGroup from '@/components/fields-group'

export default {
  components: {
    FieldsGroup,
  },
  props: {
    isMain: {
      type: Boolean,
      default: false,
    },
    soql: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
    displayDropAFieldText() {
      for (const sobject of Object.values(this.soql.sobjects)) {
        if (Object.values(sobject.fields)?.length) return false
      }
      return true
    },
    selectedFields() {
      const selectedFields = {}
      for (const [sobjectName, sobject] of Object.entries(this.soql.sobjects)) {
        selectedFields[sobjectName] = Object.values(sobject.fields) || []
      }
      return selectedFields
    },
  },
  methods: {
    clearAllSelectedFields() {
      this.$emit('clearAllFields')
    },
    onClickField({ sobjectName, field, fieldIndex }) {
      this.$emit('selectField', { sobjectName, field, fieldIndex })
    },
    onDropField({ sobjectName, field, fieldIndex }) {
      this.$emit('insertField', { sobjectName, field, fieldIndex })
    },
    onChangeSoqlConfig({ soqlConfig, sobjectName }) {
      this.$emit('soqlConfig', { soqlConfig, sobjectName })
    },
    onRightClickField({ sobjectName, field, fieldIndex }) {
      this.$emit('deleteField', { sobjectName, field, fieldIndex })
    },
  },
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
  background-color: var(--vscode-editor-background) !important;
  position: relative;
}

button {
  height: 30px !important;
}
</style>
