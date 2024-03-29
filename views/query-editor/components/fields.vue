<template>
  <div class="d-flex flex-column">
    <div id="fields-container">
      <div v-if="availableFields" class="d-flex flex-column">
        <div
          v-for="(field, fieldIndex) in availableFields"
          :key="field.name"
          class="px-3 py-1 field-entry-container"
          :class="field.reference ? 'cursor-pointer' : 'cursor-move'"
          @dblclick.prevent="
            field.reference
              ? null
              : onDoubleClick({ sobjectName, field, fieldIndex })
          "
        >
          <drag
            class="field-entry noselect"
            :class="field.reference ? 'cursor-pointer' : 'cursor-move'"
            :draggable="!field.reference"
            :transfer-data="{ sobjectName, field, fieldIndex }"
          >
            <template
              v-if="field.reference"
              style="width: 100%; position: relative"
            >
              <label class="noselect cursor-pointer"
                ><i class="fa fa-table relationship-icon"></i>{{ field.name
                }}<span class="pill">{{
                  field.numberOfSelectedFields
                }}</span></label
              >
              <div
                class="background-color"
                @click="onClickFieldReference(field)"
              ></div>
            </template>
            <template v-else style="width: 100%; position: relative">
              <label class="cursor-move">
                {{
                  field.name +
                  (configuration.fieldType.form && field.type
                    ? ' [' + field.type.toUpperCase() + ']'
                    : '')
                }}
                <span
                  v-if="field.details.nillable && configuration.field.required"
                  v-b-tooltip.hover
                  class="fa fa-asterisk fa-xs"
                  data-placement="top"
                  title="Required"
                ></span>
                <span
                  v-if="
                    field.details.updateable && configuration.field.updateable
                  "
                  v-b-tooltip.hover
                  class="fa fa-pen fa-xs"
                  data-placement="top"
                  title="Updateable"
                ></span>
              </label>
              <div class="background-color" style="pointer-events: none"></div>
            </template>
          </drag>
        </div>
      </div>
      <div v-else class="d-flex">
        <div class="m-auto">
          <i class="fa fa-spinner"></i>
        </div>
      </div>
    </div>

    <div class="mt-1 noselect">
      <button class="vscode-button" @click="onClickAddAllFields">
        Add All
      </button>
      <button
        class="vscode-button"
        :disabled="disableClearAllButton"
        @click="onClickClearAllFields"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    sobjectName: {
      type: String,
      default: null,
    },
  },
  data: () => {
    return {
      availableFields: [],
      selectedFields: {},
      selectedReferenceName: null,
      selectedReference: null,
      disableClearAllButton: null,
    }
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
  },
  methods: {
    onClickFieldReference(field) {
      this.selectedReferenceName = field.name
      this.selectedReference = field.reference
      this.$emit('selectFieldReference', {
        referenceName: field.name,
        reference: field.reference,
      })
    },
    removeField(fieldIndex) {
      this.$delete(this.availableFields, fieldIndex)
    },
    _createAvailableFieldsList(fields) {
      this.availableFields = [...fields].reduce((previous, current) => {
        const array = []

        if (!this.selectedFields[current.name]) {
          array.push({
            label: current.label,
            name: current.name,
            type: current.type,
            details: current,
          })
        }
        if (current.referenceTo.length === 1 && current.relationshipName) {
          const name =
            current.relationshipName || current.name.replace('Id', '')
          array.push({
            name,
            reference: current.referenceTo[0],
            numberOfSelectedFields: 0,
          })
        }

        if (current.namePointing) {
          if (current.relationshipName) {
            const polymorphicTypeFieldName = current.relationshipName + '.Type'
            if (!this.selectedFields[polymorphicTypeFieldName])
              array.push({
                name: polymorphicTypeFieldName,
                type: 'String',
                relationshipName: current.relationshipName,
                details: current,
              })

            const polymorphicNameFieldName = current.relationshipName + '.Name'
            if (!this.selectedFields[polymorphicNameFieldName])
              array.push({
                name: polymorphicNameFieldName,
                type: 'String',
                relationshipName: current.relationshipName,
                details: current,
              })
          }

          if (current.referenceTo.includes('User')) {
            const polymorphicFirstNameFieldName =
              current.relationshipName + '.FirstName'
            if (!this.selectedFields[polymorphicFirstNameFieldName])
              array.push({
                name: polymorphicFirstNameFieldName,
                type: 'String',
                relationshipName: current.relationshipName,
                details: current,
              })

            const polymorphicLastNameFieldName =
              current.relationshipName + '.LastName'
            if (!this.selectedFields[polymorphicLastNameFieldName])
              array.push({
                name: polymorphicLastNameFieldName,
                type: 'String',
                relationshipName: current.relationshipName,
                details: current,
              })
          }
        }

        return previous.concat(array)
      }, [])
    },
    onDoubleClick({ sobjectName, field, fieldIndex }) {
      this.$emit('insertField', { sobjectName, field, fieldIndex })
    },
    onClickAddAllFields() {
      this.$emit('insertAllFields', {
        fields: this.availableFields.filter((field) => !field.reference),
      })
    },
    onClickClearAllFields() {
      this.$emit('clearAllFields', { sobjectName: this.sobjectName })
    },
    setAvailableFieldList(fields, selectedFields) {
      this.selectedFields = selectedFields
      const selectedFieldNames = Object.keys(this.selectedFields)
      this.disableClearAllButton = !selectedFieldNames.length
      if (fields.length) {
        this._createAvailableFieldsList(fields)
        this.availableFields.forEach((field) => {
          field.numberOfSelectedFields = selectedFieldNames.filter(
            (selectedFieldName) =>
              selectedFieldName.split('.')[0] === field.name
          ).length
        })
      }
    },
    clearAvailableFieldsList() {
      this.availableFields = []
    },
  },
}
</script>

<style scoped>
label {
  margin: 0px 0px;
  z-index: 999;
}

#fields-container {
  height: 283px;
  border: 1px solid var(--vscode-inputOption-activeBackground) !important;
  border-radius: 0 !important;
  background-color: var(--vscode-editor-background) !important;
  color: var(--vscode-input-foreground) !important;
  overflow-y: auto;
}
.field-entry {
  width: 100%;
  height: 25px;
  padding-top: 2px;
  padding-left: 10px;
}

.field-entry-container {
  width: 100%;
  position: relative;
}

.background-color {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: transparent;
  z-index: 0;
}

.field-entry-container:hover .background-color {
  opacity: 0.05;
  background-color: white;
}

.pill {
  margin-left: 5px;
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-radius: 5px;
  padding: 0px 4px;
}

.relationship-icon {
  position: absolute;
  left: 6px;
  top: 9px;
}
</style>
