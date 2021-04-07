<template>
  <b-card v-if="orderBy" no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button v-b-toggle.group-by-accordion block class="vscode-button"
        >Sort</b-button
      >
    </b-card-header>
    <b-collapse id="group-by-accordion" visible accordion="group-by-accordion">
      <b-card-body style="padding: 5px">
        <div class="d-flex">
          <div class="d-flex flex-column mr-2 w-100">
            <label for="orderByDirection">Order</label>
            <select
              id="orderByDirection"
              v-model="orderBy.order"
              @change="onUpdateOrderBy"
            >
              <option :value="null"></option>
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
          <div class="d-flex flex-column w-100">
            <label for="nullsOrder">Nulls Order</label>
            <select
              id="nullsOrder"
              v-model="orderBy.nullsOrder"
              @change="onUpdateOrderBy"
            >
              <option :value="null"></option>
              <option value="NULLS FIRST">Null First</option>
              <option value="NULLS LAST">Null Last</option>
            </select>
          </div>
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data: () => {
    return {
      orderBy: null,
    }
  },
  mounted() {
    this.orderBy = { ...this.value }
  },
  methods: {
    onUpdateOrderBy() {
      this.$emit('input', this.orderBy)
      this.$emit('change', this.orderBy)
    },
  },
}
</script>

<style scoped>
select {
  height: 30px !important;
}
</style>
