<template>
  <div>
    <div class="tab-header d-flex">
      <div
        v-for="(tab, tabIndex) in tabs"
        :key="tab.name"
        class="d-flex tab justify-content-between"
        :class="{ active: tab.name === value }"
      >
        <div class="tab-name d-flex" @click="onClickTab(tab.name)">
          <div class="my-auto">
            {{ tab.label }}
          </div>
        </div>
        <button
          v-if="Object.keys(tabs).length > 1"
          class="tab-close-button my-auto"
          @click.prevent="onClickRemoveTab({ name: tab.name, index: tabIndex })"
        >
          <i class="fa fa-close"></i>
        </button>
      </div>
      <button class="tab add-tab-button" @click="onClickNewTab">
        <i class="fa fa-plus px-auto"></i>
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data: () => {
    return {
      tabs: {},
      counter: 0,
    }
  },
  created() {
    this.tabs = this.$children
  },
  methods: {
    onClickNewTab() {
      this.counter++
      this.$emit('newTab', { name: 'editor-' + this.counter, label: 'Editor' })
    },
    onClickRemoveTab({ name, index }) {
      this.$emit('removeTab', { name, index })
    },
    onClickTab(name) {
      this.$emit('activate', name)
    },
  },
}
</script>

<style scopped>
.tab-header {
  height: var(--tabs-height);
  overflow-x: auto;
}

.tab {
  min-width: 90px;
  cursor: pointer;
  padding: 0px;
  border: none;
  border-radius: 0 !important;
  border-bottom: var(--tab-border-bottom-size) solid
    var(--vscode-tab-inactiveBackground) !important;
  background-color: var(--vscode-tab-inactiveBackground) !important;
  color: var(--vscode-tab-inactiveForeground) !important;
  height: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tab .tab-name {
  padding-left: 10px;
  width: 100%;
  color: var(--var-tab-inactiveForeground);
}

.tab.active {
  border-bottom: var(--tab-border-bottom-size) solid
    var(--vscode-tab-activeBackground) !important;
  color: var(--vscode-tab-activeForeground) !important;
}

.tab button {
  padding-right: 10px;
  background-color: transparent;
  border: none;
}

.tab:hover .tab-close-button {
  opacity: 1;
}

.tab-close-button {
  opacity: 0;
  border: none;
  background-color: transparent;
  color: var(--vscode-tab-inactiveForeground) !important;
}

.add-tab-button {
  width: 40px;
  min-width: 40px !important;
}

.add-tab-button:hover {
  color: var(--vscode-tab-activeForeground) !important;
  border-bottom: var(--tab-border-bottom-size) solid
    var(--vscode-tab-inactiveBackground) !important;
}
</style>
