<template>
  <div v-if="fields.length" class="d-flex flex-column">
    <div class="fields-group-title d-flex">
      <p class="my-auto">{{ sobjectName }}</p>
      <i
        v-b-tooltip.hover
        class="clickable-icon fa fa-sliders-h my-auto pl-2"
        data-placement="top"
        title="Configuration"
        @click="onClickOpenConfiguration"
      ></i>
    </div>
    <div class="fields-group-container">
      <button
        v-for="(field, fieldIndex) in fields"
        :key="field.name"
        class="vscode-button ml-1 mb-1 noselect"
        @click="onClickField({ field, fieldIndex, sobjectName })"
        @contextmenu.prevent="
          onRightClickField({ field, fieldIndex, sobjectName })
        "
      >
        {{ field.name }}
        <i v-if="field.filters.length" class="fa fa-filter"></i>
        <i
          v-if="field.orderBy"
          class="fa"
          :class="{
            'fa-sort-alpha-up': field.orderBy.order === 'ASC',
            'fa-sort-alpha-down': field.orderBy.order === 'DESC',
          }"
        ></i>
      </button>
    </div>

    <soql-form
      ref="soql-form"
      :is-main="soql.sobjects[sobjectName].main"
      @soqlConfig="onChangeSoqlConfig"
    ></soql-form>
  </div>
</template>

<script>
import SoqlForm from '@/components/soql-form.vue'

export default {
  components: {
    SoqlForm,
  },
  props: {
    sobjectName: {
      type: String,
      default: null,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    soql: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    onClickField({ field, fieldIndex, sobjectName }) {
      this.$emit('click', { field, fieldIndex, sobjectName })
    },
    onRightClickField({ field, fieldIndex, sobjectName }) {
      this.$emit('rightClick', { field, fieldIndex, sobjectName })
    },
    onClickOpenConfiguration() {
      this.$refs['soql-form'].open()
    },
    onChangeSoqlConfig(soqlConfig) {
      this.$emit('soqlConfig', { soqlConfig, sobjectName: this.sobjectName })
    },
  },
}
</script>

<style scoped>
.fields-group-title {
  padding-left: 5px;
  font-size: 15px !important;
}

.fields-group-container {
  padding: 5px 5px;
}
</style>
