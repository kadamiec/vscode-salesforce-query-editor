<template>
  <div class="d-flex flex-column noselect">
    <button
      id="clearAll"
      class="vscode-button btn mr-auto mb-1"
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
        <div class="m-auto" style="font-size: 30px">Drag and Drop a Field</div>
      </div>
      <div v-else class="d-flex flex-column p-2">
        <template v-if="configuration.groupSelectedFields">
          <fields-group
            v-for="(fields, sobjectName) in selectedFields"
            :key="sobjectName"
            :sobject-name="sobjectName"
            :fields="fields"
            class="mb-1"
            @click="onClickField"
            @soqlConfig="onChangeSoqlConfig"
          >
          </fields-group>
        </template>
        <div v-else>
          <template v-for="(fields, sobjectName) in selectedFields">
            <button
              v-for="(field, fieldIndex) in fields"
              :key="field.name"
              class="vscode-button ml-1 mb-1 noselect"
              @click="onClickField({ sobjectName, field, fieldIndex })"
            >
              >
              {{ sobjectName + '.' + field.name }}
            </button>
          </template>
        </div>
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
    selectedFields: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
    displayDropAFieldText() {
      return this.selectedFields && !Object.keys(this.selectedFields).length
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
  height: 30px;
}
</style>
