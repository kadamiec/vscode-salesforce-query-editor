<template>
  <td>
    <!-- EVERY UPDATEABLE FIELD -->
    <template v-if="isUpdateable">
      <!--  PICKLIST INPUT -->
      <select
        v-if="picklistOptions && picklistOptions.length"
        :value="value"
        :disabled="isDisabled"
        @input="debounceInput($event, recordId, recordIndex, fieldName, false)"
      >
        <option></option>
        <option
          v-for="(picklistOption, picklistOptionIndex) in picklistOptions"
          :key="picklistOptionIndex"
          :value="picklistOption.value"
        >
          {{ picklistOption.label }}
        </option>
      </select>

      <!--  BOOLEAN INPUT -->
      <label
        v-else-if="isBoolean"
        class="form-check-label custom-checkbox-container"
      >
        <input
          :value="value"
          :disabled="isDisabled"
          class="form-check-input"
          type="checkbox"
          @input="debounceInput($event, recordId, recordIndex, fieldName, true)"
        />
        <span class="checkmark" />
      </label>

      <!-- TEXT INPUT -->
      <div v-else class="cell">
        <input
          :disabled="isDisabled"
          :value="value"
          type="text"
          @input="
            debounceInput($event, recordId, recordIndex, fieldName, false)
          "
        />
      </div>
    </template>
    <template v-else>
      <template v-if="value !== null && typeof value === 'object'">
        <vue-json-pretty
          v-if="configuration.nestedResults.style"
          :data="value.records ? value.records : value"
          :show-line="false"
          :deep="
            configuration.nestedResults.expanded
              ? configuration.nestedResults.depth
                ? configuration.nestedResults.depth
                : 1
              : 0
          "
        >
        </vue-json-pretty>
        <pre v-else>{{
          JSON.stringify(value, undefined, 2).replace(/^\s*/g, '')
        }}</pre>
      </template>

      <!-- IDs OR REFERENCES LINKS-->
      <p v-else-if="isLink" class="record-id" @click="onClickRecordId(value)">
        {{ value }}
      </p>

      <!-- EVERYTHING ELSE THAT IT IS NOT UPDATEABLE -->
      <p v-else>
        {{ value }}
      </p>
    </template>
  </td>
</template>

<script>
import { debounce } from 'debounce'
import { mapState } from 'vuex'
import VueJsonPretty from 'vue-json-pretty'
import showToastMessage from '~/mixins/show-toast-message'

export default {
  components: {
    VueJsonPretty,
  },
  mixins: [showToastMessage],
  props: {
    value: {
      type: [String, Number, Object, Boolean],
      default: null,
    },
    recordId: {
      type: String,
      default: null,
    },
    recordIndex: {
      type: Number,
      default: null,
    },
    fieldName: {
      type: String,
      default: '',
    },
    isUpdateable: {
      type: Boolean,
      default: false,
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    isBoolean: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    picklistOptions: {
      type: Array,
      default: () => [],
    },
    username: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
  },
  methods: {
    debounceInput: debounce(function (
      e,
      recordId,
      recordIndex,
      fieldName,
      isCheckbox
    ) {
      let value = e.target.value
      if (isCheckbox) {
        value = e.target.checked
      }

      this.$emit('change', {
        value,
        recordId,
        recordIndex,
        fieldName,
      })
    },
    300),
    onClickRecordId(recordId) {
      this.showToastMessage(`Opening Record Id ${recordId}`)
      this.$axios
        .post(`${process.env.SALESFORCE_SERVER}/sfdx/record/view`, {
          recordId,
          username: this.username,
        })
        .then(() => {
          this.showToastMessage(`Record Id ${recordId} opened with Success.`)
        })
        .catch(() => {
          this.showToastMessage(`Record Id ${recordId} could not be opened.`)
        })
    },
  },
}
</script>
<style src="vue-json-pretty/lib/styles.css"></style>
<style scoped>
.cell {
  resize: horizontal;
  overflow: auto;
  width: 100%;
  height: 30px;
}

input,
input:focus,
input:disabled,
select,
select:focus,
select:disabled {
  color: var(--vscode-input-foreground) !important;
  width: 100% !important;
  height: 30px;
  border: none !important;
  padding: 0px 5px;
  background-color: transparent !important;
  text-overflow: ellipsis;
  overflow: hidden;
}

select:disabled {
  -webkit-appearance: none;
}

select:not(:disabled) {
  width: 100%;
}

select option {
  background-color: var(--vscode-editor-background);
}

td p {
  display: inline-block;
  vertical-align: middle;
  padding: 5px 5px !important;
  cursor: default;
}

td {
  border-color: var(--vscode-inputOption-activeBackground);
  display: table-cell;
  white-space: nowrap;
}

tr.edited td {
  border-bottom: thin solid var(--vscode-activityBarBadge-background);
}

/deep/ .vjs-tree {
  height: 100%;
}

/deep/ .vjs-tree.is-root > div:first-child {
  padding: 5px 0px;
}

select.no-arrow {
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
}

.record-id {
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
}

.record-id:hover {
  text-decoration: underline !important;
}
</style>
