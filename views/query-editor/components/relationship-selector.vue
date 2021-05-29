<template>
  <div>
    <div ref="picklists-container" class="container">
      <select
        v-for="(picklist, index) in picklists"
        :ref="`picklist-${index}`"
        :key="index"
        v-model="picklist.selected"
        size="10"
        class="mr-2"
      >
        <option
          v-for="(option, optionIndex) in picklist.options"
          :key="index + '' + optionIndex"
          :value="option"
          @click="
            option.reference
              ? addPicklist(option, index, optionIndex)
              : removeNext(index)
          "
        >
          {{ option.value + (option.reference ? ' ➤' : '') }}
        </option>
      </select>
    </div>

    <button
      class="vscode-button my-1"
      :disabled="isAddFieldButtonDisabled"
      @click="onClickAddFieldButton"
    >
      Add Field
    </button>
    <button class="vscode-button my-1" @click="onClickAddAllButton">
      Add All
    </button>
    <button
      class="vscode-button my-1"
      :disabled="isClearAllButtonDisabled"
      @click="onClickClearAllButton"
    >
      Clear All
    </button>

    <div class="container text-wrap mt-2 mb-1">
      <span id="formula">{{ computedSelectedField }}</span>
    </div>

    <div id="fields-container">
      <button
        v-for="(field, index) in selectedFieldsList"
        :key="field.name"
        class="vscode-button mr-1 mb-1"
        @click="onClickRemoveFieldButton(field, index)"
      >
        {{ field.name }}
        <i class="fa fa-times fa-xs"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

const MAX_DEPTH_LEVEL = 5
export default {
  props: {
    sobjectName: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      default: null,
    },
    referenceName: {
      type: String,
      default: null,
    },
    referenceValue: {
      type: String,
      default: null,
    },
    selectedFields: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      picklists: [],
    }
  },
  mounted() {
    this.createPicklist(this.referenceName)
  },
  computed: {
    ...mapGetters({
      getSObjectFields: 'salesforce/getSObjectFields',
    }),
    ...mapState({
      apiVersion: (state) => state.salesforce.apiVersion,
    }),
    selectedFieldsList() {
      const referenceValue = this.referenceValue
      const selectedFields = this.selectedFields[this.sobjectName]
        ? Object.values(this.selectedFields[this.sobjectName])
        : []
      return selectedFields.filter((selectedField) =>
        selectedField.name
          .substr(0, selectedField.name.indexOf('.'))
          .includes(referenceValue)
      )
    },
    selectedField() {
      return this.picklists[this.picklists.length - 1].selected
    },
    selectedReference() {
      return (
        this.picklists[this.picklists.length - 1]?.reference ||
        this.referenceName
      )
    },
    computedFieldPath() {
      return (
        this.picklists.reduce((previous, current, index) => {
          if (index >= this.picklists.length - 1) return previous
          const field =
            typeof current.selected !== 'undefined'
              ? current.selected.value
              : ''
          return previous + (field ? '.' : '') + field
        }, this.referenceValue) + '.'
      )
    },
    computedSelectedField() {
      return (
        this.referenceValue +
        '.' +
        this.picklists.reduce(function (previous, current, index, array) {
          const valueToConcatenate =
            typeof current.selected !== 'undefined'
              ? current.selected.value
              : ''
          return (
            previous +
            (previous !== '' && index > 0 && valueToConcatenate ? '.' : '') +
            valueToConcatenate
          )
        }, '')
      )
    },
    isAddFieldButtonDisabled() {
      return (
        this.picklists.length >= 1 &&
        !this.picklists[this.picklists.length - 1].selected
      )
    },
    isClearAllButtonDisabled() {
      return this.selectedFieldsList && !this.selectedFieldsList.length
    },
  },
  methods: {
    ...mapActions({
      fetchSObjectsFields: 'salesforce/fetchSObjectsFields',
    }),
    addPicklist(option, index, optionIndex) {
      if (this.picklists.length - 1 < MAX_DEPTH_LEVEL) {
        this.picklists.splice(index + 1)
        this.createPicklist(option.reference)
        const picklistRef = `picklist-${index}`
        const optionElement = this.$refs[picklistRef][0][optionIndex]
        this.$refs['picklists-container'].scrollLeft =
          this.$refs['picklists-container'].scrollWidth -
          this.$refs['picklists-container'].clientWidth
        this.$nextTick(() => {
          this.$nextTick(() => {
            optionElement.scrollIntoView({
              behavior: 'smooth',
              inline: 'start',
              block: 'start',
            })
          })
        })
      }
    },
    createPicklist(reference) {
      const newPicklist = {
        options: [],
        selected: undefined,
        reference,
      }

      const fields = this.getSObjectFields({
        sobjectName: reference,
        username: this.username,
      })

      fields.forEach((field) => {
        newPicklist.options.push({
          value: field.name,
          label: field.label,
          name: field.name,
          type: field.type,
          details: field,
        })

        if (
          field.referenceTo.length === 1 &&
          field.relationshipName &&
          this.picklists.length < MAX_DEPTH_LEVEL - 1
        ) {
          newPicklist.options.push({
            value: field.relationshipName,
            reference: field.referenceTo[0],
          })
        }

        if (field.namePointing) {
          if (field.relationshipName) {
            newPicklist.options.push({
              value: field.relationshipName + '.Type',
              name: field.relationshipName + '.Type',
              details: {
                label: 'Type',
                name: reference + '.' + field.relationshipName + '.Type',
                polymorphicForeignKey: true,
                filterable: true,
                sortable: true,
                groupable: false,
                type: 'String',
              },
            })
            newPicklist.options.push({
              value: field.relationshipName + '.Name',
              name: field.relationshipName + '.Name',
              details: {
                label: 'Name',
                name: reference + '.' + field.relationshipName + '.Name',
                polymorphicForeignKey: true,
                filterable: true,
                sortable: true,
                groupable: false,
                type: 'String',
              },
            })
          }

          if (field.referenceTo.includes('User')) {
            newPicklist.options.push({
              value: field.relationshipName + '.FirstName',
              name: field.relationshipName + '.FirstName',
              details: {
                label: 'First Name',
                name: reference + '.' + field.relationshipName + '.FirstName',
                polymorphicForeignKey: true,
                filterable: true,
                sortable: true,
                groupable: false,
                type: 'String',
              },
            })
            newPicklist.options.push({
              value: field.relationshipName + '.LastName',
              name: field.relationshipName + '.LastName',
              details: {
                label: 'Last Name',
                name: reference + '.' + field.relationshipName + '.LastName',
                polymorphicForeignKey: true,
                filterable: true,
                sortable: true,
                groupable: false,
                type: 'String',
              },
            })
          }
        }
      })
      this.picklists.push(newPicklist)
      this.picklists = [...this.picklists]
      this.fetchSObjectsFields({
        fields,
        apiVersion: this.apiVersion,
        username: this.username,
      })
    },
    removeNext(index) {
      if (this.picklists.length > index + 1) {
        this.picklists.splice(index + 1)
      }
    },
    onClickRemoveFieldButton(field, index) {
      this.$emit('removeField', { fieldName: field.name })
    },
    onClickAddFieldButton() {
      if (
        !this.selectedFieldsList.find(
          (selectedField) => selectedField.name === this.computedSelectedField
        )
      ) {
        this.$emit('insertField', {
          parentRelationshipName: this.referenceValue,
          referenceName: this.selectedReference,
          field: {
            ...this.selectedField,
            computedFieldName: this.computedSelectedField,
          },
        })
      }
    },
    onClickAddAllButton() {
      const fields = []
      this.picklists[this.picklists.length - 1].options.forEach(
        (picklistOption) => {
          if (!picklistOption.reference) {
            const fieldName = this.computedFieldPath + picklistOption.value
            if (
              !this.selectedFieldsList.find(
                (selectedField) => selectedField.name === fieldName
              )
            ) {
              fields.push({ computedFieldName: fieldName, ...picklistOption })
            }
          }
        }
      )

      if (fields.length)
        this.$emit('insertAllFields', {
          parentRelationshipName: this.referenceValue,
          fields,
        })
    },
    onClickClearAllButton() {
      this.$emit('clearAllFields', this.referenceValue)
    },
  },
}
</script>

<style scoped>
.container {
  overflow-x: auto;
  white-space: nowrap;
  padding: 0;
}

#fields-container {
  overflow-y: auto;
  max-height: 200px;
}

#formula {
  color: var(--vscode-menu-foreground) !important;
  font-family: var(--vscode-font-family) !important;
  font-weight: var(--vscode-font-weight) !important;
  font-size: 15px !important;
}

#fields-container button {
  padding: 2px 5px;
}
</style>
