<template>
  <side-menu ref="side-menu">
    <div class="d-flex flex-column mt-2 px-2">
      <div class="mb-4">
        <div class="d-flex">
          <div class="w-100 pr-2">
            <label for="limit-input">Limit</label>
            <input
              id="limit-input"
              v-model.number="soqlConfig.limit"
              type="number"
              class="form-control"
              min="0"
              @input="onChange"
            />
          </div>
          <div class="w-100">
            <label for="offset-input">Offset</label>
            <input
              id="offset-input"
              v-model.number="soqlConfig.offset"
              type="number"
              class="form-control"
              min="0"
              max="2000"
              @input="onChange"
            />
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label class="d-flex flex-column mb-0">
          <label>ALL ROWS</label>
          <div class="switch">
            <input
              v-model="soqlConfig.allRows"
              type="checkbox"
              @change="onChange"
            />
            <span class="slider-input round"></span>
          </div>
        </label>
        <p>
          Use to query all records in an organization, including deleted records
          and archived activities.
        </p>
      </div>
      <div class="mb-4">
        <label class="d-flex flex-column mb-0">
          <label>FOR UPDATE</label>
          <div class="switch">
            <input
              v-model="soqlConfig.forUpdate"
              type="checkbox"
              @change="onChange"
            />
            <span class="slider-input round"></span>
          </div>
        </label>
        <p>
          Use to lock sObject records while they’re being updated in order to
          prevent race conditions and other thread safety problems.
        </p>
      </div>
      <div class="mb-4">
        <label class="d-flex flex-column mb-0">
          <label>FOR VIEW</label>
          <div class="switch">
            <input
              v-model="soqlConfig.forView"
              type="checkbox"
              @change="onChange"
            />
            <span class="slider-input round"></span>
          </div>
        </label>
        <p>
          Use to update LastViewedDate field and add a record to the
          RecentlyViewed object to reflect the recently viewed data for the
          retrieved record.
        </p>
      </div>
      <div class="mb-4">
        <label class="d-flex flex-column mb-0">
          <label>FOR REFERENCE</label>
          <div class="switch">
            <input
              v-model="soqlConfig.forReference"
              type="checkbox"
              @change="onChange"
            />
            <span class="slider-input round"></span>
          </div>
        </label>
        <p>
          Use to update LastReferencedDate field and add a record to the
          RecentlyViewed object to reflect the recently viewed data for the
          retrieved record.
        </p>
      </div>
    </div>
  </side-menu>
</template>

<script>
import SideMenu from '@/components/side-menu.vue'
export default {
  components: {
    SideMenu,
  },
  data: () => {
    return {
      soqlConfig: {
        limit: null,
        offset: null,
        allRows: false,
        forUpdate: false,
        forView: false,
        forReference: false,
      },
    }
  },
  methods: {
    open() {
      this.$refs['side-menu'].open()
    },
    close() {
      this.$refs['side-menu'].close()
      this.$emit('close')
    },
    onChange() {
      this.$emit('soqlConfig', this.soqlConfig)
    },
  },
}
</script>

<style scoped>
p {
  text-align: justify;
}
</style>
